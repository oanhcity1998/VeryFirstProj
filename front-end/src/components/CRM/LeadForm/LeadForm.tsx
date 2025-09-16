import React from "react";
import { Modal, Form, Input, Select, Button, Card } from "antd";
import "./LeadForm.css"

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
      title={initialValues ? "Chỉnh sửa khách hàng tiềm năng" : "Thêm mới khách hàng tiềm năng"}
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
      className="lead-form-modal"
      width="50%" 
      destroyOnClose
    >
      <Card >
        <Form
          form={form}
          layout="horizontal"   // 👈 change to horizontal
          labelCol={{ span: 10 }}   // 👈 label column width (adjust as needed)
          wrapperCol={{ span: 14 }} // 👈 input column width (adjust as needed)
          onFinish={onSubmit}
          initialValues={initialValues}
          className="lead-form"
        >
          <Form.Item className="form-label" label="Tên khách hàng" name="leadName" rules={[{ required: true, message: "Nhập tên khách hàng tiềm năng" }]}>
            <Input />
          </Form.Item>

          <Form.Item label="Tên liên hệ" name="contactName" rules={[{required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Chức vụ" name="position" rules={[{required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Công ty" name="company" rules={[{required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone" rules={[{required: true}]}>
            <Input />
          </Form.Item>

          <Form.Item label="Địa chỉ" name="address" rules={[{required: true}]}>
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

          <Form.Item label="Nhân viên phụ trách" name="owner" rules={[{required: true}]}>
            <Select placeholder="Chọn nhân viên">
              <Option value="A">Văn A</Option>
              <Option value="B">Nguyễn B</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Trạng thái" name="status" rules={[{required: true}]}>
            <Select placeholder="Chọn trạng thái">
              <Option value="new">Khách hàng mới</Option>
              <Option value="contacted">Đã liên hệ</Option>
              <Option value="converted">Đã chuyển đổi</Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </Modal>
  );
};

export default LeadForm;
