import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, Input, Tabs, Form, Row, Col, Breadcrumb, Select, message } from "antd";


import "./CustomerDetail.css";
import { ROUTES_APP } from "../../../app/routes";
import TableContact from "@/components/CRM/TableContact/TableContact";
import ContactForm from "@/components/CRM/ContactForm/ContactForm";

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  // const [isEditing, setIsEditing] = useState(false);
  // const [deleteOpen, setDeleteOpen] = useState(false);
  // const [deleting, setDeleting] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [filterCustomer, setFilterCustomer] = useState(null);
  const [filterMainContact, setFilterMainContact] = useState(null);
  const [customerOptions, setCustomerOptions] = useState(["Công ty ABC", "Công ty XYZ"]);
  const [mainContactOptions, setMainContactOptions] = useState(["Nguyễn Văn A", "Trần Thị B"]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [data, setData] = useState([
    {
      key: "1",
      id: "10",
      contactName: "Nguyễn Văn A",
      customerName: "Công ty TNHH ABC",
      phone: "0901234567",
      email: "vana@abc.com",
      title: "Giám đốc",
      mainContact: "Nguyễn Văn A",
      note: "Khách hàng lâu năm",
    },
    {
      key: "2",
      id: "11",
      contactName: "Trần Thị B",
      customerName: "Công ty TNHH XYZ",
      phone: "0912345678",
      email: "tranb@xyz.com",
      title: "Kế toán trưởng",
      mainContact: "Nguyễn Văn C",
      note: "Khách hàng mới",
    },
    {
      key: "3",
      id: "12",
      contactName: "Lê Văn C",
      customerName: "Công ty CP MNO",
      phone: "0923456789",
      email: "lec@mno.com",
      title: "Trưởng phòng Kinh doanh",
      mainContact: "Lê Văn C",
      note: "Tiềm năng",
    },
    {
      key: "4",
      id: "13",
      contactName: "Phạm Thị D",
      customerName: "Công ty TNHH ABC",
      phone: "0934567890",
      email: "phamd@abc.com",
      title: "Nhân viên",
      mainContact: "Nguyễn Văn A",
      note: "Liên hệ phụ",
    },
    {
      key: "5",
      id: "14",
      contactName: "Hoàng Văn E",
      customerName: "Công ty CP PQR",
      phone: "0945678901",
      email: "hoange@pqr.com",
      title: "Phó Giám đốc",
      mainContact: "Hoàng Văn E",
      note: "Khách VIP",
    },
    {
      key: "6",
      id: "15",
      contactName: "Đỗ Thị F",
      customerName: "Công ty TNHH XYZ",
      phone: "0956789012",
      email: "dof@xyz.com",
      title: "Trợ lý",
      mainContact: "Nguyễn Văn C",
      note: "Cần follow-up",
    },
  ]);

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
  //     navigate(ROUTES_APP.crm.customerList);
  //   } finally {
  //     setDeleting(false);
  //     setDeleteOpen(false);
  //   }
  // };

  const handleEdit = (values: any) => {
    message.success("Đã cập nhật liên hệ");
    setIsEditModalOpen(false);
  };

  const breadcrumbItems = [
    { title: <Link to={ROUTES_APP.crm.customerList}>Danh sách khách hàng</Link> },
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

                <Form.Item label="Năm quyết toán">
                  <Input
                    value="2025"
                  // readOnly={!isEditing}
                  // onChange={(e) =>
                  //   setCustomer({
                  //     ...customer,
                  //     documentsPerMonth: e.target.value,
                  //   })
                  // }
                  />
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
    {
      key: "2",
      label: "Liên Hệ",
      children: (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
            <h2 style={{ flex: 1, textAlign: "center" }}>Thông tin người liên hệ</h2>

            <Search
              placeholder="Nhập tên người liên hệ..."
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              className="header-search"
            />

            <Select
              allowClear
              placeholder="Lọc theo Khách hàng"
              style={{ width: 200 }}
              value={filterCustomer}
              onChange={(val) => setFilterCustomer(val)}
              options={customerOptions.map((c) => ({ label: c, value: c }))}
            />

            <Select
              allowClear
              placeholder="Lọc theo Liên hệ chính"
              style={{ width: 200 }}
              value={filterMainContact}
              onChange={(val) => setFilterMainContact(val)}
              options={mainContactOptions.map((m) => ({ label: m, value: m }))}
            />
          </div>

          <TableContact
            data={data}
            searchText={searchText}
            filterCustomer={filterCustomer}
            filterMainContact={filterMainContact}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys as (keys: string[]) => void}
            onShowClick={(record) => {
              setSelectedContact(record as any);
              setIsDetailModalOpen(true);
            }}
            // onEditClick={(record) => {
            //   setSelectedContact(record);
            //   setIsEditModalOpen(true);
            // }}
            selectable={false}
            showEdit={false}
          />

          {/* <ContactForm
              mode="create"
              open={isCreateModalOpen}
              onCancel={() => setIsCreateModalOpen(false)}
              onOk={handleCreate}
            /> */}

          <ContactForm
            mode="edit"
            open={isEditModalOpen}
            onCancel={() => setIsEditModalOpen(false)}
            onOk={handleEdit}
            initialValues={selectedContact}
          />

          <ContactForm
            mode="detail"
            open={isDetailModalOpen}
            onCancel={() => setIsDetailModalOpen(false)}
            initialValues={selectedContact}
          />
        </div>
      ),
    },
    { key: "3", label: "Báo giá", children: <p>Thông tin báo giá…</p> },
    { key: "4", label: "Hợp đồng", children: <p>Danh sách hợp đồng…</p> },
    { key: "5", label: "Tài liệu", children: <p>File tài liệu…</p> },
  ];

  return (
    <Card
      className="customer-detail-card"
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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
