import { useEffect } from "react";
import { Modal, Form, Input, Button } from "antd";
import "./DepartmentForm.css";
import { Department } from "@/models/HRM/department.model";

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
  saveText = "Lưu",
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    console.log("Department prop in form:", department); // Debug department prop
    if (department) {
      form.setFieldsValue({
        name: department.name,
        code: department.code,
        manager_id: department.manager_id?.toString(), // Convert to string for input
        manager_name: department.manager_name,
        note: department.note,
      });
    } else {
      form.resetFields();
    }
  }, [department, form]);

  const onFinish = (values: any) => {
    console.log("Form values on submit:", values); // Debug form values
    onSave({
      id: department?.id || values.id || Date.now(), // Temporary ID for create
      name: values.name,
      code: values.code || null,
      manager_id: values.manager_id ? parseInt(values.manager_id) : null,
      manager_name: values.manager_name || null,
      note: values.note || null,
    });
    onCancel();
  };

  return (
    <Modal
      title={modalTitle}
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
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <h3>Thông tin phòng ban</h3>

          <Form.Item
            label="Tên phòng ban"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên phòng ban!" }]}
          >
            <Input placeholder="Nhập tên phòng ban" />
          </Form.Item>

          <Form.Item label="Mã phòng ban" name="code">
            <Input placeholder="Nhập mã phòng ban (VD: DP001)" />
          </Form.Item>

          <Form.Item
            label="Mã trưởng phòng"
            name="manager_id"
            rules={[
              { required: true, message: "Vui lòng nhập mã trưởng phòng!" },
              {
                validator: (_, value) =>
                  value && !isNaN(parseInt(value))
                    ? Promise.resolve()
                    : Promise.reject(new Error("Mã trưởng phòng phải là số!")),
              },
            ]}
          >
            <Input
              placeholder="Nhập mã trưởng phòng"
              onChange={(e) => {
                const value = e.target.value;
                form.setFieldsValue({ manager_id: value });
                console.log("manager_id input:", value); // Debug input value
              }}
            />
          </Form.Item>

          <Form.Item label="Tên trưởng phòng" name="manager_name">
            <Input placeholder="Nhập tên trưởng phòng" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default DepartmentForm;