// src/pages/ProductPage.js
import React, { useState } from "react";
import ProductForm from "../components/ProductForm";
import {
  Table,
  Button,
  Input,
  Space,
  InputNumber,
  Modal,
  Form,
  Popconfirm,
} from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const ProductPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [originalData] = useState([
    {
      key: "1",
      name: "iPhone 15 Pro",
      description: "Smartphone cao cấp",
      type: "Theo gói",
      price: 1200,
      currency: "USD",
      exchangeRate: 24000,
      vat: 10,
      createdAt: dayjs("2025-01-01"),
      updatedAt: dayjs("2025-01-10"),
    },
    {
      key: "2",
      name: "MacBook Air M2",
      description: "Laptop nhẹ và mạnh",
      type: "Theo tháng",
      price: 1500,
      currency: "USD",
      exchangeRate: 24000,
      vat: 10,
      createdAt: dayjs("2025-01-05"),
      updatedAt: dayjs("2025-01-12"),
    },
  ]);
  const [data, setData] = useState([...originalData]);
  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  // Thêm mới sản phẩm
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Chỉnh sửa sản phẩm
  const handleEdit = (record) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Lưu dữ liệu từ form
  const handleSave = (values) => {
    if (editingProduct) {
      setData((prev) =>
        prev.map((item) =>
          item.key === editingProduct.key
            ? { ...item, ...values, updatedAt: dayjs() }
            : item
        )
      );
    } else {
      const newProduct = {
        key: Date.now().toString(),
        ...values,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      };
      setData((prev) => [...prev, newProduct]);
    }
    setIsModalVisible(false);
  };

  // Xóa sản phẩm đã chọn
  const handleDelete = () => {
    setData((prev) =>
      prev.filter((item) => !selectedRowKeys.includes(item.key))
    );
    setSelectedRowKeys([]);
  };

  // Lọc theo giá
  const handleFilterPrice = () => {
    const filtered = originalData.filter((item) => {
      const minOk =
        priceFilter.min !== null ? item.price >= priceFilter.min : true;
      const maxOk =
        priceFilter.max !== null ? item.price <= priceFilter.max : true;
      return minOk && maxOk;
    });
    setData(filtered);
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      width: 200,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      width: 200,
    },
    { title: "Loại sản phẩm", dataIndex: "type", key: "type", width: 150 },
    { title: "Giá", dataIndex: "price", key: "price", width: 100 },
    { title: "Loại tiền", dataIndex: "currency", key: "currency", width: 100 },
    {
      title: "Tỉ giá VND",
      dataIndex: "exchangeRate",
      key: "exchangeRate",
      width: 100,
    },
    { title: "VAT (%)", dataIndex: "vat", key: "vat", width: 100 },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (date) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        ></Button>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Thanh công cụ */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Space>
          <h2 style={{ margin: 0 }}>Danh sách sản phẩm</h2>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            style={{ width: 250 }}
          />
          <InputNumber
            placeholder="Giá từ"
            min={0}
            style={{ width: 120 }}
            value={priceFilter.min}
            onChange={(value) =>
              setPriceFilter((prev) => ({ ...prev, min: value }))
            }
          />
          <InputNumber
            placeholder="Đến"
            min={0}
            style={{ width: 120 }}
            value={priceFilter.max}
            onChange={(value) =>
              setPriceFilter((prev) => ({ ...prev, max: value }))
            }
          />
          {/* <Button type="default" onClick={handleFilterPrice}>
            Lọc
          </Button> */}
        </Space>

        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sản phẩm
          </Button>

          <Popconfirm
            title="Bạn có muốn xóa sản phẩm này?"
            onConfirm={handleDelete}
            okText="Có"
            cancelText="Không"
            disabled={selectedRowKeys.length === 0}
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      </div>

      {/* Bảng sản phẩm */}
      <Table
        rowSelection={{ type: "checkbox", ...rowSelection }}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1200 }}
      />

      {/* Modal Thêm / Sửa */}
      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
        visible={isModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <ProductForm form={form} product={editingProduct} onSave={handleSave} />
      </Modal>
    </div>
  );
};

export default ProductPage;
