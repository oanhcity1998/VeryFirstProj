import json
from odoo import http
from odoo.http import request

class ContractAPI(http.Controller):
    
    @http.route('/api/hr/employees/<int:employee_id>/contracts', type='http', auth='user', methods=['GET'], csrf=False)
    def get_employee_contracts(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        Contract = request.env['hr.contract.custom'].sudo()

        employee = Employee.search([('id', '=', employee_id)], limit=1)
        if not employee:
            return request.make_response(
                json.dumps({"error": "Employee not found"}),
                headers=[('Content-Type', 'application/json')],
                status=404
            )

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
                "state": c.state,
            })

        return request.make_response(
            json.dumps({"contracts": contracts}),
            headers=[('Content-Type', 'application/json')]
        )
  

    @http.route('/api/hr/employees/<int:employee_id>/contracts', 
                type='http', auth='user', methods=['POST'], csrf=False)
    def create_employee_contract(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        Contract = request.env['hr.contract.custom'].sudo()

        employee = Employee.search([('id', '=', employee_id)], limit=1)
        if not employee:
            return request.make_response(
                json.dumps({"error": "Employee not found"}),
                headers=[('Content-Type', 'application/json')],
                status=404
            )

        try:
            data = json.loads(request.httprequest.data.decode("utf-8"))
        except Exception:
            return request.make_response(
                json.dumps({"error": "Invalid JSON body"}),
                headers=[('Content-Type', 'application/json')],
                status=400
            )

        required_fields = ["x_contract_type", "x_contract_term", "date_start", "date_end", "wage", "x_bonus"]
        for field in required_fields:
            if field not in data:
                return request.make_response(
                    json.dumps({"error": f"Missing required field: {field}"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

        try:
            contract = Contract.sudo().create({
                "employee_id": employee.id,
                "name": f"HĐ cho {employee.name}",
                "x_contract_type": data.get("x_contract_type"),
                "x_contract_term": data.get("x_contract_term"),
                "date_start": data.get("date_start"),
                "date_end": data.get("date_end"),
                "wage": float(data.get("wage") or 0),
                "x_bonus": float(data.get("x_bonus") or 0),
                "state": "draft",
            })
        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=400
            )

        return request.make_response(
            json.dumps({"id": contract.id, "message": "Contract created"}),
            headers=[('Content-Type', 'application/json')],
            status=201
        )