import { useEffect } from "react";
import { Modal, Form, Input, Button, Select, Card, InputNumber } from "antd";
import "@/index.css";

const { Option } = Select;

export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  priceAfterVatVND?: number;
  priceAfterVatUSD?: number;
}

interface ProductFormProps {
  onCancel: () => void;
  onSave: (values: Product) => void;
  initialValues?: Product | null;
  open: boolean;
  modalTitle?: string;
  cancelText?: string;
  saveText?: string;
  loading?: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({
  onCancel,
  onSave,
  initialValues,
  open,
  modalTitle = "Thêm sản phẩm",
  cancelText = "Hủy",
  saveText = "Xác nhận",
  loading = false,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    } else {
      form.resetFields();
    }
  }, [initialValues, form]);

  const handleValuesChange = (changedValues: any, allValues: any) => {
    const { priceVND, priceUSD, vat } = allValues;
    if (priceVND && vat !== undefined) {
      form.setFieldsValue({
        priceAfterVatVND: priceVND * (1 + vat / 100),
      });
    }
    if (priceUSD && vat !== undefined) {
      form.setFieldsValue({
        priceAfterVatUSD: priceUSD * (1 + vat / 100),
      });
    }
  };

  const onFinish = (values: any) => {
    onSave({
      id: initialValues?.id || String(Date.now()),
      name: values.name,
      description: values.description,
      type: values.type,
      priceVND: values.priceVND,
      priceUSD: values.priceUSD,
      vat: values.vat,
      priceAfterVatVND: values.priceAfterVatVND || 0,
      priceAfterVatUSD: values.priceAfterVatUSD || 0,
    });
  };

  return (
    <Modal
      title={<h2>{modalTitle}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" danger onClick={onCancel} disabled={loading}>
          {cancelText}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={() => form.submit()}
          loading={loading}
          disabled={loading}
        >
          {saveText}
        </Button>,
      ]}
      width={800}
      className="modal-body"
      centered
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={handleValuesChange}
      >
        <Card title="Thông tin sản phẩm" className="card-section">
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input.TextArea
              placeholder="Nhập mô tả"
              autoSize={{ minRows: 3, maxRows: 5 }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại sản phẩm"
            rules={[{ required: true, message: "Vui lòng chọn loại sản phẩm!" }]}
          >
            <Select placeholder="Chọn loại sản phẩm">
              <Option value="package">Theo gói</Option>
              <Option value="monthly">Theo tháng</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="priceVND"
            label="Giá (VND)"
            rules={[{ required: true, message: "Vui lòng nhập giá VND!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá VND"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/,/g, "") as any}
            />
          </Form.Item>

          <Form.Item
            name="priceUSD"
            label="Giá (USD)"
            rules={[{ required: true, message: "Vui lòng nhập giá USD!" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Nhập giá USD"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/,/g, "") as any}
            />
          </Form.Item>

          <Form.Item
            name="vat"
            label="VAT (%)"
            rules={[{ required: true, message: "Vui lòng chọn VAT!" }]}
          >
            <Select placeholder="Chọn VAT">
              <Option value={0}>0%</Option>
              <Option value={5}>5%</Option>
              <Option value={10}>10%</Option>
            </Select>
          </Form.Item>

          <Form.Item name="priceAfterVatVND" label="Giá sau VAT (VND)">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Giá sau VAT (VND)"
              disabled
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/,/g, "") as any}
            />
          </Form.Item>

          <Form.Item name="priceAfterVatUSD" label="Giá sau VAT (USD)">
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Giá sau VAT (USD)"
              disabled
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(value) => value!.replace(/,/g, "") as any}
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default ProductForm;