import os
import joblib
from typing import Dict, Tuple, List, Any

class ModelService:
    def __init__(self):
        self.model_path = os.environ.get('MODEL_PATH', 'backend/model/predictor.pkl')
        self.calibrator_path = os.environ.get('CALIBRATOR_PATH', 'backend/model/calibrator.pkl')
        self.model = None
        self.calibrator = None
        self._load()

    def _load(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
            if os.path.exists(self.calibrator_path):
                self.calibrator = joblib.load(self.calibrator_path)
        except Exception as e:
            print('Model load error:', e)

    def predict(self, features: Dict) -> Tuple[float, List[str]]:
        """Heuristic placeholder using new features until real model is trained.
        Considers wl_position, quota_weight, route_busy_index, and days_to_departure.
        """
        wl = int(str(features.get('wl_position', 50)))
        qwt = float(features.get('quota_weight', 0.8))
        rbi = float(features.get('route_busy_index', 1.0))
        lead = int(str(features.get('days_to_departure', 15)))
        fest = int(str(features.get('festival_flag', 0)))

        # Base from WL
        base = 1.0 - min(0.95, wl / 100.0)
        # Quota and route modifiers
        mod = 0.15 * (qwt - 0.8) + 0.1 * (1.2 - min(1.2, rbi)) + 0.1 * (lead / 30.0)
        # Festival penalty
        penalty = 0.1 if fest else 0.0
        prob = max(0.01, min(0.99, base + mod - penalty))
        prob = round(prob, 2)
        top_factors = ['wl_position', 'quota_type', 'route_busy_index', 'days_to_departure']
        return prob, top_factors

    def explain(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Return SHAP-like explanation summary.
        If a real model/explainer is loaded, compute contributions; otherwise, mock.
        """
        # Mocked SHAP-like contributions ordered by importance
        wl = int(str(features.get('wl_position', 50)))
        contributions = [
            {'feature': 'wl_position', 'value': wl, 'shap': round((50 - wl) / 100.0, 3)},
            {'feature': 'quota_weight', 'value': features.get('quota_weight'), 'shap': 0.06},
            {'feature': 'route_busy_index', 'value': features.get('route_busy_index'), 'shap': 0.04},
        ]
        prob, _ = self.predict(features)
        return {
            'probability': prob,
            'contributions': contributions,
            'top_features': [c['feature'] for c in contributions[:3]]
        }
