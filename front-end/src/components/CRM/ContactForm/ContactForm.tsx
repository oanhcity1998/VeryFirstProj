import { Modal, Form, Input, Button, Card } from "antd";
import { useEffect } from "react";

interface ContactFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
  initialValues?: any;
}

const ContactForm = ({ mode, open, onCancel, onOk, initialValues }: ContactFormProps) => {
  const [form] = Form.useForm();
  const isDetail = mode === "detail";

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  const handleOk = () => {
    if (isDetail) {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      onOk?.(values);
      form.resetFields();
    });
  };

  return (
    <Modal
      title={
        <h2>{mode === "create" ? "Tạo" : mode === "edit" ? "Chỉnh sửa" : "Chi tiết"} liên hệ</h2>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          {isDetail ? "Đóng" : "Huỷ"}
        </Button>,
        !isDetail && (
          <Button key="submit" type="primary" onClick={handleOk}>
            {mode === "create" ? "Xác nhận" : "Lưu thay đổi"}
          </Button>
        ),
      ]}
      className="top-20 width-800"
    >
      <Form form={form} layout="vertical" disabled={isDetail}>
        <Card title="Thông tin liên hệ" className="card-section">
          <Form.Item
            label="Tên liên hệ"
            name="contactName"
            rules={[{ required: !isDetail, message: "Vui lòng nhập tên liên hệ!" }]}
          >
            <Input placeholder="Nhập họ và tên người liên hệ" />
          </Form.Item>
          <Form.Item
            label="Khách hàng"
            name="customerName"
            rules={[{ required: !isDetail, message: "Vui lòng nhập tên khách hàng!" }]}
          >
            <Input placeholder="Nhập tên công ty hoặc khách hàng" />
          </Form.Item>
          <Form.Item
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: !isDetail, message: "Vui lòng nhập số điện thoại!" },
              {
                pattern: /^0\d{9}$/,
                message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!",
              },
            ]}
          >
            <Input placeholder="Nhập số điện thoại (ví dụ: 0901234567)" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: !isDetail, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" },
            ]}
          >
            <Input placeholder="Nhập địa chỉ email (ví dụ: abc@gmail.com)" />
          </Form.Item>
          <Form.Item
            label="Chức danh"
            name="title"
            rules={[{ required: !isDetail, message: "Vui lòng nhập chức danh!" }]}
          >
            <Input placeholder="Nhập chức danh (ví dụ: Giám đốc, Trưởng phòng...)" />
          </Form.Item>
          <Form.Item
            label="Liên hệ chính"
            name="mainContact"
            rules={[{ required: !isDetail, message: "Vui lòng nhập tên người liên hệ chính!" }]}
          >
            <Input placeholder="Nhập tên người liên hệ chính" />
          </Form.Item>
          <Form.Item label="Ghi chú" name="note" rules={[{ required: false }]}>
            <Input.TextArea rows={3} placeholder="Nhập ghi chú thêm (nếu có)" />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default ContactForm;
