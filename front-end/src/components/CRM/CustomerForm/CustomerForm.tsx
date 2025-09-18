import { useEffect } from "react";
import { Modal, Form, Input, Button, Upload, Select, Row, Col, Card, FormInstance } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

interface CustomerFormProps {
  onCancel: () => void;
  onSave: (values: any) => void;
  customer?: any | null;
  open: boolean;
  modalTitle?: string;
  customerInfoTitle?: string;
  extraInfoTitle?: string;
  otherInfoTitle?: string;
  cancelText?: string;
  saveText?: string;
  form: FormInstance;
  loading?: boolean;
  mode?: "add" | "edit";
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  onCancel,
  onSave,
  customer,
  open,
  modalTitle = "Thêm khách hàng",
  customerInfoTitle = "Thông tin khách hàng",
  extraInfoTitle = "Thông tin bổ sung",
  otherInfoTitle = "Thông tin khác",
  cancelText = "Hủy",
  saveText = "Xác nhận",
  form,
  loading = false,
  mode = "add",
}) => {
  useEffect(() => {
    if (customer) {
      form.setFieldsValue(customer);
    } else {
      form.resetFields();
    }
  }, [customer, form]);

  const onFinish = (values: any) => {
    onSave(values);
  };

  return (
    <Modal
      title={<h2>{mode === "edit" ? "Chỉnh sửa khách hàng" : modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button key="submit" type="primary" onClick={() => form.submit()} loading={loading}>
          {saveText}
        </Button>,
      ]}
      className="width-1100 top-20"
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Row gutter={16} align="stretch">
          <Col span={8}>
            <Card title={customerInfoTitle} className="employee-card card-section">
              <Form.Item
                label="Tên khách hàng"
                name="customerName"
                rules={[{ required: true, message: "Vui lòng nhập tên khách hàng!" }]}
              >
                <Input placeholder="Nhập tên khách hàng" />
              </Form.Item>
              <Form.Item label="Tên doanh nghiệp ghi trên hợp đồng" name="companyContractName">
                <Input placeholder="Nhập tên doanh nghiệp" />
              </Form.Item>
              <Form.Item label="Tên doanh nghiệp bằng tiếng Anh" name="companyEnglishName">
                <Input placeholder="Nhập tên doanh nghiệp tiếng Anh" />
              </Form.Item>
              <Form.Item label="Mã số thuế" name="taxCode">
                <Input placeholder="Nhập mã số thuế" />
              </Form.Item>
              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[
                  { required: true, message: "Vui lòng nhập số điện thoại!" },
                  {
                    pattern: /^[0-9]{9,11}$/,
                    message: "Số điện thoại không hợp lệ!",
                  },
                ]}
              >
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Card>
          </Col>
          <Col span={8}>
            <Card title={extraInfoTitle} className="employee-card card-section">
              <Form.Item label="Số fax" name="fax">
                <Input placeholder="Nhập số fax" />
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
              <Form.Item label="Địa chỉ" name="address">
                <Input placeholder="Nhập địa chỉ" />
              </Form.Item>
              <Form.Item label="Ngành" name="industry">
                <Input placeholder="Nhập ngành" />
              </Form.Item>
              <Form.Item label="Thị trường chính" name="mainMarket">
                <Input placeholder="Nhập thị trường chính" />
              </Form.Item>
            </Card>
          </Col>
          <Col span={8}>
            <Card title={otherInfoTitle} className="employee-card card-section">
              <Form.Item label="Số lượng chi nhánh hoạt động" name="branchCount">
                <Input placeholder="Nhập số lượng chi nhánh" />
              </Form.Item>
              <Form.Item label="Số nhân sự hiện tại của khách hàng" name="currentStaff">
                <Input placeholder="Nhập số nhân sự" />
              </Form.Item>
              <Form.Item label="Doanh thu trung bình mỗi năm" name="avgRevenue">
                <Input placeholder="Nhập doanh thu trung bình" />
              </Form.Item>
              <Form.Item label="Số lượng văn bản trao đổi mỗi tháng" name="monthlyDocs">
                <Input placeholder="Nhập số lượng văn bản" />
              </Form.Item>
              <Form.Item label="Trạng thái quyết toán thuế" name="taxStatus">
                <Select placeholder="Chọn trạng thái">
                  <Option value="done">Đã quyết toán</Option>
                  <Option value="pending">Chưa quyết toán</Option>
                  <Option value="other">Khác</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Năm quyết toán" name="taxSettlemenYear">
                <Input placeholder="Nhập năm quyết toán" />
              </Form.Item>
              <Form.Item label="Tài liệu" name="documents">
                <Upload beforeUpload={() => false}>
                  <Button icon={<UploadOutlined />}>Tải lên tài liệu</Button>
                </Upload>
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default CustomerForm;
