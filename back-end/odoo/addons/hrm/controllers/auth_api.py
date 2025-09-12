from odoo import http
from odoo.http import request, Response
import logging
import json
from odoo.exceptions import AccessDenied

_logger = logging.getLogger(__name__)

class AuthAPI(http.Controller):

    @http.route('/api/auth/login', type='http', auth='none', methods=['POST'], csrf=False, cors='*')
    def login(self, **kwargs):
        try:
            # Parse JSON body
            try:
                data = json.loads(request.httprequest.data.decode('utf-8'))
            except Exception:
                data = request.params

            username = data.get('username')
            password = data.get('password')

            if not all([username, password]):
                return Response(
                    json.dumps({"success": False, "message": "Thiếu tên đăng nhập hoặc mật khẩu."}, ensure_ascii=False),
                    content_type='application/json',
                    status=400
                )

            try:
                uid = request.session.authenticate("odoo", username, password)
            except AccessDenied:
                return Response(
                    json.dumps({"success": False, "message": "Tên đăng nhập hoặc mật khẩu không đúng."}, ensure_ascii=False),
                    content_type='application/json',
                    status=401
                )

            if uid:
                request.session.uid = uid
                request.session.username = username
                request.session.expiration = 86400

                session_id = request.session.sid

                # Build success response
                response = Response(
                    json.dumps({ "success": True, "message": "Đăng nhập thành công."}, ensure_ascii=False),
                    content_type='application/json',
                    status=200
                )

                return response
            else:
                return Response(
                    json.dumps({"success": False, "message": "Tên đăng nhập hoặc mật khẩu không đúng."}, ensure_ascii=False),
                    content_type='application/json',
                    status=401
                )

        except Exception as e:
            _logger.exception("Unexpected error in /api/auth/login")
            return Response(
                json.dumps({
                    "success": False,
                    "message": f"Lỗi server: {str(e)}, Vui lòng liên hệ với quản trị viên."
                }, ensure_ascii=False),
                content_type='application/json',
                status=500
            )
