import json
from odoo import http
from odoo.http import request
from datetime import datetime
import xlsxwriter
import io
import openpyxl
from openpyxl import load_workbook

class EmployeeAPI(http.Controller):

    @http.route('/api/hr/employees', type='json', auth='user', methods=['POST'], csrf=False, cors='*')
    def create_employee(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"))
            else:
                data = kwargs 
        except Exception:
            return {"error": "Invalid JSON body"}

        required_fields = ["name", "birthday", "gender", "work_phone", "work_email", "department_id", "job_id", "id_number", "id_issued_place", "id_issued_date", "permanent_address"]
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
            "id_number": data.get("id_number"),
            "id_issued_place": data.get("id_issued_place"),
            "id_issued_date": data.get("id_issued_date"),
            "permanent_address": data.get("permanent_address"),
            "temporary_address": data.get("temporary_address"),
            "tax_id": data.get("tax_id"),
            "insurance_id": data.get("insurance_id"),
            "bank_account": data.get("bank_account"),
        })

        contract_data = data.get("contract")
        if contract_data:
            request.env["hr.contract.custom"].sudo().create({
                "name": contract_data.get("name"),
                "x_contract_type": contract_data.get("contract_type"),
                "employee_id": employee.id,
                "date_start": contract_data.get("date_start"),
                "date_end": contract_data.get("date_end"),
                "wage": contract_data.get("wage"),
                "x_bonus": contract_data.get("bonus")
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
            domain.append(('id_number', 'ilike', q))

        if department_id:
            domain.append(('department_id', '=', int(department_id)))

        if job_id:
            domain.append(('job_id', '=', int(job_id)))

        if status:
            if status in ['active', 'inactive']:
                domain.append(('active', '=', True if status == 'active' else False))

        total = request.env['hr.employee'].sudo().search_count(domain)

        offset = (page - 1) * limit
        employees = request.env['hr.employee'].sudo().search(domain, offset=offset, limit=limit, order='id')

        data = []
        for emp in employees:
            data.append({
                "id": emp.id,
                "name": emp.name,
                "birthday": str(emp.birthday) if emp.birthday else None,
                "gender": emp.gender,
                "work_phone": emp.work_phone,
                "work_email": emp.work_email,
                "department_id": emp.department_id.id if emp.department_id else None,
                "department": emp.department_id.name if emp.department_id else None,
                "job_id": emp.job_id.id if emp.job_id else None,
                "job": emp.job_id.name if emp.job_id else None,
                "status": "active" if emp.active else "inactive",
                "cccd": emp.id_number,
                "issued_date_cccd": str(emp.id_issued_date) if emp.id_issued_date else None,
                "issued_place_cccd": emp.id_issued_place,
                "permanent_address": emp.permanent_address,
                "temporary_address": emp.temporary_address,
                "tax_id": emp.tax_id,
                "insurance_id": emp.insurance_id,
                "bank_account": emp.bank_account,
                "constract": [ 
                    {
                        "id": c.id, 
                        "x_contract_type": c.x_contract_type, 
                        "x_contract_term": c.x_contract_term, 
                        "date_start": str(c.date_start) if c.date_start else None, 
                        "date_end": str(c.date_end) if c.date_end else None, 
                        "wage": c.wage, 
                        "x_bonus": c.x_bonus
                    } 
                    for c in request.env['hr.contract.custom'].sudo().search([('employee_id', '=', emp.id)])],
            })

        return request.make_response(
        json.dumps({
            "data": data,
            "meta": {"page": page, "limit": limit, "total": total}
        }),
        headers=[('Content-Type', 'application/json')]
    )

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def get_employee(self, employee_id, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        Contract = request.env['hr.contract.custom'].sudo()

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
            "department_id": employee.department_id.id if employee.department_id else None,
            "department": employee.department_id.name if employee.department_id else None,
            "job_id": employee.job_id.id if employee.job_id else None,
            "job": employee.job_id.name if employee.job_id else None,
            "id_number": employee.id_number,
            "id_issued_place": employee.id_issued_place,
            "id_issued_date": str(employee.id_issued_date) if employee.id_issued_date else None,
            "permanent_address": employee.permanent_address,
            "temporary_address": employee.temporary_address,
            "tax_id": employee.tax_id,
            "insurance_id": employee.insurance_id,
            "bank_account": employee.bank_account,
            "status": "active" if employee.active else "inactive",
            "created_at": str(employee.create_date) if employee.create_date else None,
            "updated_at": str(employee.write_date) if employee.write_date else None
        }

        contracts = []
        for c in Contract.search([('employee_id', '=', employee.id)]):
            contracts.append({
                "id": c.id,
                "name": c.name,
                "x_contract_type": c.x_contract_type,
                "date_start": str(c.date_start) if c.date_start else None,
                "date_end": str(c.date_end) if c.date_end else None,
                "wage": c.wage,
                "bonus": c.x_bonus,
            })

        response = {
            "profile": profile,
            "contracts": contracts
        }

        return request.make_response(
            json.dumps(response),
            headers=[('Content-Type', 'application/json')]
        )

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['PUT'], csrf=False, cors='*')
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

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['DELETE'], csrf=False, cors='*')
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
            headers=[('Content-Type', 'application/json')],
            status=200
        )

    @http.route('/api/hr/employees/export', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def export_employees_excel(self, **kwargs):
        try:
            # Get filter parameters (same as list_employees)
            q = kwargs.get('q', '').strip()
            department_id = kwargs.get('department_id')
            job_id = kwargs.get('job_id')
            status = kwargs.get('status', '').lower()

            # Build domain for filtering
            domain = []

            if q:
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('id_number', 'ilike', q))

            if department_id:
                domain.append(('department_id', '=', int(department_id)))

            if job_id:
                domain.append(('job_id', '=', int(job_id)))

            if status:
                if status in ['active', 'inactive']:
                    domain.append(('active', '=', True if status == 'active' else False))

            # Get all employees (no pagination for export)
            employees = request.env['hr.employee'].sudo().search(domain, order='id')

            # Create Excel file in memory
            output = io.BytesIO()
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})
            worksheet = workbook.add_worksheet('Employees')

            # Define formats
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#D7E4BC',
                'border': 1,
                'align': 'center',
                'valign': 'vcenter'
            })
            
            cell_format = workbook.add_format({
                'border': 1,
                'align': 'left',
                'valign': 'vcenter'
            })

            # Define headers
            headers = [
                'ID', 'Name', 'Birthday', 'Gender', 'Work Phone', 'Work Email',
                'Department', 'Job Position', 'Status', 'ID Number (CCCD)',
                'ID Issued Date', 'ID Issued Place', 'Permanent Address',
                'Temporary Address', 'Tax ID', 'Insurance ID', 'Bank Account'
            ]

            # Set column widths
            column_widths = [5, 25, 12, 10, 15, 30, 20, 20, 10, 15, 12, 20, 40, 40, 15, 15, 20]
            for i, width in enumerate(column_widths):
                worksheet.set_column(i, i, width)

            # Write headers
            for col, header in enumerate(headers):
                worksheet.write(0, col, header, header_format)

            # Write employee data
            row = 1
            for emp in employees:
                worksheet.write(row, 0, emp.id, cell_format)
                worksheet.write(row, 1, emp.name or '', cell_format)
                worksheet.write(row, 2, str(emp.birthday) if emp.birthday else '', cell_format)
                worksheet.write(row, 3, emp.gender or '', cell_format)
                worksheet.write(row, 4, emp.work_phone or '', cell_format)
                worksheet.write(row, 5, emp.work_email or '', cell_format)
                worksheet.write(row, 6, emp.department_id.name if emp.department_id else '', cell_format)
                worksheet.write(row, 7, emp.job_id.name if emp.job_id else '', cell_format)
                worksheet.write(row, 8, "Active" if emp.active else "Inactive", cell_format)
                worksheet.write(row, 9, emp.id_number or '', cell_format)
                worksheet.write(row, 10, str(emp.id_issued_date) if emp.id_issued_date else '', cell_format)
                worksheet.write(row, 11, emp.id_issued_place or '', cell_format)
                worksheet.write(row, 12, emp.permanent_address or '', cell_format)
                worksheet.write(row, 13, emp.temporary_address or '', cell_format)
                worksheet.write(row, 14, emp.tax_id or '', cell_format)
                worksheet.write(row, 15, emp.insurance_id or '', cell_format)
                worksheet.write(row, 16, emp.bank_account or '', cell_format)
                row += 1

            workbook.close()
            output.seek(0)

            # Generate filename with timestamp
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"employees_export_{timestamp}.xlsx"

            # Return Excel file
            return request.make_response(
                output.read(),
                headers=[
                    ('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
                    ('Content-Disposition', f'attachment; filename="{filename}"'),
                    ('Content-Length', len(output.getvalue()))
                ]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/employees/export-template', type='http', auth='user', methods=['GET'], csrf=False, cors='*')
    def download_import_template(self, **kwargs):
        try:
            # Create Excel template
            output = io.BytesIO()
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})
            worksheet = workbook.add_worksheet('Employee Template')

            # Define formats
            header_format = workbook.add_format({
                'bold': True,
                'bg_color': '#4CAF50',
                'font_color': 'white',
                'border': 1,
                'align': 'center',
                'valign': 'vcenter'
            })
            
            required_format = workbook.add_format({
                'bold': True,
                'bg_color': '#FF5722',
                'font_color': 'white',
                'border': 1,
                'align': 'center',
                'valign': 'vcenter'
            })

            # Headers
            headers = [
                ('Name*', True),
                ('Birthday* (YYYY-MM-DD)', True),
                ('Gender*', True),
                ('Work Phone*', True),
                ('Work Email*', True),
                ('Department Name*', True),
                ('Job Name*', True),
                ('ID Number (CCCD)*', True),
                ('ID Issued Place*', True),
                ('ID Issued Date* (YYYY-MM-DD)', True),
                ('Permanent Address*', True),
                ('Temporary Address', False),
                ('Tax ID', False),
                ('Insurance ID', False),
                ('Bank Account', False)
            ]

            # Set column widths and write headers
            for col, (header, is_required) in enumerate(headers):
                worksheet.set_column(col, col, 20)
                format_to_use = required_format if is_required else header_format
                worksheet.write(0, col, header, format_to_use)

            # Add sample data
            sample_data = [
                'John Doe', '1990-05-15', 'male', '+1234567890', 'john.doe@company.com',
                'IT Department', 'Software Developer', '123456789012', 'New York',
                '2010-01-15', '123 Main St, New York, NY', '456 Oak Ave, Brooklyn, NY',
                'TAX123456789', 'INS987654321', '1234567890123456'
            ]
            
            for col, value in enumerate(sample_data):
                worksheet.write(1, col, value)

            # Add instructions sheet
            instructions = workbook.add_worksheet('Instructions')
            instructions.write(0, 0, 'EMPLOYEE IMPORT INSTRUCTIONS', header_format)
            instructions.set_column(0, 0, 50)
            
            instruction_text = [
                '',
                '1. Fill in the employee data in the "Employee Template" sheet',
                '2. Required fields are marked with * and have red background',
                '3. Date format should be YYYY-MM-DD (e.g., 2024-01-15)',
                '4. Gender should be: male, female, or other',
                '5. Department Name and Job Name must match existing records in the system',
                '6. Work Email and ID Number must be unique',
                '',
                'Column Details:',
                '- Name: Full name of employee',
                '- Birthday: Date of birth in YYYY-MM-DD format',
                '- Gender: male, female, or other',
                '- Work Phone: Contact phone number',
                '- Work Email: Must be unique, used for login',
                '- Department Name: Must match existing department',
                '- Job Name: Must match existing job position',
                '- ID Number (CCCD): National ID, must be unique',
                '- ID Issued Place: Where the ID was issued',
                '- ID Issued Date: When the ID was issued (YYYY-MM-DD)',
                '- Permanent Address: Home address',
                '- Other fields are optional'
            ]
            
            for row, text in enumerate(instruction_text):
                instructions.write(row + 1, 0, text)

            workbook.close()
            output.seek(0)

            return request.make_response(
                output.read(),
                headers=[
                    ('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
                    ('Content-Disposition', 'attachment; filename="employee_import_template.xlsx"')
                ]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/employees/import', type='http', auth='user', methods=['POST'], csrf=False, cors='*')
    def import_employees_excel(self, **kwargs):
        try:
            # Get the uploaded file
            if not request.httprequest.files:
                return request.make_response(
                    json.dumps({"error": "No file uploaded"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            uploaded_file = request.httprequest.files.get('file')
            if not uploaded_file:
                return request.make_response(
                    json.dumps({"error": "No file found in request"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            # Validate file type
            if not uploaded_file.filename.endswith(('.xlsx', '.xls')):
                return request.make_response(
                    json.dumps({"error": "Invalid file type. Only .xlsx and .xls files are allowed"}),
                    headers=[('Content-Type', 'application/json')],
                    status=400
                )

            # Read the Excel file
            file_content = uploaded_file.read()
            workbook = openpyxl.load_workbook(io.BytesIO(file_content))
            worksheet = workbook.active

            # Expected columns mapping
            expected_columns = {
                'A': 'name',
                'B': 'birthday', 
                'C': 'gender',
                'D': 'work_phone',
                'E': 'work_email',
                'F': 'department_name',
                'G': 'job_name', 
                'H': 'id_number',
                'I': 'id_issued_place',
                'J': 'id_issued_date',
                'K': 'permanent_address',
                'L': 'temporary_address',
                'M': 'tax_id',
                'N': 'insurance_id',
                'O': 'bank_account'
            }

            results = {
                'success': [],
                'errors': [],
                'total_processed': 0,
                'total_created': 0,
                'total_errors': 0
            }

            # Process each row (skip header row)
            for row_num, row in enumerate(worksheet.iter_rows(min_row=2, values_only=True), start=2):
                try:
                    results['total_processed'] += 1
                    
                    # Extract data from row
                    employee_data = {}
                    for col_idx, (col_letter, field_name) in enumerate(expected_columns.items()):
                        if col_idx < len(row):
                            value = row[col_idx]
                            if value is not None:
                                if field_name in ['birthday', 'id_issued_date']:
                                    # Handle date fields
                                    if isinstance(value, datetime):
                                        employee_data[field_name] = value.strftime('%Y-%m-%d')
                                    elif isinstance(value, str):
                                        employee_data[field_name] = value
                                else:
                                    employee_data[field_name] = str(value).strip() if value else None

                    # Validate required fields
                    required_fields = ['name', 'birthday', 'gender', 'work_phone', 'work_email', 
                                    'department_name', 'job_name', 'id_number', 'id_issued_place', 
                                    'id_issued_date', 'permanent_address']
                    
                    missing_fields = []
                    for field in required_fields:
                        if not employee_data.get(field):
                            missing_fields.append(field)

                    if missing_fields:
                        results['errors'].append({
                            'row': row_num,
                            'error': f"Missing required fields: {', '.join(missing_fields)}",
                            'data': employee_data
                        })
                        results['total_errors'] += 1
                        continue

                    # Find department and job by name
                    department = request.env['hr.department'].sudo().search([
                        ('name', '=', employee_data['department_name'])
                    ], limit=1)
                    
                    if not department:
                        results['errors'].append({
                            'row': row_num,
                            'error': f"Department '{employee_data['department_name']}' not found",
                            'data': employee_data
                        })
                        results['total_errors'] += 1
                        continue

                    job = request.env['hr.job'].sudo().search([
                        ('name', '=', employee_data['job_name'])
                    ], limit=1)
                    
                    if not job:
                        results['errors'].append({
                            'row': row_num,
                            'error': f"Job '{employee_data['job_name']}' not found",
                            'data': employee_data
                        })
                        results['total_errors'] += 1
                        continue

                    # Check if employee with same email or id_number already exists
                    existing_employee = request.env['hr.employee'].sudo().search([
                        '|',
                        ('work_email', '=', employee_data['work_email']),
                        ('id_number', '=', employee_data['id_number'])
                    ], limit=1)

                    if existing_employee:
                        results['errors'].append({
                            'row': row_num,
                            'error': f"Employee with email '{employee_data['work_email']}' or ID number '{employee_data['id_number']}' already exists",
                            'data': employee_data
                        })
                        results['total_errors'] += 1
                        continue

                    # Create employee
                    employee = request.env['hr.employee'].sudo().create({
                        'name': employee_data['name'],
                        'birthday': employee_data['birthday'],
                        'gender': employee_data['gender'],
                        'work_phone': employee_data['work_phone'],
                        'work_email': employee_data['work_email'],
                        'department_id': department.id,
                        'job_id': job.id,
                        'id_number': employee_data['id_number'],
                        'id_issued_place': employee_data['id_issued_place'],
                        'id_issued_date': employee_data['id_issued_date'],
                        'permanent_address': employee_data['permanent_address'],
                        'temporary_address': employee_data.get('temporary_address'),
                        'tax_id': employee_data.get('tax_id'),
                        'insurance_id': employee_data.get('insurance_id'),
                        'bank_account': employee_data.get('bank_account'),
                    })

                    results['success'].append({
                        'row': row_num,
                        'employee_id': employee.id,
                        'name': employee.name,
                        'email': employee.work_email
                    })
                    results['total_created'] += 1

                except Exception as e:
                    results['errors'].append({
                        'row': row_num,
                        'error': str(e),
                        'data': employee_data if 'employee_data' in locals() else {}
                    })
                    results['total_errors'] += 1

            return request.make_response(
                json.dumps(results),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": f"Import failed: {str(e)}"}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )


    