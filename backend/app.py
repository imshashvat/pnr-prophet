import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from backend.routes.availability import availability_bp
from backend.routes.predict import predict_bp
from backend.routes.pnr import pnr_bp
from backend.routes.route import route_bp
from backend.routes.notify import notify_bp
from backend.routes.explain import explain_bp
from backend.routes.trends import trends_bp
from backend.routes.metrics import metrics_bp
from backend.routes.outcome import outcome_bp
from backend.db.database import init_db

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')

    CORS(app, resources={r"/*": {"origins": app.config.get('CORS_ORIGINS', '*')}})

    # Basic rate limiting
    Limiter(get_remote_address, app=app, default_limits=["100 per minute"])  # simple in-memory

    # Initialize DB
    init_db(app)

    @app.get('/health')
    def health():
        # include model info if available
        info = {"status": "ok"}
        try:
            import json, os
            metrics_path = os.path.join('backend', 'model', 'metrics.json')
            if os.path.exists(metrics_path):
                with open(metrics_path, 'r', encoding='utf-8') as f:
                    metrics = json.load(f)
                info.update({
                    'model_trained_at': metrics.get('trained_at'),
                    'last_auc': metrics.get('auc'),
                    'last_brier': metrics.get('brier'),
                })
        except Exception:
            pass
        return jsonify(info)

    # Register blueprints
    app.register_blueprint(availability_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(pnr_bp)
    app.register_blueprint(route_bp)
    app.register_blueprint(notify_bp)
    app.register_blueprint(explain_bp)
    app.register_blueprint(trends_bp)
    app.register_blueprint(metrics_bp)
    app.register_blueprint(outcome_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
