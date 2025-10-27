import json
from backend.app import create_app

app = create_app()
client = app.test_client()

def test_health():
    res = client.get('/health')
    assert res.status_code == 200


def test_predict_missing():
    res = client.post('/predict', json={})
    assert res.status_code == 400


def test_predict_ok():
    res = client.post('/predict', json={
        'train_no': '12345',
        'wl_position': 12,
        'day_of_week': 3,
        'distance': 300,
        'status': 'WL10',
        'clazz': 'SL'
    })
    assert res.status_code == 200
    data = json.loads(res.data)
    assert 'confirmation_chance' in data
