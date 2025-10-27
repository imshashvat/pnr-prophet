from datetime import datetime
from backend.db.database import db
from backend.db.models import TrackedPNR
from backend.services.rail_api_service import RailAPIService
from backend.services.notify_service import NotifyService


def _parse_wl(status: str) -> int:
    """Extract WL number from status like 'WL 12' or return large number if not WL."""
    s = (status or '').upper()
    if 'WL' in s:
        try:
            return int(''.join(ch for ch in s if ch.isdigit()))
        except Exception:
            return 999
    return 0 if any(k in s for k in ['CNF', 'RAC']) else 999


def poll_pnr_statuses():
    print(f"[Scheduler] Polling PNR statuses at {datetime.utcnow().isoformat()}Z")
    to_notify = []
    for sub in TrackedPNR.query.all():
        data = RailAPIService().get_pnr(sub.pnr)
        current = str(data.get('current_status', ''))
        if not current:
            continue
        changed = current != (sub.last_status or '')
        wl_num = _parse_wl(current)
        threshold_hit = sub.threshold is not None and wl_num != 999 and wl_num <= sub.threshold
        if changed or threshold_hit or any(k in current for k in ['CNF', 'RAC']):
            sub.last_status = current
            db.session.add(sub)
            to_notify.append((sub, current))
    if to_notify:
        db.session.commit()
        ns = NotifyService()
        for sub, current in to_notify:
            ns.send(sub.channel, sub.recipient, f"PNR {sub.pnr} status updated: {current}")
