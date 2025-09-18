import { Product } from "@/views/CRM/QuotationList/QuotationList";
import { Button, Modal, Table, Form, Input, Select, Card } from "antd";
import { useEffect, useMemo, useState } from "react";

export const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "0");

interface QuotationFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
  initialValues?: any;
}

type ProductWithKey = Product & { __rowKey: string };

const productOptions: Product[] = [
  {
    id: 1,
    productName: "Máy in HP 107w",
    productType: "Thiết bị văn phòng",
    priceVND: 5000000,
    priceUSD: 200,
    vat: 10,
    afterVatVND: 5500000,
    afterVatUSD: 220,
  },
  {
    id: 2,
    productName: "Giấy A4 Double A",
    productType: "Vật tư tiêu hao",
    priceVND: 250000,
    priceUSD: 10,
    vat: 5,
    afterVatVND: 262500,
    afterVatUSD: 10.5,
  },
];

export const QuotationForm = ({
  mode,
  open,
  onCancel,
  onOk,
  initialValues,
}: QuotationFormProps) => {
  const [form] = Form.useForm();
  const isDetail = mode === "detail";

  // ---- State cho rows
  const [rows, setRows] = useState<ProductWithKey[]>([]);

  // reset rows khi mở modal
  useEffect(() => {
    if (open) {
      // set rows
      if (initialValues?.products) {
        setRows(
          initialValues.products.map((p: Product) => ({
            ...p,
            __rowKey: String(p.id ?? Date.now()),
          }))
        );
      } else {
        setRows([]);
      }

      // set form values
      form.setFieldsValue({
        quotationName: initialValues?.quotationName,
        validityPeriod: initialValues?.validityPeriod,
        paymentTerms: initialValues?.paymentTerms,
        status: initialValues?.status ?? "Draft",
      });
    }
  }, [open, initialValues, form]);

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: -Date.now(),
        productName: "",
        productType: "",
        priceVND: 0,
        priceUSD: 0,
        vat: 0,
        afterVatVND: 0,
        afterVatUSD: 0,
        __rowKey: `tmp_${Date.now()}`,
      },
    ]);
  };

  const handleDeleteRow = (rowKey: string) => {
    setRows((prev) => prev.filter((row) => row.__rowKey !== rowKey));
  };

  const handleSelectProduct = (rowKey: string, id: number) => {
    const selected = productOptions.find((p) => p.id === id);
    if (!selected) return;
    setRows((prev) =>
      prev.map((row) => (row.__rowKey === rowKey ? { ...selected, __rowKey: rowKey } : row))
    );
  };

  const handleOk = () => {
    if (isDetail) {
      onCancel();
      return;
    }

    form.validateFields().then((values) => {
      onOk?.({ ...values, products: rows });
      if (mode === "create") form.resetFields();
    });
  };

  const productColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      render: (_: any, record: ProductWithKey) => (
        <Select
          placeholder="Chọn sản phẩm"
          className="full-width"
          value={record.id > 0 ? record.id : undefined}
          onChange={(value) => handleSelectProduct(record.__rowKey, value)}
          disabled={isDetail}
        >
          {productOptions.map((p) => (
            <Select.Option key={p.id} value={p.id}>
              {p.productName}
            </Select.Option>
          ))}
        </Select>
      ),
    },
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
      title: "Giá sau VAT (VND)",
      dataIndex: "afterVatVND",
      render: (value: number) => fmt(value),
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "afterVatUSD",
      render: (value: number) => fmt(value),
    },
    // 👉 Cột mới thêm
    {
      title: "Thao tác",
      dataIndex: "action",
      render: (_: any, record: ProductWithKey) =>
        !isDetail && (
          <Button danger size="small" onClick={() => handleDeleteRow(record.__rowKey)}>
            Xoá
          </Button>
        ),
    },
  ];

  const summary = useMemo(() => {
    if (!rows.length) return null;
    const safeNum = (n?: number) => (typeof n === "number" ? n : 0);
    const totalBeforeVat = rows.reduce((s, p) => s + safeNum(p.priceVND), 0);
    const vat5 = rows
      .filter((p) => p.vat === 5)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);
    const vat10 = rows
      .filter((p) => p.vat === 10)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);
    return { totalBeforeVat, vat5, vat10 };
  }, [rows]);

  return (
    <Modal
      title={
        <h2>
          {mode === "create" ? "Tạo" : mode === "edit" ? "Chỉnh sửa" : "Chi tiết"} mẫu báo giá
        </h2>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel}>
          {isDetail ? "Đóng" : "Huỷ"}
        </Button>,
        !isDetail && (
          <Button key="submit" type="primary" onClick={handleOk}>
            {mode === "create" ? "Xác nhận" : "Lưu thay đổi"}
          </Button>
        ),
      ]}
      className="width-1100"
    >
      <Form form={form} layout="horizontal" disabled={isDetail}>
        <Card title="Thông tin mẫu báo giá" className="card-section header-row">
          <Form.Item
            label="Tên mẫu báo giá"
            name="quotationName"
            rules={[{ required: !isDetail, message: "Vui lòng nhập tên mẫu báo giá" }]}
          >
            <Input placeholder="Nhập tên mẫu báo giá" />
          </Form.Item>
          <Form.Item
            label="Thời hạn hiệu lực"
            name="validityPeriod"
            rules={[{ required: !isDetail, message: "Vui lòng nhập thời hạn hiệu lực" }]}
          >
            <Input placeholder="Nhập thời gian hiệu lực" />
          </Form.Item>
          <Form.Item
            label="Điều khoản thanh toán"
            name="paymentTerms"
            rules={[{ required: !isDetail, message: "Vui lòng nhập điều khoản thanh toán" }]}
          >
            <Input placeholder="Nhập điều khoản thanh toán" />
          </Form.Item>
          <Form.Item label="Trạng thái" name="status" rules={[{ required: !isDetail }]}>
            <Select disabled={isDetail} placeholder="Chọn trạng thái">
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Declined">Declined</Select.Option>
            </Select>
          </Form.Item>
        </Card>

        <Card className="card-section">
          <div className="header-container">
            <h3 className="card-title">Danh sách sản phẩm</h3>
            {!isDetail && (
              <Button type="primary" onClick={addRow}>
                + Thêm sản phẩm
              </Button>
            )}
          </div>

          <Table
            columns={productColumns}
            dataSource={rows}
            rowKey="__rowKey"
            pagination={false}
            bordered
          />

          {summary && (
            <div className="summary-box">
              <p>
                <b>Tổng chưa VAT:</b> {fmt(summary.totalBeforeVat)} VND
              </p>
              <p>
                <b>VAT 5%:</b> {fmt(summary.vat5)} VND
              </p>
              <p>
                <b>VAT 10%:</b> {fmt(summary.vat10)} VND
              </p>
            </div>
          )}
        </Card>
      </Form>
    </Modal>
  );
};
