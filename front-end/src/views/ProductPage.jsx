import React, { useState } from "react";
import "./ProductPage.css"; // ✅ import CSS
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
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [priceFilter, setPriceFilter] = useState({ min: null, max: null });

  // Table columns
  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => `${price.toLocaleString()} VND`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa sản phẩm này?"
            onConfirm={() => handleDelete(record.key)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="primary" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Handlers
  const handleAdd = () => {
    setEditingProduct(null);
    setIsModalVisible(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalVisible(true);
    form.setFieldsValue(product);
  };

  const handleDelete = (key) => {
    setData((prev) => prev.filter((item) => item.key !== key));
    setSelectedRowKeys((prev) => prev.filter((id) => id !== key));
  };

  const handleSave = (values) => {
    if (editingProduct) {
      // Update product
      setData((prev) =>
        prev.map((item) =>
          item.key === editingProduct.key ? { ...item, ...values } : item
        )
      );
    } else {
      // Add new product
      setData((prev) => [
        ...prev,
        {
          key: Date.now(),
          ...values,
          createdAt: new Date(),
        },
      ]);
    }
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleFilterPrice = () => {
    // later we can implement actual filter logic
    console.log("Filter by price:", priceFilter);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedKeys) => setSelectedRowKeys(newSelectedKeys),
  };

  return (
    <div className="product-page">
      {/* Toolbar */}
      <div className="product-toolbar">
        <Space>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            className="product-search"
          />
          <InputNumber
            placeholder="Giá từ"
            min={0}
            className="product-input-number"
            value={priceFilter.min}
            onChange={(value) =>
              setPriceFilter((prev) => ({ ...prev, min: value }))
            }
          />
          <InputNumber
            placeholder="Đến"
            min={0}
            className="product-input-number"
            value={priceFilter.max}
            onChange={(value) =>
              setPriceFilter((prev) => ({ ...prev, max: value }))
            }
          />
          <Button type="default" onClick={handleFilterPrice}>
            Lọc
          </Button>
        </Space>

        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm sản phẩm
          </Button>
          <Popconfirm
            title="Bạn có muốn xóa các sản phẩm đã chọn?"
            onConfirm={() =>
              setData((prev) =>
                prev.filter((item) => !selectedRowKeys.includes(item.key))
              )
            }
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

      {/* Table */}
      <Table
        className="product-table"
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        scroll={{ x: 1200 }}
      />

      {/* Modal */}
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
