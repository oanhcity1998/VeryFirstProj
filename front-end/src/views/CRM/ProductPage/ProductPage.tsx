import React, { useState, useMemo } from "react";
import ProductForm from "../../../components/ProductForm/ProductForm";
import { Table, Button, Space, Modal, Form, Select } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import "./ProductPage.css";
import Search from "antd/es/input/Search";
import type { ColumnsType, TableRowSelection } from "antd/es/table/interface";
import type { Key } from "react";

// Định nghĩa kiểu Product
export type Product = {
  key: number;
  name: string;
  description: string;
  type: string;
  price: number;
  currency: string;
  exchangeRate: number;
  vat: number;
  createdAt: Dayjs;
  updatedAt: Dayjs;
};

const { confirm } = Modal;

const ProductPage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [originalData, setOriginalData] = useState<Product[]>([
    {
      key: 1,
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
      key: 2,
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

  const [filters, setFilters] = useState<{ productType: string | null; vat: number | null }>({
    productType: null,
    vat: null,
  });
  const [searchValue, setSearchValue] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Thêm mới sản phẩm
  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Chỉnh sửa sản phẩm
  const handleEdit = (record: Product) => {
    setEditingProduct(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  // Lưu dữ liệu từ form
  const handleSave = (values: Partial<Product>) => {
    if (editingProduct) {
      setOriginalData((prev) =>
        prev.map((item) =>
          item.key === editingProduct.key ? { ...item, ...values, updatedAt: dayjs() } : item
        )
      );
    } else {
      const newProduct: Product = {
        key: Date.now(),
        ...values,
        createdAt: dayjs(),
        updatedAt: dayjs(),
      } as Product;
      setOriginalData((prev) => [...prev, newProduct]);
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
      centered: true,
      onOk() {
        setOriginalData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
        setSelectedRowKeys([]);
      },
    });
  };

  // ✅ Dữ liệu cuối cùng sau Search + Filter
  const filteredData = useMemo(() => {
    return originalData.filter((item) => {
      const matchSearch =
        item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        item.description.toLowerCase().includes(searchValue.toLowerCase());

      const matchType = filters.productType ? item.type === filters.productType : true;
      const matchVAT = filters.vat !== null ? item.vat === filters.vat : true;

      return matchSearch && matchType && matchVAT;
    });
  }, [originalData, searchValue, filters]);

  const columns: ColumnsType<Product> = [
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
    },
    {
      title: "Giá (USD)",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (value: number) => value?.toLocaleString("en-US"),
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      key: "vat",
      width: 100,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date: Dayjs) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 120,
      render: (date: Dayjs) => dayjs(date).format("YYYY-MM-DD"),
    },
    {
      title: "",
      key: "action",
      fixed: "right",
      width: 100,
      render: (_: any, record: Product) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="product-edit-icon"
        />
      ),
    },
  ];

  // ✅ RowSelection chuẩn TS
  const rowSelection: TableRowSelection<Product> = {
    selectedRowKeys,
    onChange: (keys) => setSelectedRowKeys(keys),
    type: "checkbox",
  };

  // Search handler
  const handleSearch = (value: string) => {
    setSearchValue(value);
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
          <Search
            placeholder="Tìm kiếm"
            allowClear
            name="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{ width: 300 }}
          />
        </Space>

        <Space>
          {/* Bộ lọc */}
          <Select
            allowClear
            placeholder="Loại sản phẩm"
            style={{ width: 180 }}
            value={filters.productType}
            onChange={(val) => setFilters((prev) => ({ ...prev, productType: val }))}
            options={[
              { label: "Theo tháng", value: "Theo tháng" },
              { label: "Theo gói", value: "Theo gói" },
            ]}
          />

          <Select<number>
            allowClear
            placeholder="VAT"
            style={{ width: 150 }}
            value={filters.vat}
            onChange={(val) => setFilters((prev) => ({ ...prev, vat: val }))}
            options={[
              { label: "5", value: 5 },
              { label: "10", value: 10 },
              { label: "15", value: 15 },
            ]}
          />

          <Button
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
        rowSelection={rowSelection}
        columns={columns}
        dataSource={filteredData}
        scroll={{ x: 1200 }}
        rowKey="key"
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
