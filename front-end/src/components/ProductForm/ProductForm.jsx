import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Select } from "antd";

const ProductForm = ({ onSave, product }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  // Tính giá sau VAT
  const handleValuesChange = (changedValues, allValues) => {
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

  const onFinish = (values) => {
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
            { value: "package", label: "Theo gói" },
            { value: "monthly", label: "Theo tháng" },
          ]}
        />
      </Form.Item>

      <Form.Item
        name="priceVND"
        label="Giá (VND)"
        rules={[{ required: true, message: "Nhập giá VND" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item
        name="priceUSD"
        label="Giá (USD)"
        rules={[{ required: true, message: "Nhập giá USD" }]}
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

      <Form.Item name="priceAfterVatVND" label="Giá sau VAT (VND)">
        <InputNumber style={{ width: "100%" }} disabled />
      </Form.Item>

      <Form.Item name="priceAfterVatUSD" label="Giá sau VAT (USD)">
        <InputNumber style={{ width: "100%" }} disabled />
      </Form.Item>

      {/* 
        <Button type="primary" htmlType="submit" block>
          {product ? "Cập nhật" : "Thêm mới"}
        </Button>
      </Form.Item> */}
    </Form>
  );
};

export default ProductForm;
