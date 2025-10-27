from flask import Blueprint, request, jsonify
from backend.services.rail_api_service import RailAPIService
from backend.utils.validator import require_params

availability_bp = Blueprint('availability', __name__)


@availability_bp.get('/availability')
@require_params(['train_no', 'date', 'clazz'])
def get_availability():
    train_no = request.args.get('train_no')
    date = request.args.get('date')
    clazz = request.args.get('clazz')

    data = RailAPIService().get_availability(train_no, date, clazz)
    return jsonify(data)
