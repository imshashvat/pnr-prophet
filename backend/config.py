import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-secret')
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '*')
    RAIL_API_KEY = os.environ.get('RAIL_API_KEY', '')
    RAIL_API_HOST = os.environ.get('RAIL_API_HOST', '')
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///pnr.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    NOTIFY_PROVIDER = os.environ.get('NOTIFY_PROVIDER', 'console')
    GOOGLE_MAPS_API_KEY = os.environ.get('GOOGLE_MAPS_API_KEY', '')
