import React from "react";
import { Modal, Form, Input, Select, Button } from "antd";

const { Option } = Select;

interface LeadFormProps {
    open: boolean; 
    onCancel: () => void;
    onSubmit: (values: any) => void;
    initialValues?: any;
}


const LeadForm: React.FC<LeadFormProps> = ({ open, onCancel, onSubmit, initialValues }) => {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  return (
    <Modal
      open={open}
      title={initialValues ? "Chỉnh sửa Lead" : "Thêm mới Lead"}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
        >
          Lưu
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        initialValues={initialValues}
      >
        <Form.Item label="Tên lead" name="leadName" rules={[{ required: true, message: "Nhập tên lead" }]}>
          <Input />
        </Form.Item>

        <Form.Item label="Tên liên hệ" name="contactName">
          <Input />
        </Form.Item>

        <Form.Item label="Chức vụ" name="position">
          <Input />
        </Form.Item>

        <Form.Item label="Công ty" name="company">
          <Input />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input />
        </Form.Item>

        <Form.Item label="Số điện thoại" name="phone">
          <Input />
        </Form.Item>

        <Form.Item label="Địa chỉ" name="address">
          <Input />
        </Form.Item>

        <Form.Item label="Website" name="website">
          <Input />
        </Form.Item>

        <Form.Item label="Nguồn" name="source">
          <Select placeholder="Chọn nguồn">
            <Option value="web">Website</Option>
            <Option value="event">Sự kiện</Option>
            <Option value="referral">Giới thiệu</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Ưu tiên" name="priority">
          <Select placeholder="Chọn mức ưu tiên">
            <Option value="low">Thấp</Option>
            <Option value="medium">Trung bình</Option>
            <Option value="high">Cao</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Nhân viên phụ trách" name="owner">
          <Select placeholder="Chọn nhân viên">
            <Option value="A">Văn A</Option>
            <Option value="B">Nguyễn B</Option>
          </Select>
        </Form.Item>

        <Form.Item label="Trạng thái" name="status">
          <Select placeholder="Chọn trạng thái">
            <Option value="new">Khách hàng mới</Option>
            <Option value="contacted">Đã liên hệ</Option>
            <Option value="converted">Đã chuyển đổi</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default LeadForm;
