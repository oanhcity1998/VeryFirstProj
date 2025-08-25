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
  Breadcrumb,
  Modal,
  Select,
  message,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import ContactList from "../ContactList/ContactList";

import "./CustomerDetail.css";

const { TextArea } = Input;
const { Option } = Select;

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [isEditing, setIsEditing] = useState(false);
  // const [deleteOpen, setDeleteOpen] = useState(false);
  // const [deleting, setDeleting] = useState(false);

  // move mock data into state
  const [customer, setCustomer] = useState({
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
  });

  // const toggleEdit = () => {
  //   if (isEditing) {
  //     message.success("Thông tin đã được lưu!");
  //   }
  //   setIsEditing(!isEditing);
  // };

  // const handleDelete = async () => {
  //   try {
  //     setDeleting(true);
  //     message.success("Đã xóa khách hàng");
  //     navigate("/customerlist");
  //   } finally {
  //     setDeleting(false);
  //     setDeleteOpen(false);
  //   }
  // };

  const breadcrumbItems = [
    { title: <Link to="/customerlist">Danh sách khách hàng</Link> },
    { title: "Thông tin chi tiết" },
    { title: customer.name },
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
              <Form layout="vertical" className="customer-info-form">
                <Form.Item label="Tên khách hàng">
                  <Input
                    value={customer.name}
                    // readOnly={!isEditing}
                    // onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                  />
                </Form.Item>
                <Form.Item label="Tên DN ghi trên hợp đồng">
                  <Input
                    value={customer.contractName}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, contractName: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Tên DN bằng tiếng Anh">
                  <Input
                    value={customer.englishName}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, englishName: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Mã số thuế">
                  <Input
                    value={customer.taxCode}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, taxCode: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input
                    value={customer.phone}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, phone: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Email">
                  <Input
                    value={customer.email}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, email: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Số fax">
                  <Input
                    value={customer.fax}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, fax: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input
                    value={customer.address}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, address: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Ngành">
                  <Input
                    value={customer.industry}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, industry: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Thị trường chính">
                  <Input
                    value={customer.market}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, market: e.target.value })
                    // }
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>

          {/* Right column */}
          <Col span={12}>
            <Card size="small" title="Thông tin chung" className="customer-extra-card">
              <Form layout="vertical">
                <Form.Item label="Số lượng chi nhánh">
                  <Input
                    value={customer.branches}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, branches: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Số nhân sự">
                  <Input
                    value={customer.employees}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, employees: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Doanh thu TB/năm">
                  <Input
                    value={customer.revenue}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, revenue: e.target.value })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Văn bản TB/tháng">
                  <Input
                    value={customer.documentsPerMonth}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({
                    //     ...customer,
                    //     documentsPerMonth: e.target.value,
                    //   })
                    // }
                  />
                </Form.Item>
                <Form.Item label="Trạng thái quyết toán thuế">
                    <Select
                        value={customer.taxStatus}
                        // disabled={!isEditing}
                        // onChange={(value) => setCustomer({ ...customer, taxStatus: value })}
                    >
                        <Option value="Đã quyết toán">Đã quyết toán</Option>
                        <Option value="Chưa quyết toán">Chưa quyết toán</Option>
                        <Option value="Đang xử lý">Đang xử lý</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Ghi chú">
                  <TextArea
                    rows={3}
                    value={customer.notes}
                    // readOnly={!isEditing}
                    // onChange={(e) =>
                    //   setCustomer({ ...customer, notes: e.target.value })
                    // }
                  />
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      ),
    },
    { key: "2", label: "Liên Hệ", children: <p>
      Liên hệ
    </p> },
    { key: "3", label: "Báo giá", children: <p>Thông tin báo giá…</p> },
    { key: "4", label: "Hợp đồng", children: <p>Danh sách hợp đồng…</p> },
    { key: "5", label: "Tài liệu", children: <p>File tài liệu…</p> },
  ];

  return (
    <Card
      className="customer-detail-card"
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
      // extra={
      //   <div className="customer-detail-extra">
      //     <Button onClick={toggleEdit}>{isEditing ? "Lưu" : "Chỉnh sửa"}</Button>
      //     <Button danger onClick={() => setDeleteOpen(true)}>Xóa</Button>
      //   </div>
      // }
    >
      <Tabs type="card" defaultActiveKey="1" items={tabs} />
      {/* <Modal
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
      </Modal> */}
    </Card>
  );
}
