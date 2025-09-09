from odoo import models, fields

class HrJob(models.Model):
    _inherit = "hr.job"

    code = fields.Char("Position Code")
    priority_level = fields.Integer("Priority Level")
    note = fields.Text("Note")
