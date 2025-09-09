from odoo import models, fields, api, _
from odoo.exceptions import ValidationError

class EmployeeAttachment(models.Model):
    _inherit = "ir.attachment"

    employee_id = fields.Many2one("hr.employee", string="Nhân viên")

    @api.model
    def create(self, vals):
        mimetype = vals.get("mimetype")
        allowed_types = ["application/pdf", "image/jpeg", "image/png"]
        if mimetype and mimetype not in allowed_types:
            raise ValidationError(_("Only PDF, JPG, or PNG files are allowed"))
        return super(EmployeeAttachment, self).create(vals)

    def write(self, vals):
        mimetype = vals.get("mimetype")
        allowed_types = ["application/pdf", "image/jpeg", "image/png"]
        if mimetype and mimetype not in allowed_types:
            raise ValidationError(_("Only PDF, JPG, or PNG files are allowed"))
        return super(EmployeeAttachment, self).write(vals)