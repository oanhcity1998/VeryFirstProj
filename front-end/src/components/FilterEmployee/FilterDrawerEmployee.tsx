import { Drawer, Form, Button, Select } from "antd";
import "./FilterDrawerEmployee.css";

const { Option } = Select;

interface FilterDrawerEmployeeProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (values: any) => void;
}

const FilterDrawerEmployee: React.FC<FilterDrawerEmployeeProps> = ({ open, onClose, onConfirm }) => {
  const [form] = Form.useForm();

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
      title="Thông tin nhân sự"
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
        <Form.Item
          label="Mã nhân viên"
          name="employeeCode"
          rules={[{ required: true, message: "Vui lòng chọn mã nhân viên!" }]}
        >
          <Select placeholder="Chọn mã nhân viên">
            <Option value="nv01">NV01</Option>
            <Option value="nv02">NV02</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Vị trí"
          name="position"
          rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
        >
          <Select placeholder="Chọn vị trí">
            <Option value="dev">Developer</Option>
            <Option value="hr">HR</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Phòng ban"
          name="department"
          rules={[{ required: true, message: "Vui lòng chọn phòng ban!" }]}
        >
          <Select placeholder="Chọn phòng ban">
            <Option value="it">IT</Option>
            <Option value="finance">Tài chính</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[{ required: true, message: "Vui lòng chọn giới tính!" }]}
        >
          <Select placeholder="Chọn giới tính">
            <Option value="male">Nam</Option>
            <Option value="female">Nữ</Option>
          </Select>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default FilterDrawerEmployee;