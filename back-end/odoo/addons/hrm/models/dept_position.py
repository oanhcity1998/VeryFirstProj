from odoo import models, fields

class DeptPosition(models.Model):
    _name = 'hr.dept.position'
    _description = 'Department - Position Mapping'

    department_id = fields.Many2one(
        'hr.department',
        string="Department",
        required=True,
        ondelete="cascade"
    )
    job_id = fields.Many2one(
        'hr.job', 
        string="Position",
        required=True,
        ondelete="cascade"
    )
    assign_date = fields.Date("Assign Date")
    unassign_date = fields.Date("Unassign Date")
    note = fields.Text("Note")
    active = fields.Boolean(default=True)
