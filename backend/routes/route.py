from flask import Blueprint, jsonify
import json
import os

route_bp = Blueprint('route', __name__)

@route_bp.get('/route/<train_no>')
def get_route(train_no: str):
    # Load from local data file if available
    data_path = os.path.join(os.getcwd(), 'data', 'routes_coordinates.json')
    if os.path.exists(data_path):
        try:
            with open(data_path, 'r', encoding='utf-8') as f:
                routes = json.load(f)
            stations = routes.get(train_no) or routes.get(str(train_no))
            if stations:
                return jsonify({ 'train_no': train_no, 'stations': stations })
        except Exception:
            pass
    # Fallback example
    return jsonify({
        'train_no': train_no,
        'stations': [
            {'code': 'NDLS', 'name': 'New Delhi', 'lat': 28.6139, 'lng': 77.2090},
            {'code': 'CNB', 'name': 'Kanpur Central', 'lat': 26.4499, 'lng': 80.3319},
            {'code': 'LKO', 'name': 'Lucknow', 'lat': 26.8467, 'lng': 80.9462},
        ]
    })
