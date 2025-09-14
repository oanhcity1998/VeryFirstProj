import { useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber } from "antd";
import "./PositionForm.css";
import { Position } from "@/models/HRM/position.model";

interface PositionFormProps {
  onCancel: () => void;
  onSave: (values: Position) => void;
  position?: Position | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
}

const PositionForm: React.FC<PositionFormProps> = ({
  onCancel,
  onSave,
  position,
  open,
  modalTitle = "Thêm mới",
  cancelText = "Hủy",
  saveText = "Lưu",
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        id: position.id,
        name: position.name,
        code: position.code,
        priority_level: position.priority_level,
        note: position.note,
      });
    } else {
      form.resetFields();
    }
  }, [position, form]);

  const onFinish = (values: any) => {
    onSave({
      id: position?.id || Date.now(), // Temporary ID for create
      name: values.name,
      code: values.code || null,
      priority_level: values.priority_level || null,
      note: values.note || null,
    });
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
          loading={loading}
          disabled={loading}
          onClick={() => form.submit()}
        >
          {saveText}
        </Button>,
      ]}
      width={800}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <div className="form-section">
          <h3>Thông tin chức vụ</h3>
          <Form.Item
            label="Tên chức vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên chức vụ!" }]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>
          <Form.Item label="Mã chức vụ" name="code">
            <Input placeholder="Nhập mã chức vụ (VD: GD82334)" />
          </Form.Item>
          <Form.Item label="Độ ưu tiên" name="priority_level">
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập độ ưu tiên (0-5)"
            />
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

export default PositionForm;