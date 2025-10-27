import json
from datetime import datetime
from functools import lru_cache
from typing import Dict, Any

import math

# Simple festival dates map (can be extended or loaded from file)
FESTIVALS = {
    # yyyy-mm-dd -> label
    "2025-10-31": "Diwali",
    "2025-11-01": "Diwali",
    "2025-11-02": "Diwali",
    "2025-11-03": "Bhai Dooj",
}


@lru_cache(maxsize=1)
def _load_routes() -> Dict[str, Any]:
    try:
        with open('data/routes_coordinates.json', 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {}


def busy_index(train_no: str, month: int) -> float:
    # Placeholder: busy index as function of number of stations and month
    routes = _load_routes()
    stations = routes.get(str(train_no)) or []
    base = len(stations) / 10.0
    seasonal = 1.0 + (0.15 if month in [10, 11] else 0.0)  # festive uplift
    return round(min(2.0, max(0.1, base * seasonal)), 3)


def quota_weight(quota_type: str) -> float:
    qt = (quota_type or '').upper()
    # GNWL tends to clear better than RLWL/PQWL
    weights = {
        'GNWL': 1.0,
        'RLWL': 0.7,
        'PQWL': 0.6,
        'TQWL': 0.5,
    }
    return weights.get(qt, 0.8)


def build_features(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Derive rich features from user payload.
    Expected payload keys: train_no, source, destination, date (yyyy-mm-dd), clazz, quota_type, wl_position
    """
    train_no = str(payload.get('train_no', ''))
    date_str = str(payload.get('date', ''))
    clazz = str(payload.get('clazz', ''))
    quota = str(payload.get('quota_type', ''))
    wl = int(str(payload.get('wl_position', 0)) or 0)

    try:
        jdate = datetime.strptime(date_str, '%Y-%m-%d')
    except Exception:
        # fallback try common dd-mm-yyyy
        try:
            jdate = datetime.strptime(date_str, '%d-%m-%Y')
        except Exception:
            jdate = datetime.utcnow()

    today = datetime.utcnow().date()
    days_to_departure = (jdate.date() - today).days
    weekday = jdate.weekday()
    month = jdate.month

    # Route busy index and interactions
    rbi = busy_index(train_no, month)
    qwt = quota_weight(quota)
    lead_x_quota = days_to_departure * qwt
    busy_x_quota = rbi * qwt

    # Festival flag
    is_festival = 1 if date_str in FESTIVALS else 0

    features = {
        'train_no': train_no,
        'source': payload.get('source'),
        'destination': payload.get('destination'),
        'clazz': clazz,
        'quota_type': quota,
        'wl_position': wl,
        'days_to_departure': days_to_departure,
        'weekday': weekday,
        'month': month,
        'route_busy_index': rbi,
        'quota_weight': qwt,
        'lead_x_quota': lead_x_quota,
        'busy_x_quota': busy_x_quota,
        'festival_flag': is_festival,
    }

    return features
