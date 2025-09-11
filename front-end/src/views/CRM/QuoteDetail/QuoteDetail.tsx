import React, { useState } from "react";
import { useParams } from "react-router-dom"
import { Input, Table, Button, Row, Col, Modal, Breadcrumb, Card, Typography, Space } from "antd";
import { Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./QuoteDetail.css";
import { ROUTES_APP } from "../../../app/routes";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";



const { Title } = Typography;


interface ContractDetailProps {
  role?: "Nhân viên" | "Giám đốc";
  loai: "baogia" | "hopdong";
  onBack: () => void;
}

const QuoteDetail: React.FC<ContractDetailProps> = ({ role = "Nhân viên", loai, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);


    const { id } = useParams(); // lấy contact id từ URL
  const title = loai === "baogia" ? "Chi tiết báo giá" : "Chi tiết hợp đồng";

  const products = [
    { key: 1, name: "Dịch vụ kế toán", type: "Tháng", priceVND: 5000000, priceUSD: 400, vat: 10 },
    { key: 2, name: "Ghi chép sổ sách", type: "Gói", priceVND: 3000000, priceUSD: 200, vat: 10 },
  ];

  const columns = [
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Loại sản phẩm", dataIndex: "type", key: "type" },
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

  // Generate + download PDF immediately
  const handleGeneratePDF = async () => {
    const response = await fetch("/05+BAOGIA+-+XIDONG+(1)-ocr.pdf");
    const existingPdfBytes = await response.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    pdfDoc.registerFontkit(fontkit);

    // Load font
    const fontBytes = await fetch("/fonts/Roboto/static/Roboto-MediumItalic.ttf").then(res =>
      res.arrayBuffer()
    );
    const customFont = await pdfDoc.embedFont(fontBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { height } = firstPage.getSize();

    // Cover + replace text
    firstPage.drawRectangle({
      x: 115,
      y: 675-3,
      width: 400,
      height: 20,
      color: rgb(246 / 255, 250 / 255, 253 / 255), // #f6fafd
    });

    firstPage.drawText(`${tenBaoGia}`, {
      x: 118,
      y: 676,
      size: 11,
      font: customFont,
      color: rgb(76 / 255, 88 / 255, 92 / 255), // #4c585c
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    // Save for preview
    setPdfUrl(url);
    setPreviewOpen(true);
    setIsModalOpen(false);
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "quotation.pdf";
    link.click();
  };



  return (
    <div className="quote-detail">
      {/* Header */}
      <div className="quote-detail-header">
        <Button icon={<ArrowLeftOutlined />} type="text" onClick={onBack} className="back-button" />
        <Breadcrumb className="quote-detail-title" separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.contractList}>Danh sách hợp đồng & cơ hội</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Card wrapper */}
      <Card title={title} style={{ marginTop: 16 }}>
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
      <Card title="Danh sách sản phẩm" style={{ marginTop: 16 }}>
        <Table dataSource={products} columns={columns} pagination={false} bordered />
        <div className="totals" style={{ marginTop: 16 }}>
          <p>Tổng giá trước VAT (VND): {totalVND.toLocaleString("vi-VN")}</p>
          <p>Tổng giá trước VAT (USD): {totalUSD}</p>
          <p>Tổng giá sau VAT (VND): {totalVNDWithVAT.toLocaleString("vi-VN")}</p>
          <p>Tổng giá sau VAT (USD): {totalUSDWithVAT}</p>
        </div>
      </Card>

      {/* Actions */}
      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", flexWrap: "wrap", gap:12, position:"sticky",  }}>
        <Space wrap>
          <Button>Xem báo giá</Button>
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
        onOk={handleGeneratePDF}
        onCancel={() => setIsModalOpen(false)}
      />

      {/* Preview modal */}
      <Modal
        open={previewOpen}
        title="Xem trước PDF"
        onCancel={() => setPreviewOpen(false)}
        footer={[
          <Button key="back" onClick={() => setPreviewOpen(false)}>
            Đóng
          </Button>,
          <Button key="download" type="primary" onClick={handleDownload}>
            Tải xuống
          </Button>,
        ]}
        width="80%"
        style={{ top: 20 }}
      >
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            title="PDF Preview"
            width="100%"
            height="600px"
            style={{ border: "none" }}
          />
        )}
      </Modal>
    </div>
  );
};

// Small helper component for read-only fields
const FormItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={{ display: "block", fontWeight: 500 }}>{label}</label>
    <Input value={value} disabled />
  </div>
);

export default QuoteDetail;
