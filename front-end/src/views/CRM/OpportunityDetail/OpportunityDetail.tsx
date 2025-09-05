import { useParams, useNavigate, Link } from "react-router-dom";
import { Tabs, Table, Segmented, Breadcrumb, Space, Button, Timeline, Modal, message } from "antd";
import { useState } from "react";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "../../../routes";
import "./OpportunityDetail.css";
import { fmt } from "../../../components/QuotationForm/QuotationForm";

// Fake data
const fakeData = [
  {
    id: 1,
    name: "Triển khai ERP cho công ty ABC",
    company: "Công ty ABC",
    expectedValue: 500000000,
    expectedCloseDate: "2025-09-15",
    service: [
      {
        id: 1,
        productName: "Máy in HP 107w",
        productType: "Thiết bị văn phòng",
        priceVND: 5000000,
        priceUSD: 210,
        vat: 10,
        afterVatVND: 5500000,
        afterVatUSD: 231,
      },
      {
        id: 2,
        productName: "Giấy A4 Double A",
        productType: "Vật tư tiêu hao",
        priceVND: 250000,
        priceUSD: 11,
        vat: 5,
        afterVatVND: 262500,
        afterVatUSD: 11.55,
      },
    ],
    contact: {
      key: "1",
      id: "1",
      contactName: "Nguyễn Văn A",
      customerName: "Công ty TNHH ABC",
      phone: "0901234567",
      email: "vana@abc.com",
      title: "Giám đốc",
      mainContact: "Nguyễn Văn A",
      note: "Khách hàng lâu năm",
    },
    probability: 70,
    priority: "Cao",
    owner: "Phạm Văn Quyết",
    stage: "Đàm phán",
  },
];

const stages = ["Mới", "Đạt yêu cầu", "Đàm phán", "Đóng"] as const;
type StageType = (typeof stages)[number];

const OpportunityDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [losing, setLosing] = useState(false);
  const [isLoseModalOpen, setIsLoseModalOpen] = useState(false);

  const opportunity = fakeData.find((o) => o.id === Number(id));
  const [stage, setStage] = useState<StageType>((opportunity?.stage as StageType) || "Mới");

  if (!opportunity) return <p>Không tìm thấy cơ hội</p>;

  const productColumns = [
    { title: "Sản phẩm", dataIndex: "productName" },
    { title: "Loại sản phẩm", dataIndex: "productType" },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      render: (value: number) => fmt(value),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      render: (value: number) => fmt(value),
    },
    { title: "VAT (%)", dataIndex: "vat" },
    {
      title: <p style={{ fontWeight: "bold" }}>Giá sau VAT (VND)</p>,
      dataIndex: "afterVatVND",
      render: (value: number) => fmt(value),
    },
    {
      title: <p style={{ fontWeight: "bold" }}>Giá sau VAT (USD)</p>,
      dataIndex: "afterVatUSD",
      render: (value: number) => fmt(value),
    },
  ];

  const handelLose = async () => {
    try {
      setLosing(true);
      // message.success("Đã xóa cơ hội");
      navigate(ROUTES_APP.crm.opportunityList);
    } catch (err) {
      // message.error("Không thể xóa cơ hội");
    } finally {
      setLosing(false);
      setIsLoseModalOpen(false);
    }
  };

  return (
    <div className="opportunity-detail-container">
      {/* Header */}
      <div className="opportunity-detail-header">
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.opportunityList}>Danh sách cơ hội</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{opportunity.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Stage + buttons */}
      <div className="opportunity-detail-stage">
        <Space>
          <Button type="primary" onClick={() => setIsLoseModalOpen(true)} danger>
            Mất
          </Button>
          <Button type="primary" style={{ backgroundColor: "#60A917", borderColor: "#60A917" }}>
            Đạt
          </Button>

          <Modal
            open={isLoseModalOpen}
            title="Xác nhận Xóa"
            onOk={handelLose}
            onCancel={() => setIsLoseModalOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true, loading: losing }}
            centered
          >
            <p>Bạn có muốn xoá thông tin cơ hội này?</p>
          </Modal>
        </Space>

        <Segmented
          value={stage}
          onChange={(val) => setStage(val as StageType)}
          options={stages.map((s) => ({ label: s, value: s, disabled: s === "Đóng" }))}
          size="middle"
          style={{
            background: "#fff",
            border: "1px solid #d9d9d9",
            borderRadius: 8,
          }}
        />
      </div>

      {/* Tabs */}
      <Tabs
        defaultActiveKey="general"
        items={[
          {
            key: "general",
            label: "Thông tin chung",
            children: (
              <div className="detail-form">
                <div className="form-row">
                  <label>Tên cơ hội:</label>
                  <input value={opportunity.name} disabled />
                </div>
                <div className="form-row">
                  <label>Giá trị dự kiến:</label>
                  <input value={opportunity.expectedValue.toLocaleString() + " VND"} disabled />
                </div>
                <div className="form-row">
                  <label>Ngày chốt dự kiến:</label>
                  <input value={opportunity.expectedCloseDate} disabled />
                </div>
                <div className="form-row">
                  <label>Xác suất:</label>
                  <input value={`${opportunity.probability}%`} disabled />
                </div>
                <div className="form-row">
                  <label>Ưu tiên:</label>
                  <input value={opportunity.priority} disabled />
                </div>
                <div className="form-row">
                  <label>Giai đoạn:</label>
                  <input value={opportunity.stage} disabled />
                </div>
                <div className="form-row">
                  <label>Người phụ trách:</label>
                  <input value={opportunity.owner} disabled />
                </div>
              </div>
            ),
          },
          {
            key: "contact",
            label: "Liên hệ",
            children: (
              <div className="detail-form">
                <div className="form-row">
                  <label>Tên liên hệ:</label>
                  <input value={opportunity.contact.contactName} disabled />
                </div>
                <div className="form-row">
                  <label>Chức vụ:</label>
                  <input value={opportunity.contact.title} disabled />
                </div>
                <div className="form-row">
                  <label>Công ty:</label>
                  <input value={opportunity.contact.customerName} disabled />
                </div>
                <div className="form-row">
                  <label>Email:</label>
                  <input value={opportunity.contact.email} disabled />
                </div>
                <div className="form-row">
                  <label>Điện thoại:</label>
                  <input value={opportunity.contact.phone} disabled />
                </div>
                <div className="form-row">
                  <label>Người liên hệ chính:</label>
                  <input value={opportunity.contact.mainContact} disabled />
                </div>
                <div className="form-row last-row">
                  <label>Ghi chú:</label>
                  <input value={opportunity.contact.note} disabled />
                </div>
              </div>
            ),
          },
          {
            key: "products",
            label: "Sản phẩm dự kiến",
            children: (
              <Table
                columns={productColumns}
                dataSource={opportunity.service}
                rowKey="id"
                pagination={false}
                bordered
              />
            ),
          },
          {
            key: "activities",
            label: "Hoạt động",
            children: (
              <Timeline>
                <Timeline.Item color="blue">01/09: Gọi điện cho khách hàng</Timeline.Item>
                <Timeline.Item color="green">02/09: Gửi proposal</Timeline.Item>
                <Timeline.Item color="red">05/09: Khách yêu cầu demo</Timeline.Item>
              </Timeline>
            ),
          },
        ]}
      />
    </div>
  );
};

export default OpportunityDetail;
