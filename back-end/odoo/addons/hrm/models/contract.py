from odoo import models, fields, api
from odoo.exceptions import ValidationError

class HrContract(models.Model):
    _name = "hr.contract.custom"
    _description = "Employee Contract"
    _order = "date_start desc"

    name = fields.Char("Contract Name", required=True)
    employee_id = fields.Many2one("hr.employee", string="Employee", required=True, ondelete="cascade")
    x_contract_type = fields.Selection([
        ("probation", "Probation"),
        ("fixed_term", "Fixed Term"),
        ("unlimited", "Unlimited"),
    ], string="Contract Type", required=True)
    x_contract_term = fields.Char("Contract Term")
    date_start = fields.Date("Start Date", required=True)
    date_end = fields.Date("End Date", required=True)
    wage = fields.Float("Wage", required=True)
    x_bonus = fields.Float("Bonus")
    state = fields.Selection([
        ("draft", "Draft"),
        ("open", "Open"),
        ("close", "Closed"),
    ], string="Status", default="draft")

    @api.constrains("date_start", "date_end")
    def _check_dates(self):
        for rec in self:
            if rec.date_start and rec.date_end and rec.date_start > rec.date_end:
                raise ValidationError("Contract start date must be before end date!")

    @api.constrains("wage")
    def _check_wage(self):
        for rec in self:
            if rec.wage <= 0:
                raise ValidationError("Wage must be greater than 0!")
