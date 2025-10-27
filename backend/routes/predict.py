from flask import Blueprint, request, jsonify
from backend.services.model_service import ModelService
from backend.utils.validator import validate_json
from backend.utils.monitor import log_prediction

predict_bp = Blueprint('predict', __name__)


@predict_bp.post('/predict')
@validate_json(['train_no', 'wl_position', 'day_of_week', 'distance', 'status', 'clazz'])
def predict():
    payload = request.get_json()
    probability, top_factors = ModelService().predict(payload)
    result = {
        'confirmation_chance': probability,
        'top_factors': top_factors,
        'input': payload
    }
    # async-safe simple log
    try:
        log_prediction(payload, result)
    except Exception:
        pass
    return jsonify(result)
