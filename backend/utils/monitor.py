from datetime import datetime
from typing import Any, Dict
from backend.db.database import db
from backend.db.models import PredictionLog


def log_prediction(payload: Dict[str, Any], result: Dict[str, Any]):
    entry = PredictionLog(
        train_no=str(payload.get('train_no')),
        clazz=str(payload.get('clazz')),
        wl_position=int(payload.get('wl_position', 0)),
        probability=float(result.get('confirmation_chance', 0.0)),
        created_at=datetime.utcnow(),
    )
    db.session.add(entry)
    db.session.commit()
