import React, { useState } from "react";
import { Input, Table, Button, Row, Col, Modal } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./ContractDetail.css";

interface ContractDetailProps {
  role?: "Nhân viên" | "Giám đốc";
  loai: "baogia" | "hopdong";
  onBack: () => void;
}


const ContractDetail: React.FC<ContractDetailProps> = ({ role = "Nhân viên", loai, onBack }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const title =
    loai === "baogia" ? "Chi tiết báo giá" : "Chi tiết hợp đồng";

console.log("ContractDetail received loai:", loai);


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

  const handleOk = () => {
    console.log(`${role} đã ${role === "Giám đốc" ? "duyệt" : "gửi"} hợp đồng`);
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="contract-detail">
      <div className="contract-detail-header">
        <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={onBack}
            className="back-button"
        />
        <h2 className="contract-detail-title">{title}</h2>
    </div>


      {/* 2-column form */}
      <Row gutter={24} className="form-grid">
        <Col span={12} className="form-item">
          <label>Mã báo giá</label>
          <Input value="AF25_BG1" disabled />
        </Col>
        <Col span={12} className="form-item">
          <label>Tên báo giá</label>
          <Input value="Báo giá piggy hotel" disabled />
        </Col>

        <Col span={12} className="form-item">
          <label>Mẫu báo giá</label>
          <Input value="Mẫu báo giá 1" disabled />
        </Col>
        <Col span={12} className="form-item">
          <label>Ngày tạo</label>
          <Input value="20/02/2025" disabled />
        </Col>

        <Col span={12} className="form-item">
          <label>Điều khoản thanh toán</label>
          <Input value="Trả trước 50%" disabled />
        </Col>
        <Col span={12} className="form-item">
          <label>Thời hạn hiệu lực</label>
          <Input value="30 ngày" disabled />
        </Col>

        <Col span={12} className="form-item">
          <label>Nhân viên phụ trách</label>
          <Input value="Văn A" disabled />
        </Col>
        <Col span={12} className="form-item">
          <label>Người duyệt</label>
          <Input value="Trần B" disabled />
        </Col>

        <Col span={12} className="form-item">
          <label>Trạng thái</label>
          <Input value="Chờ duyệt" disabled />
        </Col>
        <Col span={12} className="form-item">
          <label>Ngày duyệt</label>
          <Input value="" disabled />
        </Col>
      </Row>

      <h3>Danh sách sản phẩm</h3>
      <Table
        dataSource={products}
        columns={columns}
        pagination={false}
        bordered
        className="product-table"
      />

      {/* Totals block */}
      <div className="totals">
        <p>Tổng giá trước VAT (VND): {totalVND.toLocaleString("vi-VN")}</p>
        <p>Tổng giá trước VAT (USD): {totalUSD}</p>
        <p>Tổng giá sau VAT (VND): {totalVNDWithVAT.toLocaleString("vi-VN")}</p>
        <p>Tổng giá sau VAT (USD): {totalUSDWithVAT}</p>
      </div>

      <div className="actions">
        <Button>Xem báo giá</Button>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          {role === "Giám đốc" ? "Duyệt" : "Gửi"}
        </Button>
      </div>

      {/* Modal popup */}
      <Modal
        open={isModalOpen}
        title={role === "Giám đốc" ? "Bạn có muốn duyệt hợp đồng này?" : "Bạn có muốn gửi hợp đồng này?"}
        okText={role === "Giám đốc" ? "Duyệt" : "Gửi"}
        cancelText="Huỷ"
        onOk={handleOk}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default ContractDetail;
