from flask import Blueprint, jsonify
from sqlalchemy import func
from backend.db.database import db
from backend.db.models import OutcomeLog

metrics_bp = Blueprint('metrics', __name__)


def _brier_score(probs, outcomes):
    # outcomes expected in {0,1}; here we don't have outcomes stored yet; placeholder 0.5 target
    if not probs:
        return None
    targets = [0.5] * len(probs)
    return sum((p - t) ** 2 for p, t in zip(probs, targets)) / len(probs)


@metrics_bp.get('/metrics/reliability')
def reliability():
    # Use OutcomeLog for reliability: bucket by predicted_prob and compute average observed confirmed
    rows = db.session.query(OutcomeLog.predicted_prob, OutcomeLog.confirmed).filter(OutcomeLog.predicted_prob != None).all()  # noqa: E711
    if not rows:
        return jsonify({'buckets': [], 'brier': None})
    pairs = [(float(p), int(o)) for p, o in rows]
    pairs.sort(key=lambda x: x[0])
    n = len(pairs)
    buckets = []
    for i in range(10):
        start = i * n // 10
        end = (i + 1) * n // 10 if i < 9 else n
        seg = pairs[start:end]
        if not seg:
            buckets.append({'bucket': i, 'avg_prob': None, 'avg_obs': None, 'count': 0})
        else:
            avg_prob = sum(p for p, _ in seg) / len(seg)
            avg_obs = sum(o for _, o in seg) / len(seg)
            buckets.append({'bucket': i, 'avg_prob': avg_prob, 'avg_obs': avg_obs, 'count': len(seg)})
    brier = sum((p - o) ** 2 for p, o in pairs) / len(pairs)
    return jsonify({'buckets': buckets, 'brier': brier})
