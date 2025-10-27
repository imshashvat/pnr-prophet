from flask import Blueprint, request, jsonify
from backend.services.notify_service import NotifyService
from backend.utils.validator import validate_json
from backend.db.database import db
from backend.db.models import TrackedPNR

notify_bp = Blueprint('notify', __name__)


@notify_bp.post('/notify')
def notify():
    payload = request.get_json(silent=True) or {}
    # Subscribe flow
    if payload.get('subscribe') and payload.get('pnr') and payload.get('recipient') and payload.get('channel'):
        sub = TrackedPNR(
            pnr=str(payload['pnr']),
            channel=payload['channel'],
            recipient=payload['recipient'],
            threshold=payload.get('threshold')
        )
        db.session.add(sub)
        db.session.commit()
        return jsonify({'success': True, 'subscribed': True, 'id': sub.id})
    # Immediate notification flow
    required = {'channel', 'recipient', 'message'}
    if not required.issubset(payload.keys()):
        return jsonify({'error': 'missing_fields', 'details': sorted(required)}), 400
    ok = NotifyService().send(payload['channel'], payload['recipient'], payload['message'])
    return jsonify({'success': ok})
