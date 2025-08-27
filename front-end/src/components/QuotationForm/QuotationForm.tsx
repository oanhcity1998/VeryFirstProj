import { Button, Modal, Table, Form, Input, Breadcrumb, Select } from "antd";
import { useEffect } from "react";
import { Product } from "../../views/CRM/QuotationList/QuotationList";

interface QuotationFormProps {
  mode: "create" | "edit" | "detail";
  open: boolean;
  onCancel: () => void;
  onOk?: (values: any) => void;
  initialValues?: any;
}

export const QuotationForm = ({
  mode,
  open,
  onCancel,
  onOk,
  initialValues,
}: QuotationFormProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (open && mode === "create") {
      form.resetFields();
    }
  }, [open, initialValues, form, mode]);

  const handleOk = () => {
    if (mode === "detail") {
      onCancel();
      return;
    }
    form.validateFields().then((values) => {
      onOk?.(values);
      form.resetFields();
    });
  };

  const isDetail = mode === "detail";

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
    {
      title: "Sản phẩm",
      dataIndex: "productName",
      // render: () => <Input disabled={isDetail} />
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productType",
      // render: () => <Input disabled={isDetail} />,
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      // render: () => <InputNumber disabled={isDetail} style={{ width: "100%" }} />,
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      // render: () => <InputNumber disabled={isDetail} style={{ width: "100%" }} />,
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      // render: () => <InputNumber disabled={isDetail} style={{ width: "100%" }} />,
    },
    {
      title: "Giá sau VAT (VND)",
      dataIndex: "afterVatVND",
      // render: () => <InputNumber disabled={isDetail} style={{ width: "100%" }} />,
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "afterVatUSD",
      // render: () => <InputNumber disabled={isDetail} style={{ width: "100%" }} />,
    },
  ];
  const getSummary = (products: Product[]) => {
    const totalBeforeVat = products.reduce((s, p) => s + p.priceVND, 0);
    const vat5 = products
      .filter((p) => p.vat === 5)
      .reduce((s, p) => s + (p.afterVatVND - p.priceVND), 0);
    const vat10 = products
      .filter((p) => p.vat === 10)
      .reduce((s, p) => s + (p.afterVatVND - p.priceVND), 0);
    return { totalBeforeVat, vat5, vat10 };
  };
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
            style={{ fontWeight: "bold" }}
            label="Tên mẫu báo giá"
            name="quotationName"
            rules={[{ required: !isDetail }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Thời hạn hiệu lực"
            name="validityPeriod"
            rules={[{ required: !isDetail }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Điều khoản thanh toán"
            name="paymentTerms"
            rules={[{ required: !isDetail }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Trạng thái"
            name="status"
            initialValue={initialValues?.status ?? "Draft"}
            rules={[{ required: !isDetail }]}
          >
            <Select disabled={isDetail || !initialValues?.status}>
              <Select.Option value="Draft">Draft</Select.Option>
              <Select.Option value="Sent">Sent</Select.Option>
              <Select.Option value="Accepted">Accepted</Select.Option>
              <Select.Option value="Declined">Declined</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            style={{ fontWeight: "bold" }}
            label="Cơ hội"
            name="opportunity"
            rules={[{ required: !isDetail }]}
          >
            <Input />
          </Form.Item>
        </div>

        <div className="form-section">
          <h3>Danh sách sản phẩm</h3>
          <Table
            columns={productColumns}
            dataSource={initialValues?.products ?? []}
            pagination={false}
            bordered
          />

          {/* Trong QuotationForm phần cuối */}
          <div style={{ marginTop: 16, marginRight: "25%", textAlign: "right" }}>
            {initialValues?.products && (
              <>
                <p>
                  <b>Tổng chưa VAT:</b>{" "}
                  {getSummary(initialValues.products).totalBeforeVat.toLocaleString()} VND
                </p>
                <p>
                  <b>VAT 5%:</b> {getSummary(initialValues.products).vat5.toLocaleString()} VND
                </p>
                <p>
                  <b>VAT 10%:</b> {getSummary(initialValues.products).vat10.toLocaleString()} VND
                </p>
              </>
            )}
          </div>
        </div>
      </Form>
    </Modal>
  );
};
