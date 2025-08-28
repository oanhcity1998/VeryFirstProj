import React, { useState } from "react";
import ProductForm from "../../../components/ProductForm/ProductForm";
import { Table, Button, Input, Space, InputNumber, Modal, Form } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "./ProductPage.css";

const { confirm } = Modal;
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
          item.key === editingProduct.key ? { ...item, ...values, updatedAt: dayjs() } : item
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

  // Hiện modal xác nhận xóa
  const showDeleteConfirm = () => {
    confirm({
      title: "Bạn có chắc muốn xóa sản phẩm đã chọn?",
      content: "Thao tác này không thể hoàn tác.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      centered: true, // modal nằm giữa màn hình
      onOk() {
        setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
        setSelectedRowKeys([]);
      },
    });
  };

  // Lọc theo giá
  const handleFilterPrice = () => {
    const filtered = originalData.filter((item) => {
      const minOk = priceFilter.min !== null ? item.price >= priceFilter.min : true;
      const maxOk = priceFilter.max !== null ? item.price <= priceFilter.max : true;
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
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (value) => (value === "package" ? "Theo gói" : "Theo tháng"),
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      width: 120,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      width: 120,
      render: (value) => value?.toLocaleString("en-US"),
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      key: "vat",
      width: 100,
    },
    {
      title: "Giá sau VAT (VND)",
      dataIndex: "priceAfterVatVND",
      key: "priceAfterVatVND",
      width: 150,
      render: (value) => value?.toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "priceAfterVatUSD",
      key: "priceAfterVatUSD",
      width: 150,
      render: (value) => value?.toLocaleString("en-US"),
    },
    // {
    //   title: "Ngày tạo",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   width: 120,
    //   render: (date) => dayjs(date).format("YYYY-MM-DD"),
    // },
    // {
    //   title: "Ngày cập nhật",
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   width: 120,
    //   render: (date) => dayjs(date).format("YYYY-MM-DD"),
    // },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="product-edit-icon"
        />
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
          <Input.Search placeholder="Tìm kiếm sản phẩm..." allowClear style={{ width: 250 }} />
          <InputNumber
            placeholder="Giá từ"
            min={0}
            style={{ width: 120 }}
            value={priceFilter.min}
            onChange={(value) => setPriceFilter((prev) => ({ ...prev, min: value }))}
          />
          <InputNumber
            placeholder="Đến"
            min={0}
            style={{ width: 120 }}
            value={priceFilter.max}
            onChange={(value) => setPriceFilter((prev) => ({ ...prev, max: value }))}
          />
          {/* <Button type="default" onClick={handleFilterPrice}>
            Lọc
          </Button> */}
        </Space>

        <Space>
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={showDeleteConfirm}
          >
            Xóa
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Tạo
          </Button>
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
        open={isModalVisible}
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
