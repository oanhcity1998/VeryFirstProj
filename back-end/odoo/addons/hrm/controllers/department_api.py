import json
from odoo import http
from odoo.http import request
import logging
_logger = logging.getLogger(__name__)

class DepartmentAPI(http.Controller):

    @http.route('/api/hr/departments', type='json', auth='user', methods=['POST'], csrf=False, cors='*')
    def create_department(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"))
            else:
                data = kwargs
        except Exception:
            return {"error": "Invalid JSON body"}

        # Validate required fields
        required_fields = ["name", "code"]
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"Missing required field: {field}"}

        # Check if department code already exists
        existing_dept = request.env['hr.department'].sudo().search([
            ('code', '=', data.get('code'))
        ], limit=1)
        
        if existing_dept:
            return {"error": f"Department with code '{data.get('code')}' already exists"}

        # Validate manager_id if provided
        manager_id = data.get('manager_id')
        if manager_id:
            manager = request.env['hr.employee'].sudo().search([('id', '=', manager_id)], limit=1)
            if not manager:
                return {"error": f"Manager with ID {manager_id} not found"}

        try:
            department = request.env['hr.department'].sudo().create({
                'name': data.get('name'),
                'code': data.get('code'),
                'manager_id': manager_id,
                'note': data.get('note'),
            })
            
            return {
                "id": department.id,
                "message": "Department created successfully",
                "data": {
                    "id": department.id,
                    "name": department.name,
                    "code": department.code,
                    "manager_id": department.manager_id.id if department.manager_id else None,
                    "manager_name": department.manager_id.name if department.manager_id else None,
                    "note": department.note
                }
            }
        except Exception as e:
            return {"error": f"Failed to create department: {str(e)}"}

    @http.route('/api/hr/departments', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def list_departments(self, **kwargs):
        try:
            # Get query parameters
            q = kwargs.get('q', '').strip()
            page = int(kwargs.get('page', 1))
            limit = int(kwargs.get('limit', 25))
            # Build search domain
            domain = []
            if q:
                domain.append('|')
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('code', 'ilike', q))
                domain.append(('note', 'ilike', q))
                domain.append(('manager_id.name', 'ilike', q))
                _logger.info("Search query: %s", q)

            # Get total count
            total = request.env['hr.department'].sudo().search_count(domain)

            # Get departments with pagination
            offset = (page - 1) * limit
            departments = request.env['hr.department'].sudo().search(
                domain, 
                offset=offset, 
                limit=limit, 
                order='name'
            )

            # Format data
            data = []
            for dept in departments:
                data.append({
                    "id": dept.id,
                    "name": dept.name,
                    "code": dept.code,
                    "manager_id": dept.manager_id.id if dept.manager_id else None,
                    "manager_name": dept.manager_id.name if dept.manager_id else None,
                    "note": dept.note,
                    "employee_count": len(dept.member_ids) if dept.member_ids else 0
                })

            return request.make_response(
                json.dumps({
                    "data": data,
                    "meta": {
                        "page": page,
                        "limit": limit,
                        "total": total,
                        "pages": (total + limit - 1) // limit
                    }
                }),
                headers=[('Content-Type', 'application/json')]
            )
        
        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def get_department(self, department_id, **kwargs):
        try:
            department = request.env['hr.department'].sudo().search([
                ('id', '=', department_id)
            ], limit=1)
            
            if not department:
                return request.make_response(
                    json.dumps({"error": "Department not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Get department employees
            employees = []
            for emp in department.member_ids:
                employees.append({
                    "id": emp.id,
                    "name": emp.name,
                    "work_email": emp.work_email,
                    "job_title": emp.job_id.name if emp.job_id else None
                })

            data = {
                "id": department.id,
                "name": department.name,
                "code": department.code,
                "manager_id": department.manager_id.id if department.manager_id else None,
                "manager_name": department.manager_id.name if department.manager_id else None,
                "note": department.note,
                "employee_count": len(employees),
                "employees": employees
            }

            return request.make_response(
                json.dumps({"data": data}),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['PUT'], csrf=False, cors='*')
    def update_department(self, department_id, **kwargs):
        try:
            # Parse request data
            try:
                data = json.loads(request.httprequest.data.decode('utf-8'))
            except:
                return request.make_response(
                    json.dumps({"error": "Invalid JSON body"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            # Find department
            department = request.env['hr.department'].sudo().search([
                ('id', '=', department_id)
            ], limit=1)
            
            if not department:
                return request.make_response(
                    json.dumps({"error": "Department not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if code is being changed and if it conflicts
            if 'code' in data and data['code'] != department.code:
                existing_dept = request.env['hr.department'].sudo().search([
                    ('code', '=', data['code']),
                    ('id', '!=', department_id)
                ], limit=1)
                
                if existing_dept:
                    return request.make_response(
                        json.dumps({"error": f"Department with code '{data['code']}' already exists"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Validate manager_id if provided
            manager_id = data.get('manager_id')
            if manager_id:
                manager = request.env['hr.employee'].sudo().search([('id', '=', manager_id)], limit=1)
                if not manager:
                    return request.make_response(
                        json.dumps({"error": f"Manager with ID {manager_id} not found"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Update department
            update_data = {}
            if 'name' in data:
                update_data['name'] = data['name']
            if 'code' in data:
                update_data['code'] = data['code']
            if 'manager_id' in data:
                update_data['manager_id'] = data['manager_id']
            if 'note' in data:
                update_data['note'] = data['note']

            department.write(update_data)

            return request.make_response(
                json.dumps({
                    "message": "Department updated successfully",
                    "data": {
                        "id": department.id,
                        "name": department.name,
                        "code": department.code,
                        "manager_id": department.manager_id.id if department.manager_id else None,
                        "manager_name": department.manager_id.name if department.manager_id else None,
                        "note": department.note
                    }
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['DELETE'], csrf=False, cors='*')
    def delete_department(self, department_id, **kwargs):
        try:
            department = request.env['hr.department'].sudo().search([
                ('id', '=', department_id)
            ], limit=1)
            
            if not department:
                return request.make_response(
                    json.dumps({"error": "Department not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if department has employees
            if department.member_ids:
                return request.make_response(
                    json.dumps({
                        "error": f"Cannot delete department. It has {len(department.member_ids)} employees assigned."
                    }),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            dept_name = department.name
            department.unlink()

            return request.make_response(
                json.dumps({
                    "message": f"Department '{dept_name}' deleted successfully"
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/departments/export', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def export_departments_csv(self, **kwargs):
        try:
            import csv
            import io

            # Get query parameter for filtering
            q = kwargs.get('q', '').strip()
            
            # Build domain
            domain = []
            if q:
                domain.append('|')
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('code', 'ilike', q))
                domain.append(('note', 'ilike', q))

            departments = request.env['hr.department'].sudo().search(domain, order='name')

            # Create CSV
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write headers
            headers = ['ID', 'Name', 'Code', 'Manager Name', 'Note', 'Employee Count']
            writer.writerow(headers)
            
            # Write data
            for dept in departments:
                writer.writerow([
                    dept.id,
                    dept.name or '',
                    dept.code or '',
                    dept.manager_id.name if dept.manager_id else '',
                    dept.note or '',
                    len(dept.member_ids) if dept.member_ids else 0
                ])

            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"departments_export_{timestamp}.csv"

            return request.make_response(
                output.getvalue(),
                headers=[
                    ('Content-Type', 'text/csv'),
                    ('Content-Disposition', f'attachment; filename="{filename}"')
                ]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )