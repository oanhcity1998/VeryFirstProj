from odoo import models, fields

class Department(models.Model):
    _inherit = 'hr.department'

    code = fields.Char(string="Department Code")
    note = fields.Text(string="Note")