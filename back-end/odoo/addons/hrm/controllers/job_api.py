import json
from odoo import http
from odoo.http import request

class JobAPI(http.Controller):

    @http.route('/api/hr/jobs', type='http', auth='user', methods=['POST'], csrf=False)
    def create_job(self, **kwargs):
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

        # Check if job code already exists
        existing_job = request.env['hr.job'].sudo().search([
            ('code', '=', data.get('code'))
        ], limit=1)
        
        if existing_job:
            return request.make_response(
                json.dumps({"error": f"Job with code '{data.get('code')}' already exists"}),
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
                    status=404
                )

        try:
            job = request.env['hr.job'].sudo().create({
                'name': data.get('name'),
                'code': data.get('code'),
                'priority_level': data.get('priority_level', 0),
                'note': data.get('note'),
            })
            
            return request.make_response(
                json.dumps({
                    "message": "Job created successfully",
                    "data": {
                        "id": job.id,
                        "name": job.name,
                        "code": job.code,
                        "priority_level": job.priority_level,
                        "note": job.note
                        }
                }),
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({"error": f"Failed to create job: {str(e)}"}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/jobs', type='http', auth='user', methods=['GET'], csrf=False)
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
                    "id": job.id or None,
                    "name": job.name or None,
                    "code": job.code or None,
                    "priority_level": job.priority_level or None,
                    "note": job.note or None
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

    #Get job id and name
    @http.route('/api/hr/jobs/ids', type='http', auth='user', methods=['GET'], csrf=False)
    def get_job_ids(self, **kwargs):
        try:
            jobs = request.env['hr.job'].sudo().search([])
            data = [{"id": job.id, "name": job.name} for job in jobs]
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
        
    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['GET'], csrf=False)
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

            data = {
                "id": job.id or None,
                "name": job.name or None,
                "code": job.code or None,
                "priority_level": job.priority_level or None,
                "note": job.note or None,
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

    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['PUT'], csrf=False)
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

            job.write(update_data)

            return request.make_response(
                json.dumps({
                    "message": "Job updated successfully",
                    "data": {
                        "id": job.id or None,
                        "name": job.name or None,
                        "code": job.code or None,
                        "priority_level": job.priority_level or None,
                        "note": job.note or None
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

    @http.route('/api/hr/jobs/<int:job_id>', type='http', auth='user', methods=['DELETE'], csrf=False)
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

    