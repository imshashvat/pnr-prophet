from functools import wraps
from flask import request, jsonify

def require_params(keys):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            missing = [k for k in keys if not request.args.get(k)]
            if missing:
                return jsonify({'error': 'missing_params', 'details': missing}), 400
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def validate_json(keys):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            data = request.get_json(silent=True) or {}
            missing = [k for k in keys if k not in data]
            if missing:
                return jsonify({'error': 'missing_fields', 'details': missing}), 400
            return fn(*args, **kwargs)
        return wrapper
    return decorator
