from flask import Blueprint, request, jsonify
from backend.utils.validator import require_params

trends_bp = Blueprint('trends', __name__)


@trends_bp.get('/trends')
@require_params(['train_no', 'clazz'])
def get_trends():
    train_no = request.args.get('train_no')
    clazz = request.args.get('clazz')
    month = request.args.get('month')  # optional focus month
    # Placeholder aggregation; replace with DB query results and historical logs
    data = {
        'train_no': train_no,
        'clazz': clazz,
        'monthly': [
            {'month': 'Jan', 'avg_prob': 0.55},
            {'month': 'Feb', 'avg_prob': 0.58},
            {'month': 'Mar', 'avg_prob': 0.6},
            {'month': 'Apr', 'avg_prob': 0.57},
            {'month': 'May', 'avg_prob': 0.53},
            {'month': 'Jun', 'avg_prob': 0.5},
            {'month': 'Jul', 'avg_prob': 0.48},
            {'month': 'Aug', 'avg_prob': 0.51},
            {'month': 'Sep', 'avg_prob': 0.54},
            {'month': 'Oct', 'avg_prob': 0.45},
            {'month': 'Nov', 'avg_prob': 0.47},
            {'month': 'Dec', 'avg_prob': 0.6},
        ],
        'wl_vs_prob': [
            {'wl': 5, 'prob': 0.88},
            {'wl': 10, 'prob': 0.8},
            {'wl': 20, 'prob': 0.65},
            {'wl': 30, 'prob': 0.5},
            {'wl': 40, 'prob': 0.38},
            {'wl': 60, 'prob': 0.22},
        ]
    }
    return jsonify(data)
