import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import TableProduct, { Product } from "@/components/CRM/TableProduct/TableProduct";
import ProductForm from "@/components/CRM/ProductForm/ProductForm";

const { Option } = Select;

const ProductList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    type: searchParams.get("type") || undefined,
    vat: searchParams.get("vat") ? Number(searchParams.get("vat")) : undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 5,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [openForm, setOpenForm] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
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
      id: "2",
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
    if (queryParams.type) params.set("type", queryParams.type);
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
        setProducts((prev) => prev.map((item) => (item.id === selectedProduct.id ? values : item)));
        toast.success("Cập nhật sản phẩm thành công");
      } else {
        const newProduct: Product = {
          id: String(Date.now()),
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
      setOpenForm(false);
      setSelectedProduct(null);
    } catch (err: any) {
      toast.error(`Không thể ${selectedProduct ? "cập nhật" : "thêm"} sản phẩm`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setProducts((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setMeta((prev) => ({
        ...prev,
        total: prev.total - selectedRowKeys.length,
        pages: Math.ceil((prev.total - selectedRowKeys.length) / prev.limit),
      }));
      toast.success(`Đã xóa ${selectedRowKeys.length} sản phẩm thành công`);
      setSelectedRowKeys([]);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const handleEdit = (record: Product) => {
    setSelectedProduct(record);
    setOpenForm(true);
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
    const matchType = queryParams.type ? item.type === queryParams.type : true;
    const matchVAT = queryParams.vat !== undefined ? item.vat === queryParams.vat : true;
    return matchSearch && matchType && matchVAT;
  });

  const paginatedData = filteredData.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  return (
    <>
      <div className="list-header">
        <h2>Danh sách sản phẩm</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Tìm kiếm theo tên hoặc mô tả"
            allowClear
            value={queryParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo loại sản phẩm"
            value={queryParams.type}
            onChange={(type) => setQueryParams({ ...queryParams, type, page: 1 })}
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
            okButtonProps={{ danger: true, loading: isSubmitting }}
            centered
          >
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} sản phẩm đã chọn?</p>
          </Modal>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setSelectedProduct(null);
              setOpenForm(true);
            }}
          >
            Tạo
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có sản phẩm nào để hiển thị" />
          <p>Hiện tại không có dữ liệu sản phẩm. Vui lòng thêm sản phẩm mới!</p>
        </div>
      ) : (
        <>
          <TableProduct
            data={paginatedData}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onEdit={handleEdit}
            loading={isSubmitting}
          />
          <div className="pagination-container">
            <Pagination
              current={meta.page}
              pageSize={meta.limit}
              total={meta.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
            />
          </div>
        </>
      )}

      <ProductForm
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setSelectedProduct(null);
        }}
        onSave={handleSave}
        initialValues={selectedProduct}
        modalTitle={selectedProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
        cancelText="Hủy"
        saveText={selectedProduct ? "Xác nhận" : "Xác nhận"}
        loading={isSubmitting}
      />
    </>
  );
};

export default ProductList;
