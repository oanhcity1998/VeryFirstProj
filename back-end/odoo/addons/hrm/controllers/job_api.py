import json
from odoo import http
from odoo.http import request

class JobAPI(http.Controller):

    @http.route('/api/hr/jobs', type='json', auth='user', methods=['POST'], csrf=False, cors='*')
    def create_job(self, **kwargs):
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

        # Check if job code already exists
        existing_job = request.env['hr.job'].sudo().search([
            ('code', '=', data.get('code'))
        ], limit=1)
        
        if existing_job:
            return {"error": f"Job with code '{data.get('code')}' already exists"}

        # Validate department_id if provided
        department_id = data.get('department_id')
        if department_id:
            department = request.env['hr.department'].sudo().search([('id', '=', department_id)], limit=1)
            if not department:
                return {"error": f"Department with ID {department_id} not found"}

        try:
            job = request.env['hr.job'].sudo().create({
                'name': data.get('name'),
                'code': data.get('code'),
                'priority_level': data.get('priority_level', 0),
                'note': data.get('note'),
                'department_id': department_id,
                'no_of_recruitment': data.get('no_of_recruitment', 1),
            })
            
            return {
                "id": job.id,
                "message": "Job created successfully",
                "data": {
                    "id": job.id,
                    "name": job.name,
                    "code": job.code,
                    "priority_level": job.priority_level,
                    "note": job.note,
                    "department_id": job.department_id.id if job.department_id else None,
                    "department_name": job.department_id.name if job.department_id else None,
                    "no_of_recruitment": job.no_of_recruitment
                }
            }
        except Exception as e:
            return {"error": f"Failed to create job: {str(e)}"}

    @http.route('/api/hr/jobs', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def list_jobs(self, **kwargs):
        try:
            # Get query parameters
            q = kwargs.get('q', '').strip()
            department_id = kwargs.get('department_id')
            priority_level = kwargs.get('priority_level')
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

            if department_id:
                domain.append(('department_id', '=', int(department_id)))

            if priority_level:
                domain.append(('priority_level', '=', int(priority_level)))

            # Get total count
            total = request.env['hr.job'].sudo().search_count(domain)

            # Get jobs with pagination
            offset = (page - 1) * limit
            jobs = request.env['hr.job'].sudo().search(
                domain, 
                offset=offset, 
                limit=limit, 
                order='name'
            )

            # Format data
            data = []
            for job in jobs:
                # Get employee count for this job
                employee_count = request.env['hr.employee'].sudo().search_count([
                    ('job_id', '=', job.id)
                ])

                data.append({
                    "id": job.id,
                    "name": job.name,
                    "code": job.code,
                    "priority_level": job.priority_level,
                    "note": job.note,
                    "department_id": job.department_id.id if job.department_id else None,
                    "department_name": job.department_id.name if job.department_id else None,
                    "no_of_recruitment": job.no_of_recruitment,
                    "employee_count": employee_count
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

    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def get_job(self, job_id, **kwargs):
        try:
            job = request.env['hr.job'].sudo().search([
                ('id', '=', job_id)
            ], limit=1)
            
            if not job:
                return request.make_response(
                    json.dumps({"error": "Job not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Get employees with this job
            employees = []
            job_employees = request.env['hr.employee'].sudo().search([('job_id', '=', job_id)])
            for emp in job_employees:
                employees.append({
                    "id": emp.id,
                    "name": emp.name,
                    "work_email": emp.work_email,
                    "department_name": emp.department_id.name if emp.department_id else None
                })

            data = {
                "id": job.id,
                "name": job.name,
                "code": job.code,
                "priority_level": job.priority_level,
                "note": job.note,
                "department_id": job.department_id.id if job.department_id else None,
                "department_name": job.department_id.name if job.department_id else None,
                "no_of_recruitment": job.no_of_recruitment,
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

    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['PUT'], csrf=False, cors='*')
    def update_job(self, job_id, **kwargs):
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

            # Find job
            job = request.env['hr.job'].sudo().search([
                ('id', '=', job_id)
            ], limit=1)
            
            if not job:
                return request.make_response(
                    json.dumps({"error": "Job not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if code is being changed and if it conflicts
            if 'code' in data and data['code'] != job.code:
                existing_job = request.env['hr.job'].sudo().search([
                    ('code', '=', data['code']),
                    ('id', '!=', job_id)
                ], limit=1)
                
                if existing_job:
                    return request.make_response(
                        json.dumps({"error": f"Job with code '{data['code']}' already exists"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Validate department_id if provided
            department_id = data.get('department_id')
            if department_id:
                department = request.env['hr.department'].sudo().search([('id', '=', department_id)], limit=1)
                if not department:
                    return request.make_response(
                        json.dumps({"error": f"Department with ID {department_id} not found"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Update job
            update_data = {}
            if 'name' in data:
                update_data['name'] = data['name']
            if 'code' in data:
                update_data['code'] = data['code']
            if 'priority_level' in data:
                update_data['priority_level'] = data['priority_level']
            if 'note' in data:
                update_data['note'] = data['note']
            if 'department_id' in data:
                update_data['department_id'] = data['department_id']
            if 'no_of_recruitment' in data:
                update_data['no_of_recruitment'] = data['no_of_recruitment']

            job.write(update_data)

            return request.make_response(
                json.dumps({
                    "message": "Job updated successfully",
                    "data": {
                        "id": job.id,
                        "name": job.name,
                        "code": job.code,
                        "priority_level": job.priority_level,
                        "note": job.note,
                        "department_id": job.department_id.id if job.department_id else None,
                        "department_name": job.department_id.name if job.department_id else None,
                        "no_of_recruitment": job.no_of_recruitment
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

    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['DELETE'], csrf=False, cors='*')
    def delete_job(self, job_id, **kwargs):
        try:
            job = request.env['hr.job'].sudo().search([
                ('id', '=', job_id)
            ], limit=1)
            
            if not job:
                return request.make_response(
                    json.dumps({"error": "Job not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if job has employees
            employee_count = request.env['hr.employee'].sudo().search_count([
                ('job_id', '=', job_id)
            ])
            
            if employee_count > 0:
                return request.make_response(
                    json.dumps({
                        "error": f"Cannot delete job. It has {employee_count} employees assigned."
                    }),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            job_name = job.name
            job.unlink()

            return request.make_response(
                json.dumps({
                    "message": f"Job '{job_name}' deleted successfully"
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/jobs/export', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def export_jobs_csv(self, **kwargs):
        try:
            import csv
            import io

            # Get query parameters for filtering
            q = kwargs.get('q', '').strip()
            department_id = kwargs.get('department_id')
            priority_level = kwargs.get('priority_level')
            
            # Build domain
            domain = []
            if q:
                domain.append('|')
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('code', 'ilike', q))
                domain.append(('note', 'ilike', q))

            if department_id:
                domain.append(('department_id', '=', int(department_id)))

            if priority_level:
                domain.append(('priority_level', '=', int(priority_level)))

            jobs = request.env['hr.job'].sudo().search(domain, order='name')

            # Create CSV
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write headers
            headers = ['ID', 'Name', 'Code', 'Priority Level', 'Department', 'Note', 'No of Recruitment', 'Employee Count']
            writer.writerow(headers)
            
            # Write data
            for job in jobs:
                employee_count = request.env['hr.employee'].sudo().search_count([
                    ('job_id', '=', job.id)
                ])
                
                writer.writerow([
                    job.id,
                    job.name or '',
                    job.code or '',
                    job.priority_level or 0,
                    job.department_id.name if job.department_id else '',
                    job.note or '',
                    job.no_of_recruitment or 0,
                    employee_count
                ])

            from datetime import datetime
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"jobs_export_{timestamp}.csv"

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