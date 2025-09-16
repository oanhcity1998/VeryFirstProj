import { useEffect } from "react";
import { Modal, Form, Input, Button, Select, Card } from "antd";
import "@/index.css";

interface Lead {
  id: number;
  leadName: string;
  contactName: string;
  email: string;
  phone: string;
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
  form: any;
}

const LeadForm: React.FC<LeadFormProps> = ({
  onCancel,
  onSave,
  lead,
  open,
  modalTitle = "Thêm khách hàng tiềm năng",
  cancelText = "Hủy",
  saveText = "Xác nhận",
  loading = false,
  form,
}) => {
  useEffect(() => {
    if (lead) {
      form.setFieldsValue({
        leadName: lead.leadName,
        contactName: lead.contactName,
        email: lead.email,
        phone: lead.phone,
        priority: lead.priority,
        owner: lead.owner,
        status: lead.status,
      });
    } else {
      form.resetFields();
    }
  }, [lead, form]);

  const onFinish = (values: any) => {
    onSave({
      id: lead?.id || Date.now(),
      leadName: values.leadName,
      contactName: values.contactName,
      email: values.email,
      phone: values.phone,
      priority: values.priority,
      owner: values.owner,
      status: values.status,
    });
  };

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={900}
      style={{ top: 20 }}
      bodyStyle={{ maxHeight: "80vh", overflowY: "auto" }}
      centered
      destroyOnClose
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Card title="Thông tin khách hàng tiềm năng" className="employee-card">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div>
              <Form.Item
                label="Tên khách hàng tiềm năng"
                name="leadName"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng tiềm năng!" }]}
              >
                <Input placeholder="Nhập tên khách hàng tiềm năng" />
              </Form.Item>
              <Form.Item
                label="Người liên hệ"
                name="contactName"
                rules={[{ required: true, message: "Vui lòng nhập người liên hệ!" }]}
              >
                <Input placeholder="Nhập người liên hệ" />
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
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </div>
            <div>
              <Form.Item
                label="Ưu tiên"
                name="priority"
                rules={[{ required: true, message: "Vui lòng chọn mức độ ưu tiên!" }]}
              >
                <Select placeholder="Chọn mức độ ưu tiên">
                  <Select.Option value="Cao">Cao</Select.Option>
                  <Select.Option value="Thấp">Thấp</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Nhân viên phụ trách"
                name="owner"
                rules={[{ required: true, message: "Vui lòng nhập nhân viên phụ trách!" }]}
              >
                <Input placeholder="Nhập nhân viên phụ trách" />
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select placeholder="Chọn trạng thái">
                  <Select.Option value="Khách hàng mới">Khách hàng mới</Select.Option>
                  <Select.Option value="Đang chăm sóc">Đang chăm sóc</Select.Option>
                  <Select.Option value="Chưa quan tâm">Chưa quan tâm</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </div>
        </Card>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 24 }}>
          <Button danger onClick={onCancel} disabled={loading}>
            {cancelText}
          </Button>
          <Button type="primary" htmlType="submit" loading={loading} disabled={loading}>
            {saveText}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default LeadForm;