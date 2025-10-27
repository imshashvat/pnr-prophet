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
    # Optional override for header names and endpoint paths
    self.key_header = os.environ.get('RAIL_API_KEY_HEADER_NAME', 'X-RapidAPI-Key')
    self.host_header = os.environ.get('RAIL_API_HOST_HEADER_NAME', 'X-RapidAPI-Host')
    self.availability_path = os.environ.get('RAIL_AVAILABILITY_PATH', '/availability')
    self.pnr_path = os.environ.get('RAIL_PNR_PATH', '/pnr-status')

    def _headers(self):
        headers = {}
        if self.api_key:
            headers[self.key_header] = self.api_key
        if self.api_host:
            headers[self.host_header] = self.api_host
        return headers

    def _can_call(self) -> bool:
        return bool(self.api_key and self.api_host)

    def get_availability(self, train_no: str, date: str, clazz: str) -> Dict[str, Any]:
        if self._can_call():
            try:
                # Build full URL using configured path
                base = f"https://{self.api_host}" if not self.api_host.startswith('http') else self.api_host
                url = f"{base}{self.availability_path}"
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
                base = f"https://{self.api_host}" if not self.api_host.startswith('http') else self.api_host
                url = f"{base}{self.pnr_path}"
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
