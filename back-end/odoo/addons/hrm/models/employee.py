from odoo import models, fields, api
from odoo.exceptions import ValidationError
import re

class HrEmployee(models.Model):
    _inherit = "hr.employee"

    code = fields.Char("Employee Code", required=True)
    birthday = fields.Date("Birthday", required=True)
    gender = fields.Selection([
            ('Nam', 'Nam'),
            ('Nữ', 'Nữ'),
            ('Khác', 'Khác'),
        ],
        ondelete={
            'Nam': 'set default',
            'Nữ': 'set default',
            'Khác': 'set default',
        },
        required=True,
        default='Khác',
    )

    id_number = fields.Char("ID/CCCD Number", required=True)
    id_issued_place = fields.Char("Issued Place", required=True)
    id_issued_date = fields.Date("Issued Date", required=True)

    permanent_address = fields.Char("Permanent Address", required=True)
    temporary_address = fields.Char("Temporary Address")
    tax_id = fields.Char("Tax ID")
    insurance_id = fields.Char("Insurance ID")
    bank_account = fields.Char("Bank Account")
    work_email = fields.Char("Work Email")
    active = fields.Boolean(default=True)
    logs = fields.Json("Logs", default=list)

    _sql_constraints = [
        ("id_number_unique", "unique(id_number)", "ID number must be unique!"),
        ("code_unique", "unique(code)", "Employee code must be unique!"),

    ]
