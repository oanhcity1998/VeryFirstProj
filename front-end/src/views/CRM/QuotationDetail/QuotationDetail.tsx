import React from "react";
import { Breadcrumb, Button, Card, Descriptions, Table, Tag, Divider } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./QuotationDetail.css";
import { ROUTES_APP } from "../../../routes";

const QuotationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const quotation = {
    id,
    quotationName: "Báo giá thiết bị văn phòng",
    validityPeriod: "30 ngày",
    paymentTerms: "Thanh toán 50% trước, 50% sau giao hàng",
    opportunity: "Dự án văn phòng A",
    status: "Draft" as "Draft" | "Sent" | "Approved" | "Rejected",
    products: [
      {
        id: 1,
        productName: "Máy in HP 107w",
        productType: "Thiết bị văn phòng",
        priceVND: 5000000,
        vat: 10,
        afterVatVND: 5500000,
      },
      {
        id: 2,
        productName: "Giấy A4 Double A",
        productType: "Vật tư tiêu hao",
        priceVND: 250000,
        vat: 5,
        afterVatVND: 262500,
      },
    ],
  };

  const statusColors: Record<string, string> = {
    Draft: "default",
    Sent: "blue",
    Approved: "green",
    Rejected: "red",
  };

  return (
    <Card className="quotation-detail-container" bordered={false}>
      {/* Header */}
      <div className="quotation-detail-header">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => navigate(-1)}
          className="back-button"
        />
        <Breadcrumb className="quotation-detail-breadcrumb" separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.quotationList}>Danh sách báo giá</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{quotation.quotationName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Thông tin chung */}
      <h3>Thông tin báo giá</h3>
      <Descriptions column={2} bordered size="middle" style={{ marginBottom: 24 }}>
        <Descriptions.Item label="Tên báo giá">{quotation.quotationName}</Descriptions.Item>
        <Descriptions.Item label="Hiệu lực">{quotation.validityPeriod}</Descriptions.Item>
        <Descriptions.Item label="Điều khoản thanh toán" span={2}>
          {quotation.paymentTerms}
        </Descriptions.Item>
        <Descriptions.Item label="Cơ hội">{quotation.opportunity}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={statusColors[quotation.status]}>{quotation.status}</Tag>
        </Descriptions.Item>
      </Descriptions>

      <Divider />

      {/* Danh sách sản phẩm */}
      <h3>Danh sách sản phẩm</h3>
      <Table
        rowKey="id"
        pagination={false}
        dataSource={quotation.products}
        columns={[
          { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
          { title: "Loại", dataIndex: "productType", key: "productType" },
          {
            title: "Giá (VND)",
            dataIndex: "priceVND",
            key: "priceVND",
            render: (val) => val.toLocaleString(),
          },
          { title: "VAT (%)", dataIndex: "vat", key: "vat" },
          {
            title: "Sau VAT (VND)",
            dataIndex: "afterVatVND",
            key: "afterVatVND",
            render: (val) => val.toLocaleString(),
          },
        ]}
        summary={(pageData) => {
          let total = 0;
          pageData.forEach((p) => {
            total += p.afterVatVND;
          });
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={4}>
                <b>Tổng cộng</b>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={4}>
                <b>{total.toLocaleString()} VND</b>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </Card>
  );
};

export default QuotationDetail;
