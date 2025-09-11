import json
from odoo import http
from odoo.http import request
from datetime import datetime

class AssetAPI(http.Controller):

    @http.route('/api/hr/assets', type='json', auth='user', methods=['POST'], csrf=False)
    def create_asset(self, **kwargs):
        try:
            if request.httprequest.data:
                data = json.loads(request.httprequest.data.decode("utf-8"))
            else:
                data = kwargs
        except Exception:
            return {"error": "Invalid JSON body"}

        # Validate required fields
        required_fields = ["code", "name"]
        for field in required_fields:
            if field not in data or not data[field]:
                return {"error": f"Missing required field: {field}"}

        # Check if asset code already exists
        existing_asset = request.env['hr.asset'].sudo().search([
            ('code', '=', data.get('code'))
        ], limit=1)
        
        if existing_asset:
            return {"error": f"Asset with code '{data.get('code')}' already exists"}

        # Validate owner_employee if provided
        owner_employee_id = data.get('owner_employee')
        if owner_employee_id:
            employee = request.env['hr.employee'].sudo().search([('id', '=', owner_employee_id)], limit=1)
            if not employee:
                return {"error": f"Employee with ID {owner_employee_id} not found"}

        # Validate status
        valid_statuses = ['available', 'in_use', 'maintenance', 'damaged', 'disposed']
        status = data.get('status', 'available')
        if status not in valid_statuses:
            return {"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}

        try:
            asset = request.env['hr.asset'].sudo().create({
                'code': data.get('code'),
                'name': data.get('name'),
                'buy_date': data.get('buy_date'),
                'value': data.get('value', 0.0),
                'status': status,
                'owner_employee': owner_employee_id,
                'warranty_date': data.get('warranty_date'),
                'links_file': data.get('links_file'),
                'note': data.get('note'),
            })
            
            return {
                "id": asset.id,
                "message": "Asset created successfully",
                "data": {
                    "id": asset.id,
                    "code": asset.code,
                    "name": asset.name,
                    "buy_date": str(asset.buy_date) if asset.buy_date else None,
                    "value": asset.value,
                    "status": asset.status,
                    "owner_employee_id": asset.owner_employee.id if asset.owner_employee else None,
                    "owner_employee_name": asset.owner_employee.name if asset.owner_employee else None,
                    "warranty_date": str(asset.warranty_date) if asset.warranty_date else None,
                    "links_file": asset.links_file,
                    "note": asset.note
                }
            }
        except Exception as e:
            return {"error": f"Failed to create asset: {str(e)}"}

    @http.route('/api/hr/assets', type='http', auth='user', methods=['GET'], csrf=False)
    def list_assets(self, **kwargs):
        try:
            # Get query parameters
            q = kwargs.get('q', '').strip()
            status = kwargs.get('status')
            owner_employee_id = kwargs.get('owner_employee_id')
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

            if status:
                domain.append(('status', '=', status))

            if owner_employee_id:
                domain.append(('owner_employee', '=', int(owner_employee_id)))

            # Get total count
            total = request.env['hr.asset'].sudo().search_count(domain)

            # Get assets with pagination
            offset = (page - 1) * limit
            assets = request.env['hr.asset'].sudo().search(
                domain, 
                offset=offset, 
                limit=limit, 
                order='name'
            )

            # Format data
            data = []
            for asset in assets:
                # Check warranty status
                warranty_status = 'valid'
                if asset.warranty_date:
                    today = datetime.now().date()
                    if asset.warranty_date < today:
                        warranty_status = 'expired'
                    elif (asset.warranty_date - today).days <= 30:
                        warranty_status = 'expiring_soon'

                data.append({
                    "id": asset.id,
                    "code": asset.code,
                    "name": asset.name,
                    "buy_date": str(asset.buy_date) if asset.buy_date else None,
                    "value": asset.value,
                    "status": asset.status,
                    "owner_employee_id": asset.owner_employee.id if asset.owner_employee else None,
                    "owner_employee_name": asset.owner_employee.name if asset.owner_employee else None,
                    "warranty_date": str(asset.warranty_date) if asset.warranty_date else None,
                    "warranty_status": warranty_status,
                    "links_file": asset.links_file,
                    "note": asset.note
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

    @http.route('/api/hr/assets/<int:asset_id>', type='http', auth='user', methods=['GET'], csrf=False)
    def get_asset(self, asset_id, **kwargs):
        try:
            asset = request.env['hr.asset'].sudo().search([
                ('id', '=', asset_id)
            ], limit=1)
            
            if not asset:
                return request.make_response(
                    json.dumps({"error": "Asset not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check warranty status
            warranty_status = 'valid'
            if asset.warranty_date:
                today = datetime.now().date()
                if asset.warranty_date < today:
                    warranty_status = 'expired'
                elif (asset.warranty_date - today).days <= 30:
                    warranty_status = 'expiring_soon'

            data = {
                "id": asset.id,
                "code": asset.code,
                "name": asset.name,
                "buy_date": str(asset.buy_date) if asset.buy_date else None,
                "value": asset.value,
                "status": asset.status,
                "owner_employee_id": asset.owner_employee.id if asset.owner_employee else None,
                "owner_employee_name": asset.owner_employee.name if asset.owner_employee else None,
                "owner_employee_email": asset.owner_employee.work_email if asset.owner_employee else None,
                "warranty_date": str(asset.warranty_date) if asset.warranty_date else None,
                "warranty_status": warranty_status,
                "links_file": asset.links_file,
                "note": asset.note
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

    @http.route('/api/hr/assets/<int:asset_id>', type='http', auth='user', methods=['PUT'], csrf=False)
    def update_asset(self, asset_id, **kwargs):
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

            # Find asset
            asset = request.env['hr.asset'].sudo().search([
                ('id', '=', asset_id)
            ], limit=1)
            
            if not asset:
                return request.make_response(
                    json.dumps({"error": "Asset not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            # Check if code is being changed and if it conflicts
            if 'code' in data and data['code'] != asset.code:
                existing_asset = request.env['hr.asset'].sudo().search([
                    ('code', '=', data['code']),
                    ('id', '!=', asset_id)
                ], limit=1)
                
                if existing_asset:
                    return request.make_response(
                        json.dumps({"error": f"Asset with code '{data['code']}' already exists"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Validate owner_employee if provided
            owner_employee_id = data.get('owner_employee')
            if owner_employee_id:
                employee = request.env['hr.employee'].sudo().search([('id', '=', owner_employee_id)], limit=1)
                if not employee:
                    return request.make_response(
                        json.dumps({"error": f"Employee with ID {owner_employee_id} not found"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Validate status if provided
            if 'status' in data:
                valid_statuses = ['available', 'in_use', 'maintenance', 'damaged', 'disposed']
                if data['status'] not in valid_statuses:
                    return request.make_response(
                        json.dumps({"error": f"Invalid status. Must be one of: {', '.join(valid_statuses)}"}),
                        headers=[('Content-Type', 'application/json')],
                        status=400
                    )

            # Update asset
            update_data = {}
            if 'code' in data:
                update_data['code'] = data['code']
            if 'name' in data:
                update_data['name'] = data['name']
            if 'buy_date' in data:
                update_data['buy_date'] = data['buy_date']
            if 'value' in data:
                update_data['value'] = data['value']
            if 'status' in data:
                update_data['status'] = data['status']
            if 'owner_employee' in data:
                update_data['owner_employee'] = data['owner_employee']
            if 'warranty_date' in data:
                update_data['warranty_date'] = data['warranty_date']
            if 'links_file' in data:
                update_data['links_file'] = data['links_file']
            if 'note' in data:
                update_data['note'] = data['note']

            asset.write(update_data)

            return request.make_response(
                json.dumps({
                    "message": "Asset updated successfully",
                    "data": {
                        "id": asset.id,
                        "code": asset.code,
                        "name": asset.name,
                        "buy_date": str(asset.buy_date) if asset.buy_date else None,
                        "value": asset.value,
                        "status": asset.status,
                        "owner_employee_id": asset.owner_employee.id if asset.owner_employee else None,
                        "owner_employee_name": asset.owner_employee.name if asset.owner_employee else None,
                        "warranty_date": str(asset.warranty_date) if asset.warranty_date else None,
                        "links_file": asset.links_file,
                        "note": asset.note
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

    @http.route('/api/hr/assets/<int:asset_id>', type='http', auth='user', methods=['DELETE'], csrf=False)
    def delete_asset(self, asset_id, **kwargs):
        try:
            asset = request.env['hr.asset'].sudo().search([
                ('id', '=', asset_id)
            ], limit=1)
            
            if not asset:
                return request.make_response(
                    json.dumps({"error": "Asset not found"}),
                    headers=[('Content-Type', 'application/json')],
                    status=404
                )

            asset_name = asset.name
            asset.unlink()

            return request.make_response(
                json.dumps({
                    "message": f"Asset '{asset_name}' deleted successfully"
                }),
                headers=[('Content-Type', 'application/json')]
            )

        except Exception as e:
            return request.make_response(
                json.dumps({"error": str(e)}),
                headers=[('Content-Type', 'application/json')],
                status=500
            )

    @http.route('/api/hr/assets/export', type='http', auth='user', methods=['GET'], csrf=False)
    def export_assets_csv(self, **kwargs):
        try:
            import csv
            import io

            # Get query parameters for filtering
            q = kwargs.get('q', '').strip()
            status = kwargs.get('status')
            owner_employee_id = kwargs.get('owner_employee_id')
            
            # Build domain
            domain = []
            if q:
                domain.append('|')
                domain.append('|')
                domain.append(('name', 'ilike', q))
                domain.append(('code', 'ilike', q))
                domain.append(('note', 'ilike', q))

            if status:
                domain.append(('status', '=', status))

            if owner_employee_id:
                domain.append(('owner_employee', '=', int(owner_employee_id)))

            assets = request.env['hr.asset'].sudo().search(domain, order='name')

            # Create CSV
            output = io.StringIO()
            writer = csv.writer(output)
            
            # Write headers
            headers = ['ID', 'Code', 'Name', 'Buy Date', 'Value', 'Status', 'Owner Employee', 'Warranty Date', 'Links File', 'Note']
            writer.writerow(headers)
            
            # Write data
            for asset in assets:
                writer.writerow([
                    asset.id,
                    asset.code or '',
                    asset.name or '',
                    str(asset.buy_date) if asset.buy_date else '',
                    asset.value or 0.0,
                    asset.status or '',
                    asset.owner_employee.name if asset.owner_employee else '',
                    str(asset.warranty_date) if asset.warranty_date else '',
                    asset.links_file or '',
                    asset.note or ''
                ])

            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"assets_export_{timestamp}.csv"

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

    @http.route('/api/hr/assets/warranty-expiring', type='http', auth='user', methods=['GET'], csrf=False)
    def get_warranty_expiring_assets(self, **kwargs):
        try:
            days = int(kwargs.get('days', 30))  # Default 30 days
            
            from datetime import datetime, timedelta
            today = datetime.now().date()
            future_date = today + timedelta(days=days)
            
            # Find assets with warranty expiring within specified days
            domain = [
                ('warranty_date', '>=', today),
                ('warranty_date', '<=', future_date)
            ]
            
            assets = request.env['hr.asset'].sudo().search(domain, order='warranty_date')
            
            data = []
            for asset in assets:
                days_until_expiry = (asset.warranty_date - today).days
                data.append({
                    "id": asset.id,
                    "code": asset.code,
                    "name": asset.name,
                    "warranty_date": str(asset.warranty_date),
                    "days_until_expiry": days_until_expiry,
                    "owner_employee_name": asset.owner_employee.name if asset.owner_employee else None,
                    "status": asset.status
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
