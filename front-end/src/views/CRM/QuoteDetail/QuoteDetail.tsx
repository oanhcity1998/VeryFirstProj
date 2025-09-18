import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Input, Table, Button, Row, Col, Modal, Breadcrumb, Card, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

import ReactDOM from "react-dom/client";
import QuotePDF from "@/components/CRM/QuotePDF/QuotePDF";
import { ROUTES_APP } from "../../../app/routes";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";

const { Title } = Typography;

interface ContractDetailProps {
  role: "Nhân viên" | "Giám đốc";
  loai: "baogia" | "hopdong";
  onBack: () => void;
}

const QuoteDetail: React.FC<ContractDetailProps> = ({ role = "Nhân viên", loai, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { id } = useParams(); // lấy contact id từ URL
  const title = "Chi tiết báo giá";

  const products = [
    { key: 1, name: "Dịch vụ kế toán", type: "Tháng", priceVND: 5000000, priceUSD: 400, vat: 10 },
    { key: 2, name: "Ghi chép sổ sách", type: "Gói", priceVND: 3000000, priceUSD: 200, vat: 10 },
  ];

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      render: (val: number) => val.toLocaleString("vi-VN"),
    },
    { title: "Giá (USD)", dataIndex: "priceUSD", key: "priceUSD" },
    { title: "VAT", dataIndex: "vat", key: "vat", render: (val: number) => `${val}%` },
    {
      title: "Giá sau VAT (VND)",
      key: "afterVATVND",
      render: (_: any, record: any) =>
        ((record.priceVND * (100 + record.vat)) / 100).toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      key: "afterVATUSD",
      render: (_: any, record: any) =>
        ((record.priceUSD * (100 + record.vat)) / 100).toLocaleString("en-US"),
    },
  ];

  // Totals
  const totalVND = products.reduce((sum, p) => sum + p.priceVND, 0);
  const totalUSD = products.reduce((sum, p) => sum + p.priceUSD, 0);
  const totalVNDWithVAT = products.reduce((sum, p) => sum + (p.priceVND * (100 + p.vat)) / 100, 0);
  const totalUSDWithVAT = products.reduce((sum, p) => sum + (p.priceUSD * (100 + p.vat)) / 100, 0);

  const tenBaoGia = "Piggy hotel";

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "quotation.pdf";
    link.click();
  };

  return (
    <div>
      {/* Header */}
      <div>
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack} className="back-button" />
        <Breadcrumb separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.quoteList}>Danh sách báo giá</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title} Piggy hotel </Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Card wrapper */}
      <Card title={title} className="margin-top-16">
        <Row gutter={24} className="form-grid">
          <Col span={12}>
            <FormItem label="Mã báo giá" value="AF25_BG1" />
          </Col>
          <Col span={12}>
            <FormItem label="Tên báo giá" value="Báo giá piggy hotel" />
          </Col>
          <Col span={12}>
            <FormItem label="Mẫu báo giá" value="Mẫu báo giá 1" />
          </Col>
          <Col span={12}>
            <FormItem label="Ngày tạo" value="20/02/2025" />
          </Col>
          <Col span={12}>
            <FormItem label="Điều khoản thanh toán" value="Trả trước 50%" />
          </Col>
          <Col span={12}>
            <FormItem label="Thời hạn hiệu lực" value="30 ngày" />
          </Col>
          <Col span={12}>
            <FormItem label="Nhân viên phụ trách" value="Văn A" />
          </Col>
          <Col span={12}>
            <FormItem label="Người duyệt" value="Trần B" />
          </Col>
          <Col span={12}>
            <FormItem label="Trạng thái" value="Chờ duyệt" />
          </Col>
          <Col span={12}>
            <FormItem label="Ngày duyệt" value="" />
          </Col>
        </Row>
      </Card>

      {/* Products card */}
      <Card title="Danh sách sản phẩm" className="margin-top-16">
        <Table dataSource={products} columns={columns} pagination={false} bordered />
        <div className="totals" className="margin-top-16">
          <p>Tổng giá trước VAT (VND): {totalVND.toLocaleString("vi-VN")}</p>
          <p>Tổng giá trước VAT (USD): {totalUSD}</p>
          <p>Tổng giá sau VAT (VND): {totalVNDWithVAT.toLocaleString("vi-VN")}</p>
          <p>Tổng giá sau VAT (USD): {totalUSDWithVAT}</p>
        </div>
      </Card>

      {/* Actions */}
      <div className="form-actions">
        <Space wrap>
          <Button onClick={() => setShowModal(true)}>Xem báo giá</Button>
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            {role === "Giám đốc" ? "Duyệt" : "Gửi"}
          </Button>
        </Space>
      </div>

      {/* Modal popup */}
      <Modal
        open={isModalOpen}
        title="Bạn có muốn gửi hợp đồng này?"
        okText="Gửi"
        cancelText="Huỷ"
        // onOk={}
        onCancel={() => setIsModalOpen(false)}
      />

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* Close button */}
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✕
            </button>

            {/* Quotation preview with download inside modal */}
            <QuotePDF
              companyName="Công Ty TNHH Lắp Đặt Thiết Bị Điện Cơ Xi Đông Việt Nam"
              auditYear={2024}
              serviceFee={10900000}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// Small helper component for read-only fields
const FormItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="margin-bottom-16">
    <label>{label}</label>
    <Input value={value} disabled />
  </div>
);

export default QuoteDetail;
