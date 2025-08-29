import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Select, FormInstance } from "antd";
import { Product } from "../../views/CRM/ProductPage/ProductPage";

type ProductFormProps = {
  product: Product | null;
  onSave: (values: Partial<Product>) => void;
  form: FormInstance;
};

const ProductForm: React.FC<ProductFormProps> = ({ onSave, product, form }) => {
  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  // Tính giá sau VAT
  const handleValuesChange = (_: any, allValues: any) => {
    const { price, vat } = allValues;
    if (price && vat !== undefined) {
      form.setFieldsValue({
        priceAfterVat: price * (1 + vat / 100),
      });
    }
  };

  const onFinish = (values: any) => {
    onSave(values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish} onValuesChange={handleValuesChange}>
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>

      <Form.Item
        name="type"
        label="Loại sản phẩm"
        rules={[{ required: true, message: "Chọn loại sản phẩm" }]}
      >
        <Select
          options={[
            { value: "Theo gói", label: "Theo gói" },
            { value: "Theo tháng", label: "Theo tháng" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="price"
        label="Giá (USD)"
        rules={[{ required: true, message: "Nhập giá USD" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="currency"
        label="Tiền tệ"
        initialValue="USD"
        rules={[{ required: true, message: "Chọn loại tiền tệ" }]}
      >
        <Select
          options={[
            { value: "USD", label: "USD" },
            { value: "VND", label: "VND" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="exchangeRate"
        label="Tỉ giá (VND/USD)"
        initialValue={24000}
        rules={[{ required: true, message: "Nhập tỉ giá" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item name="vat" label="VAT (%)" rules={[{ required: true, message: "Chọn VAT" }]}>
        <Select
          options={[
            { value: 0, label: "0%" },
            { value: 5, label: "5%" },
            { value: 10, label: "10%" },
          ]}
        />
      </Form.Item>

      <Form.Item name="priceAfterVat" label="Giá sau VAT (USD)">
        <InputNumber style={{ width: "100%" }} disabled />
      </Form.Item>

      {/* <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {product ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default ProductForm;
