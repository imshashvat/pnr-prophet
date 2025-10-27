from datetime import datetime
from backend.db.database import db


class TrackedPNR(db.Model):
    __tablename__ = 'tracked_pnrs'

    id = db.Column(db.Integer, primary_key=True)
    pnr = db.Column(db.String(16), nullable=False, index=True)
    channel = db.Column(db.String(16), nullable=False)  # 'email' | 'sms'
    recipient = db.Column(db.String(128), nullable=False)
    threshold = db.Column(db.Float, nullable=True)  # optional probability threshold
    last_status = db.Column(db.String(64), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return f"<TrackedPNR pnr={self.pnr} recipient={self.recipient}>"


class PredictionLog(db.Model):
    __tablename__ = 'prediction_logs'

    id = db.Column(db.Integer, primary_key=True)
    train_no = db.Column(db.String(16), index=True)
    clazz = db.Column(db.String(8), index=True)
    wl_position = db.Column(db.Integer)
    probability = db.Column(db.Float)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
