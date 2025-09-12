from odoo import models, fields, api

class Asset(models.Model):
    _name = 'hr.asset'
    _description = 'HR Asset Management'
    _order = 'name'

    code = fields.Char(string='Asset Code', required=True, index=True)
    name = fields.Char(string='Asset Name', required=True)
    purchase_date = fields.Date(string='Purchase Date')
    value = fields.Float(string='Asset Value', digits=(16, 2))
    status = fields.Selection([
        ('available', 'Available'),
        ('in_use', 'In Use'),
        ('maintenance', 'Under Maintenance'),
        ('damaged', 'Damaged'),
        ('disposed', 'Disposed')
    ], string='Status', default='available', required=True)
    owner_employee = fields.Many2one('hr.employee', string='Owner Employee')
    warranty_date = fields.Date(string='Warranty Expiry Date')
    files = fields.Char(string='Document Links')
    note = fields.Text(string='Notes')

    @api.constrains('code')
    def _check_unique_code(self):
        for record in self:
            if self.search_count([('code', '=', record.code), ('id', '!=', record.id)]) > 0:
                raise ValueError(f"Asset code '{record.code}' already exists!")

    def name_get(self):
        result = []
        for record in self:
            result.append((record.id, f"[{record.code}] {record.name}"))
        return result
