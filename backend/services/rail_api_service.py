import os
import requests
from typing import Dict, Any


class RailAPIService:
    """Integration layer for seat availability, PNR, and route.
    Uses RapidAPI (or similar) when keys are present, else falls back to mock data.
    Set env: RAIL_API_KEY, RAIL_API_HOST.
    """

    def __init__(self):
        self.api_key = os.environ.get('RAIL_API_KEY', '')
        self.api_host = os.environ.get('RAIL_API_HOST', '')

    def _headers(self):
        return {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": self.api_host,
        }

    def _can_call(self) -> bool:
        return bool(self.api_key and self.api_host)

    def get_availability(self, train_no: str, date: str, clazz: str) -> Dict[str, Any]:
        if self._can_call():
            try:
                # Example endpoint path; replace with actual provider path
                url = f"https://{self.api_host}/availability"
                params = {"train_no": train_no, "date": date, "class": clazz}
                r = requests.get(url, headers=self._headers(), params=params, timeout=15)
                r.raise_for_status()
                data = r.json()
                return data
            except Exception as e:
                print("[RailAPIService] availability error:", e)
        # Fallback mock
        return {
            'train_no': train_no,
            'date': date,
            'class': clazz,
            'availability': [
                { 'quota': 'GN', 'status': 'WL 12', 'last_updated': '2025-10-26T09:00:00Z' },
                { 'quota': 'TQ', 'status': 'RAC 4', 'last_updated': '2025-10-26T09:00:00Z' },
            ]
        }

    def get_pnr(self, pnr_no: str) -> Dict[str, Any]:
        if self._can_call():
            try:
                url = f"https://{self.api_host}/pnr-status"
                params = {"pnr": pnr_no}
                r = requests.get(url, headers=self._headers(), params=params, timeout=15)
                r.raise_for_status()
                return r.json()
            except Exception as e:
                print("[RailAPIService] pnr error:", e)
        # Fallback mock structure aligned to frontend types
        return {
            'pnr': pnr_no,
            'current_status': 'WL 10',
            'history': [
                { 'status': 'WL 15', 'time': '2025-10-25 10:00' },
                { 'status': 'WL 12', 'time': '2025-10-25 18:00' },
                { 'status': 'WL 10', 'time': '2025-10-26 09:00' },
            ],
            'coach': 'S2',
            'berth': '45'
        }
