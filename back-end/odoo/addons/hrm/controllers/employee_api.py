import json
from odoo import http
from odoo.http import request
from datetime import datetime

class EmployeeAPI(http.Controller):

    @http.route('/api/hr/employees', type='json', auth='user', methods=['POST'], csrf=False)
    def create_employee(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"))
            else:
                data = kwargs 
        except Exception:
            return {"error": "Invalid JSON body"}

        required_fields = ["name", "birthday", "gender", "department_id", "job_id", "x_id_number"]
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"Missing required field: {field}"}

        employee = request.env["hr.employee"].sudo().create({
            "name": data.get("name"),
            "birthday": data.get("birthday"),
            "gender": data.get("gender"),
            "work_phone": data.get("work_phone"),
            "work_email": data.get("work_email"),
            "department_id": data.get("department_id"),
            "job_id": data.get("job_id"),
            "x_id_number": data.get("x_id_number"),
            "x_id_issued_place": data.get("x_id_issued_place"),
            "x_id_issued_date": data.get("x_id_issued_date"),
            "permanent_address": data.get("permanent_address"),
            "x_temporary_address": data.get("x_temporary_address"),
            "x_tax_id": data.get("x_tax_id"),
            "x_insurance_id": data.get("x_insurance_id"),
            "x_bank_account": data.get("x_bank_account"),
        })

        contract_data = data.get("contract")
        if contract_data:
            request.env["hr.contract.custom"].sudo().create({
                "name": f"HĐ cho {employee.name}",
                "employee_id": employee.id,
                "x_contract_type": contract_data.get("x_contract_type"),
                "x_contract_term": contract_data.get("x_contract_term"),
                "date_start": contract_data.get("date_start"),
                "date_end": contract_data.get("date_end"),
                "wage": contract_data.get("wage"),
                "x_bonus": contract_data.get("x_bonus"),
                "state": "draft",
            })

        return {"id": employee.id, "message": "Created successfully"}
    
    @http.route('/api/hr/employees', type='http', auth='user', methods=['GET'], csrf=False)
    def list_employees(self, **kwargs):
        q = kwargs.get('q', '').strip()
        department_id = kwargs.get('department_id')
        job_id = kwargs.get('job_id')
        status = kwargs.get('status', '').lower()
        page = int(kwargs.get('page', 1))
        limit = int(kwargs.get('limit', 25))

        domain = []

        if q:
            domain.append('|')
            domain.append(('name', 'ilike', q))
            domain.append(('x_id_number', 'ilike', q))

        if department_id:
            domain.append(('department_id', '=', int(department_id)))

        if job_id:
            domain.append(('job_id', '=', int(job_id)))

        if status:
            if status in ['active', 'inactive']:
                domain.append(('active', '=', True if status == 'active' else False))

        total = request.env['hr.employee'].sudo().search_count(domain)

        offset = (page - 1) * limit
        employees = request.env['hr.employee'].sudo().search(domain, offset=offset, limit=limit)

        data = []
        for emp in employees:
            data.append({
                "id": emp.id,
                "name": emp.name,
                "department_id": emp.department_id.id if emp.department_id else None,
                "job_id": emp.job_id.id if emp.job_id else None,
                "status": "active" if emp.active else "inactive",
            })

        return request.make_response(
        json.dumps({
            "data": data,
            "meta": {"page": page, "limit": limit, "total": total}
        }),
        headers=[('Content-Type', 'application/json')]
    )

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['GET'], csrf=False)
    def get_employee(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        Contract = request.env['hr.contract.custom'].sudo()
        Attachment = request.env['ir.attachment'].sudo()

        employee = Employee.search([('id', '=', employee_id)], limit=1)
        if not employee:
            return request.make_response(
                json.dumps({"error": "Employee not found"}),
                headers=[('Content-Type', 'application/json')],
                status=404
            )

        profile = {
            "id": employee.id,
            "name": employee.name,
            "birthday": str(employee.birthday) if employee.birthday else None,
            "gender": employee.gender,
            "work_phone": employee.work_phone,
            "work_email": employee.work_email,
            "department": employee.department_id.name if employee.department_id else None,
            "job": employee.job_id.name if employee.job_id else None,
            "x_id_number": employee.x_id_number,
            "x_id_issued_place": employee.x_id_issued_place,
            "x_id_issued_date": str(employee.x_id_issued_date) if employee.x_id_issued_date else None,
            "permanent_address": employee.permanent_address,
            "x_temporary_address": employee.x_temporary_address,
            "x_tax_id": employee.x_tax_id,
            "x_insurance_id": employee.x_insurance_id,
            "x_bank_account": employee.x_bank_account,
        }

        contracts = []
        for c in Contract.search([('employee_id', '=', employee.id)]):
            contracts.append({
                "id": c.id,
                "x_contract_type": c.x_contract_type,
                "x_contract_term": c.x_contract_term,
                "date_start": str(c.date_start) if c.date_start else None,
                "date_end": str(c.date_end) if c.date_end else None,
                "wage": c.wage,
                "x_bonus": c.x_bonus,
            })

        attachments = []
        for att in Attachment.search([
            ('res_model', '=', 'hr.employee'),
            ('res_id', '=', employee.id)
        ]):
            attachments.append({
                "id": att.id,
                "name": att.name,
                "url": f"/web/content/{att.id}",
                "mimetype": att.mimetype,
            })

        response = {
            "profile": profile,
            "contracts": contracts,
            "attachments": attachments,
        }

        return request.make_response(
            json.dumps(response),
            headers=[('Content-Type', 'application/json')]
        )


    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['PUT'], csrf=False)
    def update_employee(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        employee = Employee.browse(employee_id)

        if not employee.exists():
            return request.make_json_response({"error": "Employee not found"}, status=404)

        # Lấy JSON body từ request
        try:
            data = request.httprequest.get_json(force=True, silent=True) or {}
        except Exception:
            data = {}

        allowed_fields = [
            'name', 'work_email', 'work_phone',
            'birthday', 'gender',
        ]

        updates = {}
        ignored_fields = {}
        unchanged_fields = {}

        for field in allowed_fields:
            if field in data:
                new_value = data[field]
                old_value = employee[field]

                if new_value in (None, "", False):
                    ignored_fields[field] = {
                        "reason": "empty",
                        "old_value": old_value,
                        "new_value": new_value
                    }
                    continue

                if str(old_value) == str(new_value):
                    unchanged_fields[field] = {
                        "reason": "unchanged",
                        "old_value": old_value,
                        "new_value": new_value
                    }
                    continue

                updates[field] = new_value

        if updates:
            employee.write(updates)
            return request.make_json_response({
                "success": True,
                "updated_fields": updates,
                "ignored_fields": ignored_fields,
                "unchanged_fields": unchanged_fields
            }, status=200)
        else:
            return request.make_json_response({
                "message": "No fields updated (empty or unchanged)",
                "ignored_fields": ignored_fields,
                "unchanged_fields": unchanged_fields,
                "received_data": data
            }, status=200)

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['DELETE'], csrf=False)
    def delete_employee(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        employee = Employee.search([('id', '=', employee_id)], limit=1)

        if not employee:
            return request.make_response(
                json.dumps({"error": "Employee not found"}),
                headers=[('Content-Type', 'application/json')],
                status=404
            )

        try:
            employee.write({'active': False})
        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

        return request.make_response(
            json.dumps({"message": "Employee marked inactive"}),
            headers=[('Content-Type', 'application/json')]
        )







