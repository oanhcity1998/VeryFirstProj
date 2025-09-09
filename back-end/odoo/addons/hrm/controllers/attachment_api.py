import base64
import json
from odoo import http
from odoo.http import request

class AttachmentAPI(http.Controller):
    
    @http.route('/api/hr/employees/<int:employee_id>/attachments', 
                
                type='http', auth='user', methods=['POST'], csrf=False)
    def upload_employee_attachment(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        Attachment = request.env['ir.attachment'].sudo()

        employee = Employee.search([('id', '=', employee_id)], limit=1)
        if not employee:
            return request.make_response(
                json.dumps({"error": "Employee not found"}),
                headers=[('Content-Type', 'application/json')],
                status=404
            )

        uploaded_file = request.httprequest.files.get('file')
        if not uploaded_file:
            return request.make_response(
                json.dumps({"error": "No file provided"}),
                headers=[('Content-Type', 'application/json')],
                status=400
            )

        file_content = uploaded_file.read()
        encoded_content = base64.b64encode(file_content).decode('utf-8')

        attachment = Attachment.create({
            'name': uploaded_file.filename,
            'datas': encoded_content,
            'res_model': 'hr.employee',
            'res_id': employee.id,
            'mimetype': uploaded_file.mimetype
        })

        return request.make_response(
            json.dumps({
                "id": attachment.id,
                "url": f"/web/content/{attachment.id}",
                "name": attachment.name
            }),
            headers=[('Content-Type', 'application/json')],
            status=201
        )
    
    @http.route('/api/hr/employees/<int:employee_id>/attachments/<int:att_id>', type='http', auth='user', methods=['GET'], csrf=False)
    def download_employee_attachment(self, employee_id, att_id, **kwargs):
      Employee = request.env['hr.employee'].sudo()
      Attachment = request.env['ir.attachment'].sudo()

      employee = Employee.search([('id','=',employee_id)], limit=1)
      if not employee:
          return request.make_response(
              json.dumps({"error": "Employee not found"}),
              headers=[('Content-Type','application/json')],
              status=404
          )

      attachment = Attachment.search([
          ('id','=',att_id),
          ('res_model','=','hr.employee'),
          ('res_id','=',employee.id)
      ], limit=1)
      if not attachment:
          return request.make_response(
              json.dumps({"error": "Attachment not found"}),
              headers=[('Content-Type','application/json')],
              status=404
          )

      return request.make_response(
          attachment.datas,
          headers=[
              ('Content-Type', attachment.mimetype or 'application/octet-stream'),
              ('Content-Disposition', f'attachment; filename="{attachment.name}"')
          ]
      )