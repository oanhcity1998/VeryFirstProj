import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty, Spin, Form } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import Table from "antd/es/table";
import ProductForm from "@/components/CRM/ProductForm/ProductForm";
import "@/index.css";

const { Option } = Select;

interface Product {
  key: number;
  id: number;
  name: string;
  description: string;
  type: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  priceAfterVatVND: number;
  priceAfterVatUSD: number;
}

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    product_type: searchParams.get("product_type") || undefined,
    vat: searchParams.get("vat") ? Number(searchParams.get("vat")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([
    {
      key: 1,
      id: 1,
      name: "iPhone 15 Pro",
      description: "Smartphone cao cấp",
      type: "package",
      priceVND: 28800000,
      priceUSD: 1200,
      vat: 10,
      priceAfterVatVND: 31680000,
      priceAfterVatUSD: 1320,
    },
    {
      key: 2,
      id: 2,
      name: "MacBook Air M2",
      description: "Laptop nhẹ và mạnh",
      type: "monthly",
      priceVND: 36000000,
      priceUSD: 1500,
      vat: 10,
      priceAfterVatVND: 39600000,
      priceAfterVatUSD: 1650,
    },
  ]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: 2,
    pages: 1,
  });

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set("q", queryParams.q);
    if (queryParams.product_type) params.set("product_type", queryParams.product_type);
    if (queryParams.vat !== undefined) params.set("vat", queryParams.vat.toString());
    params.set("page", queryParams.page.toString());
    params.set("limit", queryParams.limit.toString());
    setSearchParams(params);
  }, [queryParams, setSearchParams]);

  const handleSave = async (values: Product) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (selectedProduct) {
        setProducts((prev) =>
          prev.map((item) =>
            item.id === selectedProduct.id ? { ...item, ...values } : item
          )
        );
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        const newProduct: Product = {
          key: Date.now(),
          id: Date.now(),
          ...values,
        };
        setProducts((prev) => [...prev, newProduct]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
          pages: Math.ceil((prev.total + 1) / prev.limit),
        }));
        toast.success("Thêm sản phẩm thành công");
      }
      setIsModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      toast.error(`Không thể ${selectedProduct ? "cập nhật" : "thêm"} sản phẩm`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProducts((prev) =>
        prev.filter((item) => !selectedRowKeys.includes(String(item.id)))
      );
      setMeta((prev) => ({
        ...prev,
        total: prev.total - selectedRowKeys.length,
        pages: Math.ceil((prev.total - selectedRowKeys.length) / prev.limit),
      }));
      toast.success("Đã xóa sản phẩm thành công");
      setSelectedRowKeys([]);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, limit: pageSize });
  };

  const filteredData = products.filter((item) => {
    const matchSearch =
      item.name.toLowerCase().includes(queryParams.q.toLowerCase()) ||
      item.description.toLowerCase().includes(queryParams.q.toLowerCase());
    const matchType = queryParams.product_type
      ? item.type === queryParams.product_type
      : true;
    const matchVAT = queryParams.vat !== undefined ? item.vat === queryParams.vat : true;
    return matchSearch && matchType && matchVAT;
  });

  const paginatedData = filteredData.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      fixed: "left" as const,
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
      render: (value: string) => (value === "package" ? "Theo gói" : "Theo tháng"),
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      width: 120,
      render: (value: number) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      width: 120,
      render: (value: number) => value.toLocaleString("en-US"),
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
      render: (value: number) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "priceAfterVatUSD",
      key: "priceAfterVatUSD",
      width: 150,
      render: (value: number) => value.toLocaleString("en-US"),
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      render: (_: any, record: Product) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          className="base-edit-icon"
          onClick={() => handleEdit(record)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="list-header">
        <h2>Danh sách sản phẩm</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Tìm kiếm theo tên sản phẩm"
            allowClear
            value={queryParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo loại sản phẩm"
            value={queryParams.product_type}
            onChange={(type) =>
              setQueryParams({ ...queryParams, product_type: type, page: 1 })
            }
            options={[
              { value: "package", label: "Theo gói" },
              { value: "monthly", label: "Theo tháng" },
            ]}
            allowClear
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo VAT"
            value={queryParams.vat}
            onChange={(vat) => setQueryParams({ ...queryParams, vat, page: 1 })}
            options={[
              { value: 0, label: "0%" },
              { value: 5, label: "5%" },
              { value: 10, label: "10%" },
            ]}
            allowClear
            style={{ width: 150 }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteOpen(true)}
          >
            Xóa
          </Button>
          <Modal
            open={deleteOpen}
            title="Xác nhận xóa"
            onOk={handleDelete}
            onCancel={() => setDeleteOpen(false)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
            centered
          >
            <p>Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedProduct(null);
              setIsModalOpen(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px 0", color: "#888" }}>
          <Empty description="Không có sản phẩm nào để hiển thị" />
          <p>Hiện tại không có dữ liệu sản phẩm. Vui lòng thêm sản phẩm mới!</p>
        </div>
      ) : (
        <>
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => setSelectedRowKeys(keys.map(String)),
              type: "checkbox",
            }}
            columns={columns}
            dataSource={paginatedData}
            rowKey="id"
            pagination={false}
            scroll={{ x: 1200 }}
          />
          {meta && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
              <Pagination
                current={meta.page}
                pageSize={meta.limit}
                total={meta.total}
                onChange={handlePageChange}
                showSizeChanger
                pageSizeOptions={["5", "10", "20"]}
              />
            </div>
          )}
        </>
      )}

      <ProductForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        product={selectedProduct}
        modalTitle={selectedProduct ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
        cancelText="Hủy"
        saveText="Xác nhận"
        loading={isSubmitting}
        form={form}
      />
    </>
  );
};

export default ProductList;