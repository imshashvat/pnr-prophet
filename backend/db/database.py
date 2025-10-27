from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


def init_db(app):
    app.config.setdefault('SQLALCHEMY_DATABASE_URI', 'sqlite:///pnr.db')
    db.init_app(app)
    with app.app_context():
        # Import models before create_all
        from backend.db import models  # noqa: F401
        db.create_all()
