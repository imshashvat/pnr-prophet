import os


class NotifyService:
    def __init__(self):
        self.tw_sid = os.environ.get('TWILIO_ACCOUNT_SID')
        self.tw_token = os.environ.get('TWILIO_AUTH_TOKEN')
        self.tw_from = os.environ.get('TWILIO_FROM_NUMBER')

    def _twilio_available(self) -> bool:
        return bool(self.tw_sid and self.tw_token and self.tw_from)

    def send(self, channel: str, recipient: str, message: str) -> bool:
        channel = (channel or '').lower()
        # SMS via Twilio when configured
        if channel == 'sms' and self._twilio_available():
            try:
                from twilio.rest import Client  # lazy import
                client = Client(self.tw_sid, self.tw_token)
                client.messages.create(body=message, from_=self.tw_from, to=recipient)
                return True
            except Exception as e:
                print('[NotifyService] Twilio SMS error:', e)
        # Email integration (placeholder) or console fallback
        print(f"[Notify] {channel} -> {recipient}: {message}")
        return True
