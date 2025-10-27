import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from backend.routes.availability import availability_bp
from backend.routes.predict import predict_bp
from backend.routes.pnr import pnr_bp
from backend.routes.route import route_bp
from backend.routes.notify import notify_bp
from backend.routes.explain import explain_bp
from backend.routes.trends import trends_bp
from backend.db.database import init_db

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object('backend.config.Config')

    CORS(app, resources={r"/*": {"origins": app.config.get('CORS_ORIGINS', '*')}})

    # Initialize DB
    init_db(app)

    @app.get('/health')
    def health():
        return jsonify({"status": "ok"})

    # Register blueprints
    app.register_blueprint(availability_bp)
    app.register_blueprint(predict_bp)
    app.register_blueprint(pnr_bp)
    app.register_blueprint(route_bp)
    app.register_blueprint(notify_bp)
    app.register_blueprint(explain_bp)
    app.register_blueprint(trends_bp)

    return app


if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
