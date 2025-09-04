import { useEffect } from "react";
import { Modal, Form, Input, Button, Card, InputNumber } from "antd";
import dayjs, { Dayjs } from "dayjs";
import "./PositionForm.css";

interface Position {
  id?: string;
  positionName?: string;
  priority?: number;
  note?: string;
  expiration?: string;
}

interface PositionFormProps {
  onCancel: () => void;
  onSave: (values: Position) => void;
  position?: Position | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
}

const PositionForm: React.FC<PositionFormProps> = ({
  onCancel,
  onSave,
  position,
  open,
  modalTitle = "Thêm mới",
  cancelText = "Hủy",
  saveText = "Lưu",
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (position) {
      form.setFieldsValue({
        ...position,
        expiration: position.expiration
          ? dayjs(position.expiration, "DD/MM/YYYY")
          : null,
      });
    } else {
      form.resetFields();
    }
  }, [position, form]);

  const onFinish = (values: any) => {
    onSave({
      ...values,
      expiration: values.expiration
        ? values.expiration.format("DD/MM/YYYY")
        : null,
    });
    onCancel();
  };

  return (
    <Modal
      title={modalTitle}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          style={{ backgroundColor: "#f5f5f5", color: "#333" }}
          onClick={onCancel}
        >
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {saveText}
        </Button>,
      ]}
      width={800}
      bodyStyle={{
        background: "#fff",
        borderRadius: 12,
        padding: 24,
      }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card
          bordered
          className="form-section"
          style={{
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            padding: 16,
          }}
        >
          <Form.Item
            label="Mã chức vụ"
            name="id"
            rules={[{ required: true, message: "Vui lòng nhập mã chức vụ!" }]}
          >
            <Input placeholder="Nhập mã chức vụ (VD: GD82334)" />
          </Form.Item>

          <Form.Item
            label="Tên chức vụ"
            name="positionName"
            rules={[{ required: true, message: "Vui lòng nhập tên chức vụ!" }]}
          >
            <Input placeholder="Nhập tên chức vụ" />
          </Form.Item>

          <Form.Item
            label="Độ ưu tiên"
            name="priority"
            rules={[{ required: true, message: "Vui lòng nhập độ ưu tiên!" }]}
          >
            <InputNumber
              min={0}
              max={5}
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
        </Card>
      </Form>
    </Modal>
  );
};

export default PositionForm;
