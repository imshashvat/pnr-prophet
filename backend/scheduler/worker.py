import time
from backend.scheduler.tasks import poll_pnr_statuses
from backend.app import create_app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        while True:
            poll_pnr_statuses()
            time.sleep(3 * 60 * 60)  # every 3 hours
