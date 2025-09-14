import { Drawer, Form, Button, Select } from "antd";
import "./FilterDrawerEmployee.css";
import { useGetEmployeesQuery } from "@/services/HRM/employee.service";
import { useGetDepartmentsQuery } from "@/services/HRM/department.service";
import { useGetJobsQuery } from "@/services/HRM/position.service";


const { Option } = Select;

interface FilterDrawerEmployeeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: any) => void;
}

const FilterDrawerEmployee: React.FC<FilterDrawerEmployeeProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [form] = Form.useForm();

  // Lấy dữ liệu từ API
  const { data: employeesData, isLoading: employeesLoading } =
    useGetEmployeesQuery({ limit: 1000 });
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDepartmentsQuery({ limit: 1000 });
  const { data: jobsData, isLoading: jobsLoading } =
    useGetJobsQuery({ limit: 1000 });

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

  return (
    <Drawer
      title="Bộ lọc nhân sự"
      placement="right"
      open={open}
      onClose={onClose}
      width={350}
      footer={
        <div className="filter-footer">
          <Button danger onClick={onClose}>
            Huỷ
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            Xác nhận
          </Button>
        </div>
      }
    >
      <Form layout="vertical" form={form}>
        {/* Phòng ban */}
        <Form.Item label="Phòng ban" name="department_id">
          <Select placeholder="Chọn phòng ban" loading={departmentsLoading}>
            {departmentsData?.data.map((dep) => (
              <Option key={dep.id} value={dep.id}>
                {dep.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Vị trí */}
        <Form.Item label="Vị trí" name="job_id">
          <Select placeholder="Chọn vị trí" loading={jobsLoading}>
            {jobsData?.data.map((job) => (
              <Option key={job.id} value={job.id}>
                {job.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Loại hợp đồng */}
        <Form.Item label="Loại hợp đồng" name="contractType">
          <Select placeholder="Chọn loại hợp đồng">
            <Option value="trial">Hợp đồng thử việc</Option>
            <Option value="fixed_term">Hợp đồng xác định thời hạn</Option>
            <Option value="indefinite">Hợp đồng không xác định thời hạn</Option>
          </Select>
        </Form.Item>

        {/* Giới tính */}
        <Form.Item label="Giới tính" name="gender">
          <Select placeholder="Chọn giới tính">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </Form.Item>

        {/* Mã nhân viên */}
        <Form.Item label="Mã nhân viên" name="employee_id">
          <Select placeholder="Chọn mã nhân viên" loading={employeesLoading}>
            {employeesData?.data.map((emp: any) => (
              <Option key={emp.id} value={emp.id}>
                {emp.code} - {emp.fullName}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterDrawerEmployee;
