import { Modal, Form, Input, Button } from "antd";
import { useEffect } from "react";
import "./ContactForm.css";

interface ContactFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void; // không bắt buộc trong chế độ detail
  initialValues?: any;
}

const ContactForm = ({ mode, open, onCancel, onOk, initialValues }: ContactFormProps) => {
  const [form] = Form.useForm();

  // set giá trị ban đầu khi edit / detail
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  const handleOk = () => {
    if (mode === "detail") {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      onOk?.(values);
      form.resetFields();
    });
  };

  const isDetail = mode === "detail";

  return (
    <Modal
      title={
        mode === "create"
          ? "Tạo mới liên hệ"
          : mode === "edit"
          ? "Chỉnh sửa liên hệ"
          : "Chi tiết liên hệ"
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
      width={800}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        disabled={isDetail} // 👈 tự động disable input nếu là detail
      >
        <div className="form-section">
          <h3>Thông tin liên hệ</h3>

          <Form.Item label="Tên liên hệ" name="contactName" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập họ và tên người liên hệ" />
          </Form.Item>

          <Form.Item label="Khách hàng" name="customerName" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập tên công ty hoặc khách hàng" />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập số điện thoại (ví dụ: 0901234567)" />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập địa chỉ email (ví dụ: abc@gmail.com)" />
          </Form.Item>

          <Form.Item label="Chức danh" name="title" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập chức danh (ví dụ: Giám đốc, Trưởng phòng...)" />
          </Form.Item>

          <Form.Item label="Liên hệ chính" name="mainContact" rules={[{ required: !isDetail }]}>
            <Input placeholder="Nhập tên người liên hệ chính" />
          </Form.Item>

          <Form.Item label="Ghi chú" name="note">
            <Input.TextArea rows={3} placeholder="Nhập ghi chú thêm (nếu có)" />
          </Form.Item>
        </div>
      </Form>
    </Modal>
  );
};

export default ContactForm;
