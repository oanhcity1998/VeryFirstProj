import { useEffect } from "react";
import { Modal, Form, Input, Button, Select, Card } from "antd"; // Thêm Card
import { Department } from "@/models/HRM/department.model";
import { useGetEmployeesQuery } from "@/services/HRM/employee.service";

const { Option } = Select;

interface DepartmentFormProps {
  onCancel: () => void;
  onSave: (values: Department) => void;
  department?: Department | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
}

const DepartmentForm: React.FC<DepartmentFormProps> = ({
  onCancel,
  onSave,
  department,
  open,
  modalTitle = "Thêm mới",
  cancelText = "Hủy",
  saveText = "Xác nhận",
  loading = false,
}) => {
  const [form] = Form.useForm();

  // Lấy danh sách nhân viên
  const { data: employeesData, isLoading: employeesLoading } = useGetEmployeesQuery({
    limit: 1000,
  });

  useEffect(() => {
    if (department) {
      form.setFieldsValue({
        name: department.name,
        code: department.code,
        manager_id: department.manager_id ?? undefined,
        note: department.note,
      });
    } else {
      form.resetFields();
    }
  }, [department, form]);

  const onFinish = (values: any) => {
    const manager = employeesData?.data.find((e) => e.id === values.manager_id);

    onSave({
      id: department?.id || values.id || Date.now(),
      name: values.name,
      code: values.code || null,
      manager_id: values.manager_id || null,
      manager_name: manager?.name || null, // tự động set từ employee
      note: values.note || null,
    });
    onCancel();
  };

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
          disabled={loading}
        >
          {saveText}
        </Button>,
      ]}
      className="width-800 top-20 modal-scroll"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thông tin phòng ban" className="card-section">
          <Form.Item
            label="Mã phòng ban"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã phòng ban!" }]}
          >
            <Input placeholder="Nhập mã phòng ban (VD: DP001)" />
          </Form.Item>

          <Form.Item
            label="Tên phòng ban"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
          >
            <Input placeholder="Nhập tên phòng ban" />
          </Form.Item>

          <Form.Item
            label="Trưởng phòng"
            name="manager_id"
            rules={[{ required: true, message: "Vui lòng chọn trưởng phòng!" }]}
          >
            <Select placeholder="Chọn trưởng phòng" loading={employeesLoading} allowClear>
              {employeesData?.data.map((emp) => (
                <Option key={emp.id} value={emp.id}>
                  {emp.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea placeholder="Nhập ghi chú" autoSize={{ minRows: 5, maxRows: 10 }} />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;
