import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Card,
  Input,
  Tabs,
  Button,
  Form,
  Row,
  Col,
  Avatar,
  Breadcrumb,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import "./CustomerDetail.css";

const { TextArea } = Input;


export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();


  // Mock data (replace with API)
  const mockCustomer = {
    id,
    name: "Công ty ABC",
    contractName: "ABC Corp",
    taxCode: "123456789",
    phone: "0123456789",
    email: "abc@company.com",
    fax: "0123-456-789",
    address: "123 Đường Lớn, Quận 1, TP.HCM",
    branches: 5,
    employees: 120,
    revenue: "2 tỷ VND",
    documentsPerMonth: 30,
    taxStatus: "Đã quyết toán",
    notes: "Khách hàng tiềm năng",
  };

   const breadcrumbItems = [
    { title: <Link to="/customerlist">Danh sách khách hàng</Link> },
    { title: "Thông tin chi tiết" },
    // Optional: show current customer name
    { title: mockCustomer.name },
  ];

  const tabs = [
    {
      key: "1",
      label: "Thông tin chung",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Form layout="vertical" className="customer-info-form">
              <Form.Item label="Tên khách hàng">
                <Input value={mockCustomer.name} readOnly />
              </Form.Item>
              <Form.Item label="Tên doanh nghiệp ghi trên hợp đồng">
                <Input value={mockCustomer.contractName} readOnly />
              </Form.Item>
              <Form.Item label="Mã số thuế">
                <Input value={mockCustomer.taxCode} readOnly />
              </Form.Item>
              <Form.Item label="Số điện thoại">
                <Input value={mockCustomer.phone} readOnly />
              </Form.Item>
              <Form.Item label="Email">
                <Input value={mockCustomer.email} readOnly />
              </Form.Item>
              <Form.Item label="Số fax">
                <Input value={mockCustomer.fax} readOnly />
              </Form.Item>
              <Form.Item label="Địa chỉ">
                <Input value={mockCustomer.address} readOnly />
              </Form.Item>
            </Form>
          </Col>

          <Col span={12}>
            <Card
              size="small"
              title="Người phụ trách"
              extra={<Avatar icon={<UserOutlined />} />}
              className="customer-extra-card"
            >
              <Form layout="vertical">
                <Form.Item label="Số lượng chi nhánh hoạt động">
                  <Input value={mockCustomer.branches} readOnly />
                </Form.Item>
                <Form.Item label="Số nhân sự hiện tại của khách hàng">
                  <Input value={mockCustomer.employees} readOnly />
                </Form.Item>
                <Form.Item label="Doanh thu trung bình mỗi năm">
                  <Input value={mockCustomer.revenue} readOnly />
                </Form.Item>
                <Form.Item label="Số lượng văn bản trao đổi mỗi tháng">
                  <Input value={mockCustomer.documentsPerMonth} readOnly />
                </Form.Item>
                <Form.Item label="Trạng thái quyết toán thuế">
                  <Input value={mockCustomer.taxStatus} readOnly />
                </Form.Item>
                <Form.Item label="Ghi chú">
                  <TextArea rows={3} value={mockCustomer.notes} readOnly />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      ),
    },
    { key: "2", label: "Liên Hệ", children: <p>Danh sách liên hệ…</p> },
    { key: "3", label: "Báo giá", children: <p>Thông tin báo giá…</p> },
    { key: "4", label: "Hợp đồng", children: <p>Danh sách hợp đồng…</p> },
    { key: "5", label: "Tài liệu", children: <p>File tài liệu…</p> },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)} // 👈 go back
          />
          <Breadcrumb items={breadcrumbItems} separator=">" />
        </div>
      }
      className="customer-detail-card"
      extra={
        <div className="customer-detail-extra">
          <Button>Trạng thái</Button>
          <Button danger>Xóa</Button>
        </div>
      }
    >
      <Tabs type="card" defaultActiveKey="1" items={tabs} tabBarGutter={32} />
    </Card>
  );
}