import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
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
  Modal,
  message,
} from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // edit mode
  const [isEditing, setIsEditing] = useState(false);

  // delete modal state
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // fake customer data
  const mockCustomer = {
    id,
    name: "Công ty ABC",
    contractName: "ABC Corp",
    englishName: "ABC Corporation",
    taxCode: "123456789",
    phone: "0123456789",
    fax: "0123-456-789",
    email: "abc@company.com",
    address: "123 Đường Lớn, Quận 1, TP.HCM",
    industry: "Thương mại",
    market: "Việt Nam",
    branches: 5,
    employees: 120,
    revenue: "2 tỷ VND",
    documentsPerMonth: 30,
    taxStatus: "Đã quyết toán",
    notes: "Khách hàng tiềm năng",
  };

  const toggleEdit = () => {
    if (isEditing) {
      // 👉 save logic here (API call)
      message.success("Thông tin đã được lưu!");
    }
    setIsEditing(!isEditing);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      // 👉 call API here: await api.delete(`/customers/${mockCustomer.id}`);
      message.success("Đã xóa khách hàng");
      navigate("/customerlist");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const breadcrumbItems = [
    { title: <Link to="/customerlist">Danh sách khách hàng</Link> },
    { title: "Thông tin chi tiết" },
    { title: mockCustomer.name },
  ];

  const tabs = [
    {
      key: "1",
      label: "Thông tin chung",
      children: (
        <Row gutter={16}>
          {/* Left column */}
          <Col span={12}>
            <Card size="small" title="Thông tin khách hàng">
              <Form layout="vertical">
                <Form.Item label="Tên khách hàng">
                  <Input value={mockCustomer.name} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Tên DN ghi trên hợp đồng">
                  <Input value={mockCustomer.contractName} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Tên DN bằng tiếng Anh">
                  <Input value={mockCustomer.englishName} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Mã số thuế">
                  <Input value={mockCustomer.taxCode} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input value={mockCustomer.phone} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input value={mockCustomer.email} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Số fax">
                  <Input value={mockCustomer.fax} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input value={mockCustomer.address} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Ngành">
                  <Input value={mockCustomer.industry} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Thị trường chính">
                  <Input value={mockCustomer.market} readOnly={!isEditing} />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Right column */}
          <Col span={12}>
            <Card
              size="small"
              title="Người phụ trách"
              extra={<Avatar icon={<UserOutlined />} />}
            >
              <Form layout="vertical">
                <Form.Item label="Số lượng chi nhánh">
                  <Input value={mockCustomer.branches} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Số nhân sự">
                  <Input value={mockCustomer.employees} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Doanh thu TB/năm">
                  <Input value={mockCustomer.revenue} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Văn bản TB/tháng">
                  <Input value={mockCustomer.documentsPerMonth} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Trạng thái quyết toán thuế">
                  <Input value={mockCustomer.taxStatus} readOnly={!isEditing} />
                </Form.Item>
                <Form.Item label="Ghi chú">
                  <TextArea rows={3} value={mockCustomer.notes} readOnly={!isEditing} />
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
            onClick={() => navigate(-1)}
          />
          <Breadcrumb items={breadcrumbItems} separator=">" />
        </div>
      }
      extra={
        <div style={{ display: "flex", gap: "8px" }}>
          <Button onClick={toggleEdit}>
            {isEditing ? "Lưu" : "Chỉnh sửa"}
          </Button>
          <Button danger onClick={() => setDeleteOpen(true)}>Xóa</Button>
        </div>
      }
    >
      <Tabs type="card" defaultActiveKey="1" items={tabs} />
      {/* Delete confirmation modal */}
      <Modal
        open={deleteOpen}
        title="Xác nhận xóa"
        onOk={handleDelete}
        onCancel={() => setDeleteOpen(false)}
        okText="Xóa"
        cancelText="Hủy"
        okButtonProps={{ danger: true, loading: deleting }}
        centered
      >
        <p>Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác.</p>
      </Modal>
    </Card>
  );
}
