import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button } from "antd";

const ProductForm = ({ onSave, product }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (product) {
      form.setFieldsValue(product);
    } else {
      form.resetFields();
    }
  }, [product, form]);

  const onFinish = (values) => {
    onSave(values);
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Tên sản phẩm"
        rules={[{ required: true, message: "Nhập tên sản phẩm" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="sku"
        label="Mã sản phẩm"
        rules={[{ required: true, message: "Nhập mã sản phẩm" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item name="category" label="Danh mục">
        <Input />
      </Form.Item>
      <Form.Item
        name="price"
        label="Giá"
        rules={[{ required: true, message: "Nhập giá" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item
        name="quantity"
        label="Số lượng"
        rules={[{ required: true, message: "Nhập số lượng" }]}
      >
        <InputNumber style={{ width: "100%" }} />
      </Form.Item>
      <Form.Item>
        {/* <Button type="primary" htmlType="submit" block>
          {product ? "Cập nhật" : "Thêm mới"}
        </Button> */}
      </Form.Item>
    </Form>
  );
};

export default ProductForm;
