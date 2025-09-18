import { useEffect } from "react";
import { Drawer, Form, Button, Select } from "antd";
import { useGetEmployeesQuery } from "@/services/HRM/employee.service";
import { useGetDepartmentsQuery } from "@/services/HRM/department.service";
import { useGetJobsQuery } from "@/services/HRM/position.service";

const { Option } = Select;

interface FilterDrawerEmployeeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: any) => void;
  queryParams: {
    department_id?: number;
    job_id?: number;
    status?: string;
    contractType?: string;
    gender?: string;
    employee_id?: number;
  };
}

const FilterDrawerEmployee: React.FC<FilterDrawerEmployeeProps> = ({
  open,
  onClose,
  onConfirm,
  queryParams,
}) => {
  const [form] = Form.useForm();

  // Fetch data from APIs
  const { data: employeesData, isLoading: employeesLoading } = useGetEmployeesQuery({
    limit: 1000,
  });
  const { data: departmentsData, isLoading: departmentsLoading } = useGetDepartmentsQuery({
    limit: 1000,
  });
  const { data: jobsData, isLoading: jobsLoading } = useGetJobsQuery({ limit: 1000 });

  // Initialize form with queryParams when drawer opens
  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        department_id: queryParams.department_id || undefined,
        job_id: queryParams.job_id || undefined,
        status: queryParams.status || undefined,
        contractType: queryParams.contractType || undefined,
        gender: queryParams.gender || undefined,
        employee_id: queryParams.employee_id || undefined,
      });
    }
  }, [queryParams, form, open]);

  // Handle form submission
  const handleConfirm = () => {
    form
      .validateFields()
      .then((values) => {
        onConfirm(values);
        onClose();
      })
      .catch((error) => {
        console.log("Validation failed:", error);
      });
  };

  // Handle form reset
  const handleClearAll = () => {
    form.resetFields();
    onConfirm({
      department_id: undefined,
      job_id: undefined,
      status: undefined,
      contractType: undefined,
      gender: undefined,
      employee_id: undefined,
    });
    onClose();
  };

  return (
    <Drawer
      title="Bộ lọc nhân sự"
      placement="right"
      open={open}
      onClose={onClose}
      className="width-350"
      footer={
        <div className="filter-footer">
          <Button danger onClick={handleClearAll}>
            Hủy
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            Lọc
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        {/* Phòng ban */}
        <Form.Item label="Phòng ban" name="department_id">
          <Select placeholder="Chọn phòng ban" loading={departmentsLoading} allowClear>
            {departmentsData?.data.map((dep) => (
              <Option key={dep.id} value={dep.id}>
                {dep.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Vị trí */}
        <Form.Item label="Vị trí" name="job_id">
          <Select placeholder="Chọn vị trí" loading={jobsLoading} allowClear>
            {jobsData?.data.map((job) => (
              <Option key={job.id} value={job.id}>
                {job.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Loại hợp đồng */}
        <Form.Item label="Loại hợp đồng" name="contractType">
          <Select placeholder="Chọn loại hợp đồng" allowClear>
            <Option value="trial">Hợp đồng thử việc</Option>
            <Option value="fixed_term">Hợp đồng xác định thời hạn</Option>
            <Option value="indefinite">Hợp đồng không xác định thời hạn</Option>
          </Select>
        </Form.Item>

        {/* Giới tính */}
        <Form.Item label="Giới tính" name="gender">
          <Select placeholder="Chọn giới tính" allowClear>
            <Option value="Nam">Nam</Option>
            <Option value="Nữ">Nữ</Option>
          </Select>
        </Form.Item>

        {/* Mã nhân viên */}
        <Form.Item label="Mã nhân viên" name="employee_id">
          <Select placeholder="Chọn mã nhân viên" loading={employeesLoading} allowClear>
            {employeesData?.data.map((emp: any) => (
              <Option key={emp.id} value={emp.id}>
                {emp.code} - {emp.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterDrawerEmployee;
