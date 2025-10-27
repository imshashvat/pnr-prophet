from flask import Blueprint, request, jsonify
from backend.services.model_service import ModelService
from backend.utils.validator import validate_json

explain_bp = Blueprint('explain', __name__)


@explain_bp.post('/explain')
@validate_json(['train_no', 'wl_position', 'day_of_week', 'distance', 'status', 'clazz'])
def explain():
    payload = request.get_json()
    result = ModelService().explain(payload)
    return jsonify(result)
