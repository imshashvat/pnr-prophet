from flask import Blueprint, request, jsonify
from datetime import datetime
from backend.db.database import db
from backend.db.models import OutcomeLog

outcome_bp = Blueprint('outcome', __name__)


@outcome_bp.post('/outcome')
def log_outcome():
    data = request.get_json(silent=True) or {}
    # Expect at least: train_no, clazz, wl_position_at_booking, confirmed (0/1), pnr(optional), journey_date(optional)
    required = ['train_no', 'clazz', 'confirmed']
    missing = [k for k in required if k not in data]
    if missing:
        return jsonify({'error': 'missing_fields', 'details': missing}), 400

    entry = OutcomeLog(
        train_no=str(data.get('train_no')),
        clazz=str(data.get('clazz')),
        pnr=str(data.get('pnr')) if data.get('pnr') else None,
        confirmed=int(data.get('confirmed')),
        predicted_prob=float(data.get('predicted_prob', 0.0)) if data.get('predicted_prob') is not None else None,
        journey_date=datetime.strptime(data.get('journey_date'), '%Y-%m-%d').date() if data.get('journey_date') else None,
        created_at=datetime.utcnow(),
    )
    db.session.add(entry)
    db.session.commit()

    return jsonify({'success': True})
