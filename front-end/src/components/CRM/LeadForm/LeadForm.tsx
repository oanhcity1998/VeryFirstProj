import React, { useEffect } from "react";
import { Modal, Form, Input, Button, Select, Card, Row, Col } from "antd";

const { Option } = Select;

interface Lead {
  id: string;
  leadName: string;
  contactName: string;
  position: string;
  company: string;
  email: string;
  phone: string;
  address: string;
  website?: string;
  source?: string;
  priority: string;
  owner: string;
  status: string;
}

interface LeadFormProps {
  onCancel: () => void;
  onSave: (values: Lead) => void;
  lead?: Lead | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({
  onCancel,
  onSave,
  lead,
  open,
  modalTitle,
  cancelText = "Hủy",
  saveText = lead ? "Lưu thay đổi" : "Xác nhận",
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (lead && open) {
      form.setFieldsValue({
        leadName: lead.leadName,
        contactName: lead.contactName,
        position: lead.position,
        company: lead.company,
        email: lead.email,
        phone: lead.phone,
        address: lead.address,
        website: lead.website,
        source: lead.source,
        priority: lead.priority,
        owner: lead.owner,
        status: lead.status,
      });
    } else if (open) {
      form.resetFields();
    }
  }, [lead, open, form]);

  const onFinish = (values: any) => {
    onSave({
      id: lead?.id || String(Date.now()),
      leadName: values.leadName,
      contactName: values.contactName,
      position: values.position,
      company: values.company,
      email: values.email,
      phone: values.phone,
      address: values.address,
      website: values.website,
      source: values.source,
      priority: values.priority,
      owner: values.owner,
      status: values.status,
    });
    if (!lead) {
      form.resetFields();
    }
  };

  return (
    <Modal
      title={
        <h2>
          {modalTitle ||
            (lead ? "Chỉnh sửa khách hàng tiềm năng" : "Thêm mới khách hàng tiềm năng")}
        </h2>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          {saveText}
        </Button>,
      ]}
      className="width-800"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thông tin khách hàng tiềm năng" className="card-section">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Tên khách hàng"
                name="leadName"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng tiềm năng!" }]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
              <Form.Item
                label="Tên liên hệ"
                name="contactName"
                rules={[{ required: true, message: "Vui lòng nhập tên liên hệ!" }]}
              >
                <Input placeholder="Nhập tên liên hệ" />
              </Form.Item>
              <Form.Item
                label="Chức vụ"
                name="position"
                rules={[{ required: true, message: "Vui lòng nhập chức vụ!" }]}
              >
                <Input placeholder="Nhập chức vụ" />
              </Form.Item>
              <Form.Item
                label="Công ty"
                name="company"
                rules={[{ required: true, message: "Vui lòng nhập tên công ty!" }]}
              >
                <Input placeholder="Nhập tên công ty" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input placeholder="Nhập email" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^0\d{9}$/,
                    message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
              <Form.Item
                label="Địa chỉ"
                name="address"
                rules={[{ required: true, message: "Vui lòng nhập địa chỉ!" }]}
              >
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item label="Website" name="website" rules={[{ required: false }]}>
                <Input placeholder="Nhập website" />
              </Form.Item>
              <Form.Item label="Nguồn" name="source" rules={[{ required: false }]}>
                <Select placeholder="Chọn nguồn" allowClear>
                  <Option value="web">Website</Option>
                  <Option value="event">Sự kiện</Option>
                  <Option value="referral">Giới thiệu</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Nhân viên phụ trách"
                name="owner"
                rules={[{ required: true, message: "Vui lòng chọn nhân viên phụ trách!" }]}
              >
                <Select placeholder="Chọn nhân viên">
                  <Option value="A">Văn A</Option>
                  <Option value="B">Nguyễn B</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Option value="new">Khách hàng mới</Option>
                  <Option value="contacted">Đã liên hệ</Option>
                  <Option value="converted">Đã chuyển đổi</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Card>
      </Form>
    </Modal>
  );
};

export default LeadForm;
