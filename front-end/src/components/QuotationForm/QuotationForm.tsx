import { Button, Modal, Table, Form, Input, Breadcrumb, Select } from "antd";
import { useEffect, useMemo } from "react";
import { Product } from "../../views/CRM/QuotationList/QuotationList";
export const fmt = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "0");

interface QuotationFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
  initialValues?: any;
}

type ProductWithKey = Product & { __rowKey?: string };

export const QuotationForm = ({
  mode,
  open,
  onCancel,
  onOk,
  initialValues,
}: QuotationFormProps) => {
  const [form] = Form.useForm();
  const isDetail = mode === "detail";

  // ---- helpers

  // hash đơn giản để tạo khoá ổn định khi không có id
  const hash = (s: string) => {
    let h = 0;
    for (let i = 0; i < s.length; i++) {
      h = (h << 5) - h + s.charCodeAt(i);
      h |= 0;
    }
    return `k_${Math.abs(h)}`;
  };

  // Tạo signature ổn định từ thuộc tính sản phẩm (tránh dùng index)
  const signature = (p: Product) =>
    [
      // ưu tiên các trường có tính duy nhất nếu có
      (p as any).productId,
      (p as any).id,
      p.productName,
      p.productType,
      p.priceVND,
      p.priceUSD,
      p.vat,
    ]
      .filter((v) => v !== undefined && v !== null)
      .join("|");

  // Gắn __rowKey ổn định cho từng product (ưu tiên id/productId, fallback = hash)
  const productsWithKey: ProductWithKey[] = useMemo(() => {
    const products: Product[] = initialValues?.products ?? [];
    return products.map((p) => {
      const stableId =
        (p as any).id ?? (p as any).productId ?? (p as any).key ?? hash(signature(p));
      return { ...p, __rowKey: String(stableId) };
    });
    // chỉ phụ thuộc vào danh sách sản phẩm được truyền vào
  }, [initialValues?.products]);

  // Set hoặc reset form khi mở modal
  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  const handleOk = () => {
    if (isDetail) {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      onOk?.(values);
      if (mode === "create") form.resetFields();
    });
  };

  const breadcrumbItems = [
    { title: "Danh sách mẫu báo giá" },
    {
      title:
        mode === "create"
          ? "Tạo mới mẫu báo giá"
          : mode === "edit"
          ? "Chỉnh sửa mẫu báo giá"
          : "Chi tiết mẫu báo giá",
    },
    { title: initialValues?.quotationName ?? "Tạo thêm" },
  ];

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
      title: "Giá sau VAT (VND)",
      dataIndex: "afterVatVND",
      render: (value: number) => fmt(value),
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "afterVatUSD",
      render: (value: number) => fmt(value),
    },
  ];

  const summary = useMemo(() => {
    const list: Product[] = initialValues?.products ?? [];
    if (!list.length) return null;

    const safeNum = (n?: number) => (typeof n === "number" ? n : 0);

    const totalBeforeVat = list.reduce((s, p) => s + safeNum(p.priceVND), 0);
    const vat5 = list
      .filter((p) => p.vat === 5)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);
    const vat10 = list
      .filter((p) => p.vat === 10)
      .reduce((s, p) => s + (safeNum(p.afterVatVND) - safeNum(p.priceVND)), 0);

    return { totalBeforeVat, vat5, vat10 };
  }, [initialValues?.products]);

  return (
    <Modal
      title={<Breadcrumb items={breadcrumbItems} separator=">" />}
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
      width={1000}
    >
      <Form
        form={form}
        layout="horizontal"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 18 }}
        disabled={isDetail}
      >
        <div className="form-section">
          <h3>Thông tin mẫu báo giá</h3>

          <Form.Item
            label="Tên mẫu báo giá"
            name="quotationName"
            rules={[{ required: !isDetail, message: "Vui lòng nhập tên mẫu báo giá" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Thời hạn hiệu lực"
            name="validityPeriod"
            rules={[{ required: !isDetail, message: "Vui lòng nhập thời hạn hiệu lực" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Điều khoản thanh toán"
            name="paymentTerms"
            rules={[{ required: !isDetail, message: "Vui lòng nhập điều khoản thanh toán" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Trạng thái"
            name="status"
            initialValue={initialValues?.status ?? "Draft"}
            rules={[{ required: !isDetail }]}
          >
            <Select disabled={isDetail}>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Declined">Declined</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Cơ hội"
            name="opportunity"
            rules={[{ required: !isDetail, message: "Vui lòng nhập cơ hội" }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3>Danh sách sản phẩm</h3>
          <Table
            columns={productColumns}
            dataSource={productsWithKey}
            rowKey="__rowKey" // ✅ KHÔNG dùng function => tránh deprecated `index`
            pagination={false}
            bordered
          />

          {summary && (
            <div style={{ marginTop: 16, marginRight: "25%", textAlign: "right" }}>
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
        </div>
      </Form>
    </Modal>
  );
};
