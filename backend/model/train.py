import os
import json
from datetime import datetime
from typing import List

import numpy as np
import pandas as pd
from sklearn.calibration import CalibratedClassifierCV
from sklearn.model_selection import TimeSeriesSplit
from sklearn.metrics import roc_auc_score, brier_score_loss

try:
    import lightgbm as lgb
except Exception:
    lgb = None
try:
    import xgboost as xgb
except Exception:
    xgb = None

import joblib


def load_data(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def build_features(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    # Example domain features
    df['day_of_week'] = pd.to_datetime(df['booking_date']).dt.dayofweek
    df['month'] = pd.to_datetime(df['booking_date']).dt.month
    df['lead_time'] = (pd.to_datetime(df['journey_date']) - pd.to_datetime(df['booking_date'])).dt.days
    # Placeholder route_busy_index
    df['route_busy_index'] = df.groupby(['train_no', 'month'])['wl_position'].transform('mean').fillna(0)
    # Interactions
    df['lead_x_busy'] = df['lead_time'] * df['route_busy_index']
    return df


def split_Xy(df: pd.DataFrame, target: str):
    y = df[target].astype(int)
    X = df.drop(columns=[target])
    return X, y


def train_model(df: pd.DataFrame, categorical: List[str], target: str = 'confirmed'):
    df = build_features(df)
    X, y = split_Xy(df, target)

    # Use TimeSeriesSplit for temporal validation
    tss = TimeSeriesSplit(n_splits=5)
    last_auc, last_brier = None, None
    best_model = None

    # Prefer LightGBM
    if lgb is not None:
        lgb_cats = [X.columns.get_loc(c) for c in categorical if c in X.columns]
        for train_idx, test_idx in tss.split(X):
            Xtr, Xte = X.iloc[train_idx], X.iloc[test_idx]
            ytr, yte = y.iloc[train_idx], y.iloc[test_idx]
            train_set = lgb.Dataset(Xtr, label=ytr, categorical_feature=lgb_cats, free_raw_data=False)
            valid_set = lgb.Dataset(Xte, label=yte, categorical_feature=lgb_cats, free_raw_data=False)
            params = {
                'objective': 'binary',
                'metric': ['auc'],
                'verbosity': -1,
                'learning_rate': 0.05,
                'num_leaves': 63,
                'feature_pre_filter': False,
            }
            model = lgb.train(params, train_set, valid_sets=[valid_set], num_boost_round=500, early_stopping_rounds=50)
            proba = model.predict(Xte, num_iteration=model.best_iteration)
            last_auc = roc_auc_score(yte, proba)
            last_brier = brier_score_loss(yte, proba)
            best_model = model
        calibrator = None
        return best_model, calibrator, {'auc': last_auc, 'brier': last_brier}

    # Fallback to XGBoost with categorical enabled if available
    if xgb is not None:
        for train_idx, test_idx in tss.split(X):
            Xtr, Xte = X.iloc[train_idx], X.iloc[test_idx]
            ytr, yte = y.iloc[train_idx], y.iloc[test_idx]
            clf = xgb.XGBClassifier(
                n_estimators=500, learning_rate=0.05, max_depth=6, subsample=0.9, colsample_bytree=0.9,
                enable_categorical=True, eval_metric='auc'
            )
            clf.fit(Xtr, ytr)
            proba = clf.predict_proba(Xte)[:, 1]
            last_auc = roc_auc_score(yte, proba)
            last_brier = brier_score_loss(yte, proba)
            best_model = clf
        # Optional calibration
        calibrator = CalibratedClassifierCV(best_model, cv=3, method='sigmoid')
        calibrator.fit(X, y)
        return best_model, calibrator, {'auc': last_auc, 'brier': last_brier}

    # Final fallback: simple logistic calibration on wl_position
    from sklearn.linear_model import LogisticRegression
    for train_idx, test_idx in tss.split(X):
        Xtr, Xte = X.iloc[train_idx], X.iloc[test_idx]
        ytr, yte = y.iloc[train_idx], y.iloc[test_idx]
        lr = LogisticRegression(max_iter=1000)
        lr.fit(Xtr.select_dtypes(include=[np.number]), ytr)
        proba = lr.predict_proba(Xte.select_dtypes(include=[np.number]))[:, 1]
        last_auc = roc_auc_score(yte, proba)
        last_brier = brier_score_loss(yte, proba)
        best_model = lr
    calibrator = None
    return best_model, calibrator, {'auc': last_auc, 'brier': last_brier}


def main():
    raw_path = os.environ.get('TRAIN_DATA', 'data/processed_data.csv')
    out_dir = 'backend/model'
    os.makedirs(out_dir, exist_ok=True)

    df = load_data(raw_path)
    model, calibrator, metrics = train_model(df, categorical=['train_no', 'clazz', 'quota'])

    joblib.dump(model, os.path.join(out_dir, 'predictor.pkl'))
    if calibrator is not None:
        joblib.dump(calibrator, os.path.join(out_dir, 'calibrator.pkl'))

    with open(os.path.join(out_dir, 'metrics.json'), 'w', encoding='utf-8') as f:
        json.dump({'trained_at': datetime.utcnow().isoformat() + 'Z', **metrics}, f, indent=2)

    print('Saved model to', out_dir, 'with metrics', metrics)


if __name__ == '__main__':
    main()
