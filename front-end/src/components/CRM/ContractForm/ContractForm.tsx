import React, { useState, useEffect } from "react";
import { Modal, Button, Row, Col, Input, Select, Table, Card, Form, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Option } = Select;

interface Product {
  key: number;
  name: string;
  type: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
}

interface Contract {
  id: string;
  code: string;
  name: string;
  type: string;
  customer: string;
  total: number;
  owner: string;
  createdAt: string;
  approver: string;
  approvedAt: string;
  status: string;
  products?: Product[];
  paymentTerms?: string;
  validity?: string;
}

interface ContractFormProps {
  open: boolean;
  onCancel: () => void;
  onSave: (data: Contract) => void;
  title?: string;
  initialValues?: Contract | null;
}

const ContractForm: React.FC<ContractFormProps> = ({
  open,
  onCancel,
  onSave,
  title = "Thêm mới báo giá & hợp đồng",
  initialValues,
}) => {
  const [form] = Form.useForm();
  const [products, setProducts] = useState<Product[]>(initialValues?.products || []);

  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        code: initialValues.code || "",
        name: initialValues.name || "",
        customer: initialValues.customer || "",
        type: initialValues.type || undefined,
        paymentTerms: initialValues.paymentTerms || "",
        validity: initialValues.validity || "",
        owner: initialValues.owner || "",
        approver: initialValues.approver || "",
        status: initialValues.status || undefined,
        approvedAt: initialValues.approvedAt ? dayjs(initialValues.approvedAt, "DD/MM/YYYY") : null,
      });
      setProducts(initialValues.products || []);
    } else {
      form.resetFields();
      setProducts([]);
    }
  }, [initialValues, form]);

  const handleDelete = (key: number) => {
    setProducts(products.filter((p) => p.key !== key));
  };

  const handleAddProduct = () => {
    const newKey = products.length > 0 ? Math.max(...products.map((p) => p.key)) + 1 : 1;
    setProducts([
      ...products,
      {
        key: newKey,
        name: "",
        type: "Tháng",
        priceVND: 0,
        priceUSD: 0,
        vat: 10,
      },
    ]);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (products.length === 0) {
        form.setFields([
          {
            name: "products",
            errors: ["Vui lòng thêm ít nhất một sản phẩm!"],
          },
        ]);
        return;
      }
      const total = products.reduce((sum, p) => sum + (p.priceVND * (100 + p.vat)) / 100, 0);
      onSave({
        id: initialValues?.id || String(Date.now()),
        ...values,
        approvedAt: values.approvedAt ? values.approvedAt.format("DD/MM/YYYY") : "",
        products: products.map((p) => ({
          ...p,
          priceVND: Number(p.priceVND),
          priceUSD: Number(p.priceUSD),
          vat: Number(p.vat),
        })),
        total,
      });
      form.resetFields();
      setProducts([]);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: Product, index: number) => (
        <Input
          value={record.name}
          onChange={(e) => {
            const newProducts = [...products];
            newProducts[index].name = e.target.value;
            setProducts(newProducts);
          }}
          placeholder="Nhập tên sản phẩm"
        />
      ),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
      key: "type",
      render: (_: any, record: Product, index: number) => (
        <Select
          value={record.type}
          onChange={(value) => {
            const newProducts = [...products];
            newProducts[index].type = value;
            setProducts(newProducts);
          }}
          className="full-width"
        >
          <Option value="Tháng">Tháng</Option>
          <Option value="Gói">Gói</Option>
        </Select>
      ),
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.priceVND}
          onChange={(e) => {
            const newProducts = [...products];
            newProducts[index].priceVND = Number(e.target.value);
            setProducts(newProducts);
          }}
          placeholder="Nhập giá VND"
        />
      ),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.priceUSD}
          onChange={(e) => {
            const newProducts = [...products];
            newProducts[index].priceUSD = Number(e.target.value);
            setProducts(newProducts);
          }}
          placeholder="Nhập giá USD"
        />
      ),
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      render: (_: any, record: Product, index: number) => (
        <Input
          type="number"
          value={record.vat}
          onChange={(e) => {
            const newProducts = [...products];
            newProducts[index].vat = Number(e.target.value);
            setProducts(newProducts);
          }}
          placeholder="Nhập VAT (%)"
          min={0}
          max={100}
        />
      ),
    },
    {
      title: "Giá sau VAT (VND)",
      key: "afterVATVND",
      render: (_: any, record: Product) =>
        ((record.priceVND * (100 + record.vat)) / 100).toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      key: "afterVATUSD",
      render: (_: any, record: Product) =>
        ((record.priceUSD * (100 + record.vat)) / 100).toLocaleString("en-US"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Button danger type="text" onClick={() => handleDelete(record.key)}>
          ❌
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={<h2>{title}</h2>}
      open={open}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Huỷ
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          {initialValues ? "Xác nhận" : "Lưu thay đổi"}
        </Button>,
      ]}
      className="top-20 width-1100"
    >
      <Form form={form} layout="vertical" labelAlign="left">
        <Card title="Thông tin báo giá & hợp đồng" className="card-section">
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="Mã báo giá & hợp đồng"
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã!" }]}
              >
                <Input placeholder="Nhập mã" />
              </Form.Item>
              <Form.Item
                label="Tên báo giá & hợp đồng"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
              >
                <Input placeholder="Nhập tên" />
              </Form.Item>
              <Form.Item
                label="Khách hàng"
                name="customer"
                rules={[{ required: true, message: "Vui lòng nhập khách hàng!" }]}
              >
                <Input placeholder="Nhập khách hàng" />
              </Form.Item>
              <Form.Item label="Mẫu báo giá" name="template" rules={[{ required: false }]}>
                <Select className="full-width" placeholder="Chọn mẫu" allowClear>
                  <Option value="1">Mẫu 1</Option>
                  <Option value="2">Mẫu 2</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Loại"
                name="type"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select className="full-width" placeholder="Chọn loại">
                  <Option value="Báo giá">Báo giá</Option>
                  <Option value="Hợp đồng">Hợp đồng</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Điều khoản thanh toán"
                name="paymentTerms"
                rules={[{ required: true, message: "Vui lòng nhập điều khoản thanh toán!" }]}
              >
                <Input placeholder="Nhập điều khoản" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời hạn hiệu lực" name="validity" rules={[{ required: false }]}>
                <Input placeholder="Nhập thời hạn" />
              </Form.Item>
              <Form.Item
                label="Nhân viên phụ trách"
                name="owner"
                rules={[{ required: true, message: "Vui lòng nhập nhân viên phụ trách!" }]}
              >
                <Input placeholder="Nhập nhân viên" />
              </Form.Item>
              <Form.Item label="Người duyệt" name="approver" rules={[{ required: false }]}>
                <Input placeholder="Nhập người duyệt" />
              </Form.Item>
              <Form.Item
                label="Trạng thái"
                name="status"
                rules={[{ required: true, message: "Vui lòng chọn trạng thái!" }]}
              >
                <Select className="full-width" placeholder="Chọn trạng thái">
                  <Option value="Chờ duyệt">Chờ duyệt</Option>
                  <Option value="Đã duyệt">Đã duyệt</Option>
                  <Option value="Huỷ">Huỷ</Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="Ngày duyệt"
                name="approvedAt"
                rules={[
                  {
                    validator: async (_, value) => {
                      if (value && !dayjs(value, "DD/MM/YYYY", true).isValid()) {
                        return Promise.reject(
                          new Error("Ngày duyệt không đúng định dạng DD/MM/YYYY!")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <DatePicker format="DD/MM/YYYY" className="full-width" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Card className="card-section">
          <div className="header-container">
            <h3 className="card-title">Danh sách sản phẩm</h3>
            <Button type="primary" onClick={handleAddProduct}>
              <PlusOutlined /> Thêm sản phẩm
            </Button>
          </div>
          <Form.Item
            name="products"
            rules={[
              {
                validator: () =>
                  products.length > 0
                    ? Promise.resolve()
                    : Promise.reject(new Error("Vui lòng thêm ít nhất một sản phẩm!")),
              },
            ]}
          >
            <Table
              dataSource={products}
              columns={columns}
              pagination={false}
              bordered
              size="small"
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default ContractForm;
