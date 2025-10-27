from flask import Blueprint, jsonify
from backend.services.rail_api_service import RailAPIService

pnr_bp = Blueprint('pnr', __name__)


@pnr_bp.get('/pnr/<pnr_no>')
def get_pnr(pnr_no: str):
    data = RailAPIService().get_pnr(pnr_no)
    return jsonify(data)
