import json
from odoo import http
from odoo.http import request
from datetime import datetime
import xlsxwriter
import io
import openpyxl
from openpyxl import load_workbook

class EmployeeAPI(http.Controller):

    @http.route('/api/hr/employees', type='http', auth='user', methods=['POST'], csrf=False)
    def create_employee(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"), strict=False)
            else:
                data = kwargs 

            required_fields = ["name", "birthday", "gender", "work_phone", "work_email", "department_id", "job_id", "id_number", "id_issued_place", "id_issued_date", "permanent_address"]
            for field in required_fields:
                if field not in data or not data[field]:
                    return request.make_response(
                        json.dumps({"error": f"Vui lòng nhập field: {field}"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

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

            return request.make_response(
                json.dumps({
                    "message": "Tạo nhân viên thành công",
                }, ensure_ascii=False),
                headers=[('Content-Type', 'application/json')]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({"error": f"Tạo nhân viên thất bại: {str(e)}"}, ensure_ascii=False),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/employees', type='http', auth='user', methods=['GET'], csrf=False)
    def list_employees(self, **kwargs):
        q = kwargs.get('q', '')
        department_id = kwargs.get('department_id')
        job_id = kwargs.get('job_id')
        gender = kwargs.get('gender', '').lower()
        page = int(kwargs.get('page', 1))
        limit = int(kwargs.get('limit', 25))

        domain = []

        if q:
            domain.append(('name', 'ilike', q))

        if department_id:
            domain.append(('department_id', '=', int(department_id)))

        if job_id:
            domain.append(('job_id', '=', int(job_id)))

        if gender:
            domain.append(('gender', '=', gender))

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
                "department_name": emp.department_id.name if emp.department_id else None,
                "job_id": emp.job_id.id if emp.job_id else None,
                "job_name": emp.job_id.name if emp.job_id else None,
                "status": "active" if emp.active else "inactive",
                "cccd": emp.id_number,
                "issued_date_cccd": str(emp.id_issued_date) if emp.id_issued_date else None,
                "issued_place_cccd": emp.id_issued_place,
                "permanent_address": emp.permanent_address,
                "temporary_address": emp.temporary_address,
                "tax_id": emp.tax_id,
                "insurance_id": emp.insurance_id,
                "bank_account": emp.bank_account,
                "contract": [
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

    #get all employee id
    @http.route('/api/hr/employees/ids', type='http', auth='user', methods=['GET'], csrf=False)
    def get_all_employees(self, **kwargs):
        Employee = request.env['hr.employee'].sudo()
        employees = Employee.search([])
        data = [{"id": emp.id, "name": emp.name} for emp in employees]
        return request.make_response(
            json.dumps({"data": data}),
            headers=[('Content-Type', 'application/json')]
        )

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['GET'], csrf=False)
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
            "department_name": employee.department_id.name if employee.department_id else None,
            "job_id": employee.job_id.id if employee.job_id else None,
            "job_name": employee.job_id.name if employee.job_id else None,
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
            "data": {
                "profile": profile,
                "contracts": contracts
            }   
        }

        return request.make_response(
            json.dumps(response),
            headers=[('Content-Type', 'application/json')]
        )

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['PUT'], csrf=False, )
    def update_employee(self, employee_id, **kwargs):
        try:
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
                employee.logs = (employee.logs or []) + [{
                    "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                    "changes": updates
                }]
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

        except Exception as e:
            return request.make_json_response({"error": str(e)}, status=500)

    @http.route('/api/hr/employees/<int:employee_id>', type='http', auth='user', methods=['DELETE'], csrf=False, )
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


    @http.route('/api/hr/employees/export-template', type='http', auth='user', methods=['GET'], csrf=False)
    def download_import_template(self, **kwargs):
        try:
            Department = request.env['hr.department'].sudo()
            Job = request.env['hr.job'].sudo()
            Contract = request.env['hr.contract.custom'].sudo()

            departments = [d.name for d in Department.search([]) if d.name]
            jobs = [j.name for j in Job.search([]) if j.name]
            contract_types = list({c.x_contract_type for c in Contract.search([]) if c.x_contract_type})

            if not contract_types:
                contract_types = [
                    'Hợp đồng xác định thời hạn',
                    'Hợp đồng không xác định thời hạn',
                    'Hợp đồng thử việc'
                ]

            output = io.BytesIO()
            workbook = xlsxwriter.Workbook(output, {'in_memory': True})
            template_ws = workbook.add_worksheet('Template nhân viên')
            dept_ws = workbook.add_worksheet('Phòng ban')
            job_ws = workbook.add_worksheet('Chức vụ')
            contract_ws = workbook.add_worksheet('Loại hợp đồng')

            required_fmt = workbook.add_format({
                'bold': True, 'font_color': '#FF5722',
                'border': 1, 'align': 'center', 'valign': 'vcenter', 'text_wrap': True
            })
            optional_fmt = workbook.add_format({
                'bold': True,
                'border': 1, 'align': 'center', 'valign': 'vcenter', 'text_wrap': True
            })

            headers = [
                ('Mã Nhân Viên', True),
                ('Tên Nhân Viên', True),
                ('Giới Tính', True),
                ('Ngày Sinh (YYYY-MM-DD)', True),
                ('Điện Thoại', True),
                ('Email', True),
                ('Ngày vào làm', True),
                ('Ngày nghỉ việc', False),
                ('Số CCCD', True),
                ('Ngày Cấp CCCD', True),
                ('Nơi Cấp CCCD', True),
                ('Địa Chỉ Thường Trú', True),
                ('Địa Chỉ Tạm Trú', False),
                ('Mã số thuế TNCN', False),
                ('Mã số BHXH', False),
                ('Tài khoản ngân hàng', False),
                ('Phòng ban', True),
                ('Chức vụ', True),
                ('Loại hợp đồng', True),
                ('Thời hạn hợp đồng', True),
                ('Mức lương', False),
                ('Tiền thưởng', False)
            ]

            for col, (title, req) in enumerate(headers):
                template_ws.set_column(col, col, 22)
                template_ws.write(0, col, title, required_fmt if req else optional_fmt)

            sample_row = [
                'MNV001', 'Nguyen Van A', 'Nam', '1990-05-15', '+84123456789', 'nguyenvana@company.com',
                '2025-01-01', '', '012345678901', '2015-03-10', 'Hà Nội',
                '123 Bạch Mai, Hai Bà Trưng, Hà Nội', '',
                '0123456789', '987654321', '1234567890123456 - Techcombank',
                (departments[0] if departments else ''),
                (jobs[0] if jobs else ''),
                (contract_types[0] if contract_types else ''),
                '12 tháng', '15000000', '2000000'
            ]
            for col, val in enumerate(sample_row):
                template_ws.write(1, col, val)

            # Ghi danh sách vào các sheet bên cạnh
            dept_ws.write(0, 0, 'Phòng ban')
            for i, name in enumerate(departments, start=1):
                dept_ws.write(i, 0, name)

            job_ws.write(0, 0, 'Chức vụ')
            for i, name in enumerate(jobs, start=1):
                job_ws.write(i, 0, name)

            contract_ws.write(0, 0, 'Loại hợp đồng')
            for i, name in enumerate(contract_types, start=1):
                contract_ws.write(i, 0, name)

            # Data validation cho các cột dropdown (áp dụng từ dòng 3 trở đi để không ghi đè mẫu)
            last_row = 1000
            if departments:
                template_ws.data_validation(2, 16, last_row, 16, {
                    'validate': 'list',
                    'source': f"='Phòng ban'!$A$2:$A${len(departments)+1}"
                })
            if jobs:
                template_ws.data_validation(2, 17, last_row, 17, {
                    'validate': 'list',
                    'source': f"='Chức vụ'!$A$2:$A${len(jobs)+1}"
                })
            if contract_types:
                template_ws.data_validation(2, 18, last_row, 18, {
                    'validate': 'list',
                    'source': f"='Loại hợp đồng'!$A$2:$A${len(contract_types)+1}"
                })

            workbook.close()
            output.seek(0)
            return request.make_response(
                output.read(),
                headers=[
                    ('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'),
                    ('Content-Disposition', 'attachment; filename=\"employee_import_template.xlsx\"')
                ]
            )
        except Exception as e:
            return request.make_response(
                json.dumps({'error': str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/employees/import', type='http', auth='user', methods=['POST'], csrf=False, )
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
                'A': 'id',
                'B': 'name', 
                'C': 'gender',
                'D': 'birthday',
                'E': 'work_phone',
                'F': 'work_email',
                'G': 'start_date',
                'H': 'end_date',
                'I': 'id_number',
                'J': 'id_issued_date',
                'K': 'id_issued_place',
                'L': 'permanent_address',
                'M': 'temporary_address',
                'N': 'tax_code',
                'O': 'social_security_number',
                'P': 'bank_account',
                'Q': 'department_name',
                'R': 'job_name',
                'S': 'contract_type',
                'T': 'contract_duration',
                'U': 'salary',
                'V': 'bonus'
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


    