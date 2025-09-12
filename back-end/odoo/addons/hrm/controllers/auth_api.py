from odoo import http
from odoo.http import request
import logging

_logger = logging.getLogger(__name__)
class AuthAPI(http.Controller):

    @http.route('/api/auth/login', type='json', auth='none', methods=['POST'], csrf=False)
    def login(self, **kwargs):

        username = kwargs.get('username')
        password = kwargs.get('password')

        if not all([username, password]):
            return {
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": 400,
                    "message": "Bad Request: Missing username or password."
                }
            }

        try:
            uid = request.session.authenticate("odoo", username, password)
            _logger.error("Authenticated UID: %s", request.session)
            if uid:
                request.session.uid = uid
                request.session.username = username
                request.session.expiration = 86400
                return {
                    "jsonrpc": "2.0",
                    "id": None,
                    "result": {
                        "uid": uid,
                        "message": "Login successful"
                    }
                }
            else:
                return {
                    "jsonrpc": "2.0",
                    "id": None,
                    "error": {
                        "code": 401,
                        "message": "Authentication failed: Invalid login or password."
                    }
                }

        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": None,
                "error": {
                    "code": 500,
                    "message": f"An unexpected error occurred: {str(e)}"
                }
            }