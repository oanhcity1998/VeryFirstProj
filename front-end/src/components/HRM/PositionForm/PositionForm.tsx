import { useEffect } from "react";
import { Modal, Form, Input, Button, InputNumber, Card } from "antd";

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
  saveText = "Xác nhận",
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
        <Card title="Thông tin chức vụ" className="card-section">
          <Form.Item
            label="Mã chức vụ"
            name="code"
            rules={[{ required: true, message: "Vui lòng nhập mã chức vụ!" }]}
          >
            <Input placeholder="Nhập mã chức vụ (VD: GD82334)" />
          </Form.Item>
          <Form.Item
            label="Tên chức vụ"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên chức vụ!" }]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>
          <Form.Item
            label="Độ ưu tiên"
            name="priority_level"
            rules={[{ type: 'number', min: 0, max: 5, message: 'Độ ưu tiên phải từ 0 đến 5' }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Nhập độ ưu tiên (0-5)"
            />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea
              placeholder="Nhập ghi chú"
              autoSize={{ minRows: 5, maxRows: 10 }}
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default PositionForm;