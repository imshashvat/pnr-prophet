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
        # Minimal mock until real model provided
        wl = int(str(features.get('wl_position', 50)))
        base = max(0.05, min(0.95, 1.0 - wl / 100.0))
        prob = round(base, 2)
        top_factors = ['wl_position', 'day_of_week', 'clazz']
        return prob, top_factors

    def explain(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Return SHAP-like explanation summary.
        If a real model/explainer is loaded, compute contributions; otherwise, mock.
        """
        # Mocked SHAP-like contributions ordered by importance
        wl = int(str(features.get('wl_position', 50)))
        contributions = [
            {'feature': 'wl_position', 'value': wl, 'shap': round((50 - wl) / 100.0, 3)},
            {'feature': 'day_of_week', 'value': features.get('day_of_week'), 'shap': 0.05},
            {'feature': 'clazz', 'value': features.get('clazz'), 'shap': 0.03},
        ]
        prob, _ = self.predict(features)
        return {
            'probability': prob,
            'contributions': contributions,
            'top_features': [c['feature'] for c in contributions[:3]]
        }
