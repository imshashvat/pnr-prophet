from fastapi import FastAPI
from pydantic import BaseModel
import os
import joblib
import pandas as pd

app = FastAPI()

MODEL_PATH = os.environ.get('MODEL_PATH', 'backend/model/predictor.pkl')
CAL_PATH = os.environ.get('CALIBRATOR_PATH', 'backend/model/calibrator.pkl')
_model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
_cal = joblib.load(CAL_PATH) if os.path.exists(CAL_PATH) else None

class PredictPayload(BaseModel):
    train_no: str
    wl_position: int
    day_of_week: int
    distance: float
    status: str
    clazz: str

@app.post('/predict')
async def predict(payload: PredictPayload):
    if _model is None:
        # simple mock
        p = max(0.05, min(0.95, 1.0 - payload.wl_position/100.0))
        return { 'probability': round(float(p), 3) }
    X = pd.DataFrame([payload.dict()])
    if hasattr(_model, 'predict_proba'):
        proba = _model.predict_proba(X)[:,1]
        p = float(proba[0])
    else:
        pred = _model.predict(X)
        p = float(pred[0]) if hasattr(pred, '__len__') else float(pred)
    return { 'probability': round(p, 3) }
