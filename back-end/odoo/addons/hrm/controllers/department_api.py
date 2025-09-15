import json
from odoo import http
from odoo.http import request
import logging
_logger = logging.getLogger(__name__)

class DepartmentAPI(http.Controller):

    @http.route('/api/hr/departments', type='http', auth='user', methods=['POST'], csrf=False)
    def create_department(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"))
            else:
                data = kwargs
        except Exception:
            return request.make_response(
                json.dumps({"error": "Invalid JSON body"}),
                headers=[('Content-Type', 'application/json')],
                status=400
            )

        # Validate required fields
        required_fields = ["name", "code"]
        for field in required_fields:
            if field not in data or not data[field]:
                return request.make_response(
                    json.dumps({"error": f"Missing required field: {field}"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

        # Check if department code already exists
        existing_dept = request.env['hr.department'].sudo().search([
            ('code', '=', data.get('code'))
        ], limit=1)
        
        if existing_dept:
            return request.make_response(
                json.dumps({"error": f"Department with code '{data.get('code')}' already exists"}),
                headers=[('Content-Type', 'application/json')],
                status=400
            )

        # Validate manager_id if provided
        manager_id = data.get('manager_id')
        if manager_id:
            manager = request.env['hr.employee'].sudo().browse(int(manager_id))
            if not manager.exists():
                return request.make_response(
                    json.dumps({"error": f"Manager with ID {manager_id} not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

        try:
            department = request.env['hr.department'].sudo().create({
                'name': data.get('name'),
                'code': data.get('code'),
                'manager_id': int(manager_id),
                'note': data.get('note'),
            })
            
            return request.make_response(
                json.dumps({
                    "message": "Department created successfully",
                    "data": {
                        "id": department.id,
                        "name": department.name,
                        "code": department.code,
                        "manager_id": department.manager_id.id if department.manager_id else None,
                        "manager_name": department.manager_id.name or None,
                        "note": department.note
                    }
                }),
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            # Rollback is automatic in Odoo if an exception is raised
            _logger.error(f"Error creating department: {str(e)}")
            request.env.cr.rollback()
            return request.make_response(
                json.dumps({"error": f"Failed to create department: {str(e)}"}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/departments', type='http', auth='user', methods=['GET'], csrf=False)
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
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('code', 'ilike', q))
                domain.append(('note', 'ilike', q))
                domain.append(('manager_id.name', 'ilike', q))

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
                    "id": dept.id or None,
                    "name": dept.name or None,
                    "code": dept.code or None,
                    "manager_id": dept.manager_id.id if dept.manager_id else None,
                    "manager_name": dept.manager_id.name if dept.manager_id else None,
                    "note": dept.note or None,
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

    #Get department Ids and names
    @http.route('/api/hr/departments/ids', type='http', auth='user', methods=['GET'], csrf=False)
    def get_department_ids(self, **kwargs):
        try:
            departments = request.env['hr.department'].sudo().search([], order='name')
            data = []
            for dept in departments:
                data.append({
                    "id": dept.id or None,
                    "name": dept.name or None,
                })
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
    
    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['GET'], csrf=False, )
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
                "id": department.id or None,
                "name": department.name or None,
                "code": department.code or None,
                "manager_id": department.manager_id.id if department.manager_id else None,
                "manager_name": department.manager_id.name if department.manager_id else None,
                "note": department.note or None,
                "employee_count": len(employees),
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

    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['PUT'], csrf=False, )
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
            if 'employee_id' in data:
                update_data['manager_id'] = int(data['employee_id']) if data['employee_id'] else False
            if 'note' in data:
                update_data['note'] = data['note']

            department.write(update_data)

            return request.make_response(
                json.dumps({
                    "message": "Department updated successfully",
                    "data": {
                        "id": department.id or None,
                        "name": department.name or None,
                        "code": department.code or None,
                        "manager_id": department.manager_id.id if department.manager_id else None,
                        "manager_name": department.manager_id.name if department.manager_id else None,
                        "note": department.note or None
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

    @http.route('/api/hr/departments/<int:department_id>', type='http', auth='user', methods=['DELETE'], csrf=False, )
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

    #Delete multiple departments
    @http.route('/api/hr/departments', type='http', auth='user', methods=['DELETE'], csrf=False, )
    def delete_multiple_departments(self, **kwargs):
        try:
            department_ids = json.loads(request.httprequest.data.decode("utf-8")).get("ids", [])
            if not department_ids:
                return request.make_response(
                    json.dumps({"error": "No department IDs provided"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            departments = request.env['hr.department'].sudo().search([('id', 'in', department_ids)])
            if not departments:
                return request.make_response(
                    json.dumps({"error": "No departments found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if any department has employees
            for department in departments:
                if department.member_ids:
                    return request.make_response(
                        json.dumps({
                            "error": f"Cannot delete department '{department.name}'. It has {len(department.member_ids)} employees assigned."
                        }),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Delete departments
            departments.unlink()

            return request.make_response(
                json.dumps({
                    "message": f"Deleted {len(departments)} departments successfully"
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )
