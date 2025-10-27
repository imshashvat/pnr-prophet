from flask import Blueprint, request, jsonify
from backend.utils.validator import require_params

trends_bp = Blueprint('trends', __name__)


@trends_bp.get('/trends')
@require_params(['train_no', 'clazz'])
def get_trends():
    train_no = request.args.get('train_no')
    clazz = request.args.get('clazz')
    # Placeholder aggregation; replace with DB query results
    return jsonify({
        'train_no': train_no,
        'clazz': clazz,
        'weekly_rates': [
            {'week': 'W1', 'rate': 0.52},
            {'week': 'W2', 'rate': 0.56},
            {'week': 'W3', 'rate': 0.61},
            {'week': 'W4', 'rate': 0.58},
        ],
        'seasonal': [
            {'month': 'Oct', 'rate': 0.63},
            {'month': 'Nov', 'rate': 0.59},
            {'month': 'Dec', 'rate': 0.71},
        ]
    })
