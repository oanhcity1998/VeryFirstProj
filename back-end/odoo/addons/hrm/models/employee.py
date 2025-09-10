from odoo import models, fields, api
from odoo.exceptions import ValidationError
import re

class HrEmployee(models.Model):
    _inherit = "hr.employee"

    birthday = fields.Date("Birthday", required=True)
    gender = fields.Selection([
        ("male", "Male"),
        ("female", "Female"),
        ("other", "Other"),
    ], string="Gender", required=True)

    x_id_number = fields.Char("ID/CCCD Number", required=True)
    x_id_issued_place = fields.Char("Issued Place", required=True)
    x_id_issued_date = fields.Date("Issued Date", required=True)

    permanent_address = fields.Char("Permanent Address", required=True)
    x_temporary_address = fields.Char("Temporary Address")
    x_tax_id = fields.Char("Tax ID")
    x_insurance_id = fields.Char("Insurance ID")
    x_bank_account = fields.Char("Bank Account")

    work_email = fields.Char("Work Email", unique=True)

    active = fields.Boolean(default=True)

    _sql_constraints = [
        ("x_id_number_unique", "unique(x_id_number)", "ID number must be unique!"),
        ("work_email_unique", "unique(work_email)", "Work email must be unique!"),
    ]

    @api.constrains('x_id_number')
    def _check_x_id_number(self):
        for record in self:
            if record.x_id_number:
                if not re.fullmatch(r"\d{12}", record.x_id_number):
                    raise ValidationError("ID/CCCD Number must be exactly 12 digits!")
