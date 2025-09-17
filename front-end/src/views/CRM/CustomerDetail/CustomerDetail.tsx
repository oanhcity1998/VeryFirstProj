import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Card, Input, Tabs, Form, Row, Col, Breadcrumb, Select } from "antd";
import TableContact from "@/components/CRM/TableContact/TableContact";
import ContactForm from "@/components/CRM/ContactForm/ContactForm";
import QuoteList from "../QuoteList/QuoteList";
import ContractList from "../ContractList/ContractList";
import "./CustomerDetail.css";
import { ROUTES_APP } from "../../../app/routes";

const { TextArea } = Input;
const { Option } = Select;
const { Search } = Input;

export default function CustomerDetail() {
  const { id } = useParams();
  const [searchText, setSearchText] = useState("");
  const [filterCustomer, setFilterCustomer] = useState(null);
  const [filterMainContact, setFilterMainContact] = useState(null);
  const [customerOptions] = useState(["Công ty ABC", "Công ty XYZ"]);
  const [mainContactOptions] = useState(["Nguyễn Văn A", "Trần Thị B"]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const [data] = useState([
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

  const [customer] = useState({
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

  const breadcrumbItems = [
    { title: <Link to={ROUTES_APP.crm.customerList}>Danh sách khách hàng</Link> },
    { title: "Chi tiết khách hàng" },
    { title: customer.name },
  ];

  const tabs = [
    {
      key: "1",
      label: "Thông tin chung",
      children: (
        <Row gutter={16}>
          <Col span={12}>
            <Card size="small" title="Thông tin khách hàng" className="card-section card-height">
              <Form layout="vertical" disabled>
                <Form.Item label="Tên khách hàng">
                  <Input value={customer.name} />
                </Form.Item>
                <Form.Item label="Tên DN ghi trên hợp đồng">
                  <Input value={customer.contractName} />
                </Form.Item>
                <Form.Item label="Tên DN bằng tiếng Anh">
                  <Input value={customer.englishName} />
                </Form.Item>
                <Form.Item label="Mã số thuế">
                  <Input value={customer.taxCode} />
                </Form.Item>
                <Form.Item label="Số điện thoại">
                  <Input value={customer.phone} />
                </Form.Item>
                <Form.Item label="Email">
                  <Input value={customer.email} />
                </Form.Item>
                <Form.Item label="Số fax">
                  <Input value={customer.fax} />
                </Form.Item>
                <Form.Item label="Địa chỉ">
                  <Input value={customer.address} />
                </Form.Item>
                <Form.Item label="Ngành">
                  <Input value={customer.industry} />
                </Form.Item>
                <Form.Item label="Thị trường chính">
                  <Input value={customer.market} />
                </Form.Item>
              </Form>
            </Card>
          </Col>
          <Col span={12}>
            <Card size="small" title="Thông tin chung" className="card-section card-height">
              <Form layout="vertical" disabled>
                <Form.Item label="Số lượng chi nhánh">
                  <Input value={customer.branches} />
                </Form.Item>
                <Form.Item label="Số nhân sự">
                  <Input value={customer.employees} />
                </Form.Item>
                <Form.Item label="Doanh thu TB/năm">
                  <Input value={customer.revenue} />
                </Form.Item>
                <Form.Item label="Văn bản TB/tháng">
                  <Input value={customer.documentsPerMonth} />
                </Form.Item>
                <Form.Item label="Trạng thái quyết toán thuế">
                  <Select value={customer.taxStatus}>
                    <Option value="Đã quyết toán">Đã quyết toán</Option>
                    <Option value="Chưa quyết toán">Chưa quyết toán</Option>
                    <Option value="Đang xử lý">Đang xử lý</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Năm quyết toán">
                  <Input value="2025" />
                </Form.Item>
                <Form.Item label="Ghi chú">
                  <TextArea rows={3} value={customer.notes} />
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
        <>
          <div className="list-header">
            <h2>Thông tin người liên hệ</h2>
            <div className="header-actions">
              <Search
                placeholder="Tìm kiếm theo tên người liên hệ"
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
                className="search-bar"
              />
              <Select
                allowClear
                placeholder="Lọc theo Khách hàng"
                value={filterCustomer}
                onChange={(val) => setFilterCustomer(val)}
                options={customerOptions.map((c) => ({ label: c, value: c }))}
                className="filter-bar"
              />
              <Select
                allowClear
                placeholder="Lọc theo Liên hệ chính"
                value={filterMainContact}
                onChange={(val) => setFilterMainContact(val)}
                options={mainContactOptions.map((m) => ({ label: m, value: m }))}
                className="filter-bar"
              />
            </div>
          </div>
          <TableContact
            data={data}
            searchText={searchText}
            filterCustomer={filterCustomer}
            filterMainContact={filterMainContact}
            selectable={false}
            showEdit={false}
            onShowClick={(record) => {
              setSelectedContact(record);
              setIsDetailModalOpen(true);
            }}
          />
          <ContactForm
            mode="detail"
            open={isDetailModalOpen}
            onCancel={() => setIsDetailModalOpen(false)}
            initialValues={selectedContact}
          />
        </>
      ),
    },
    { key: "3", label: "Báo giá", children: <QuoteList /> },
    { key: "4", label: "Hợp đồng", children: <ContractList /> },
    { key: "5", label: "Tài liệu", children: <p>File tài liệu…</p> },
  ];

  return (
    <>
      <Breadcrumb style={{ marginBottom: "16px" }} items={breadcrumbItems} separator=">" />
      <Card className="card-section" title={<h2>Chi tiết khách hàng: {customer.name}</h2>}>
        <Tabs type="card" defaultActiveKey="1" items={tabs} />
      </Card>
    </>
  );
}