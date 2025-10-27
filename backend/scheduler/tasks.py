from datetime import datetime
from backend.db.database import db
from backend.db.models import TrackedPNR
from backend.services.rail_api_service import RailAPIService
from backend.services.notify_service import NotifyService


def poll_pnr_statuses():
    print(f"[Scheduler] Polling PNR statuses at {datetime.utcnow().isoformat()}Z")
    to_notify = []
    for sub in TrackedPNR.query.all():
        data = RailAPIService().get_pnr(sub.pnr)
        current = str(data.get('current_status', ''))
        if current and current != (sub.last_status or ''):
            # Update DB
            sub.last_status = current
            db.session.add(sub)
            to_notify.append((sub, current))
    if to_notify:
        db.session.commit()
        ns = NotifyService()
        for sub, current in to_notify:
            ns.send(sub.channel, sub.recipient, f"PNR {sub.pnr} status updated: {current}")
