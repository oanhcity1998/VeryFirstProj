import React, { useMemo } from "react";
import { Breadcrumb, Button, Card, Descriptions, Table, Tag, Divider, Form, Select } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./QuotationDetail.css";
import { ROUTES_APP } from "../../../routes";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";

const QuotationDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data
  const quotation = {
    id,
    quotationName: "Báo giá thiết bị văn phòng",
    validityPeriod: "30 ngày",
    paymentTerms: "Thanh toán 50% trước, 50% sau giao hàng",
    status: "Draft" as "Draft" | "Sent" | "Approved" | "Rejected",
    products: [
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
  };

  const statusColors: Record<string, string> = {
    Draft: "default",
    Sent: "blue",
    Approved: "green",
    Rejected: "red",
  };

  const summary = useMemo(() => {
    if (!quotation.products?.length) return null;
    const safeNum = (n?: number) => (typeof n === "number" ? n : 0);
    const totalBeforeVat = quotation.products.reduce((s, p) => s + safeNum(p.priceVND), 0);
    const vat5 = quotation.products
      .filter((p) => p.vat === 5)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);
    const vat10 = quotation.products
      .filter((p) => p.vat === 10)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);
    return { totalBeforeVat, vat5, vat10 };
  }, [quotation.products]);

  return (
    <Card className="quotation-detail-container" bordered={false}>
      {/* Header */}
      <div className="quotation-detail-header">
        <Breadcrumb className="quotation-detail-breadcrumb" separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.quotationList}>Danh sách mẫu báo giá</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{quotation.quotationName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card style={{ margin: "24px 0" }}>
        {/* Thông tin chung */}
        <h3>Thông tin chi tiết mẫu báo giá</h3>
        <Form
          layout="horizontal"
          initialValues={quotation}
          style={{ marginBottom: 24 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
        >
          <Form.Item label="Tên báo giá" name="quotationName">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Hiệu lực" name="validityPeriod">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Điều khoản thanh toán" name="paymentTerms">
            <TextArea readOnly rows={3} />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select disabled>
              {Object.keys(statusColors).map((status) => (
                <Select.Option key={status} value={status}>
                  <Tag color={statusColors[status]}>{status}</Tag>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>

        <Divider />
        {/* Danh sách sản phẩm */}
        <h3>Danh sách sản phẩm</h3>
        <Table
          rowKey="id"
          bordered
          pagination={false}
          dataSource={quotation.products}
          columns={[
            { title: "Tên sản phẩm", dataIndex: "productName", key: "productName" },
            { title: "Loại", dataIndex: "productType", key: "productType" },
            {
              title: "Giá (USD)",
              dataIndex: "priceUSD",
              key: "priceUSD",
              render: (val) => val.toLocaleString(),
            },
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
            {
              title: "Sau VAT (USD)",
              dataIndex: "afterVatUSD",
              key: "afterVatUSD",
              render: (val) => val.toLocaleString(),
            },
          ]}
        />

        {summary && (
          <div style={{ marginTop: 16, textAlign: "right" }}>
            <p>
              <b>Tổng chưa VAT:</b> {summary.totalBeforeVat.toLocaleString()} VND
            </p>
            <p>
              <b>VAT 5%:</b> {summary.vat5.toLocaleString()} VND
            </p>
            <p>
              <b>VAT 10%:</b> {summary.vat10.toLocaleString()} VND
            </p>
          </div>
        )}
      </Card>
    </Card>
  );
};

export default QuotationDetail;
