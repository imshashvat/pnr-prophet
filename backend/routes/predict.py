from flask import Blueprint, request, jsonify
from backend.services.model_service import ModelService
from backend.services.feature_service import build_features
from backend.utils.validator import validate_json
from backend.utils.monitor import log_prediction

predict_bp = Blueprint('predict', __name__)


@predict_bp.post('/predict')
@validate_json(['train_no', 'source', 'destination', 'date', 'clazz', 'quota_type', 'wl_position'])
def predict():
    payload = request.get_json()

    # Feature engineering (temporal, route, interactions)
    features = build_features(payload)

    probability, top_factors = ModelService().predict(features)
    result = {
        'confirmation_chance': probability,
        'top_factors': top_factors,
        'input': payload,
        'features': features,
    }
    # async-safe simple log
    try:
        log_prediction(payload, result)
    except Exception:
        pass
    return jsonify(result)
