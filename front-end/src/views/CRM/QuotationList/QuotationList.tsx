import { useMemo, useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import { ROUTES_APP } from "../../../app/routes";
import FilterQuotationDrawer from "@/components/CRM/Filter/FilterQuotationDrawer";
import { TableQuotation } from "@/components/CRM/TableQuotation/TableQuotation";
import { QuotationForm } from "@/components/CRM/QuotationForm/QuotationForm";
;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
export interface Product {
  id: number;
  productName: string;
  productType: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  afterVatVND: number;
  afterVatUSD: number;
}

// Interface Quotation
export interface Quotation {
  id: number;
  quotationName: string;
  validityPeriod: string;
  paymentTerms: string;
  products: Product[];
  opportunity?: string;
  status: "Draft" | "Sent" | "Approved" | "Rejected";
}

// Mock data
export const quotationMockData: Quotation[] = [
  {
    id: 1,
    quotationName: "Báo giá thiết bị văn phòng",
    validityPeriod: "30 ngày",
    paymentTerms: "Thanh toán 50% trước, 50% sau giao hàng",
    products: [
      {
        id: 1,
        productName: "Máy in HP 107w",
        productType: "Thiết bị văn phòng",
        priceVND: 5000000,
        priceUSD: 210,
        vat: 10,
        afterVatVND: 5500000,
        afterVatUSD: 231,
      },
      {
        id: 2,
        productName: "Giấy A4 Double A",
        productType: "Vật tư tiêu hao",
        priceVND: 250000,
        priceUSD: 11,
        vat: 5,
        afterVatVND: 262500,
        afterVatUSD: 11.55,
      },
    ],
    status: "Draft",
  },
];

const QuotationList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(quotationMockData);

  // 🔎 search + filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVAT, setFilterVAT] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Quotation["status"] | null>(null);

  const VATOptions = useMemo(
    () => Array.from(new Set(data.flatMap((d) => d.products.map((p) => p.vat)))),
    [data]
  );
  const ProductOptions = useMemo(
    () => Array.from(new Set(data.flatMap((d) => d.products.map((p) => p.productName)))),
    [data]
  );
  const StatusOptions = useMemo(() => Array.from(new Set(data.map((d) => d.status))), [data]);

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 👉 Hàm tính tổng + VAT từ danh sách sản phẩm
  const getSummary = (products: Product[]) => {
    const totalBeforeVat = products.reduce((sum, p) => sum + p.priceVND, 0);
    const vat5 = products
      .filter((p) => p.vat === 5)
      .reduce((sum, p) => sum + (p.afterVatVND - p.priceVND), 0);
    const vat10 = products
      .filter((p) => p.vat === 10)
      .reduce((sum, p) => sum + (p.afterVatVND - p.priceVND), 0);

    return { totalBeforeVat, vat5, vat10 };
  };

  // tạo báo giá mới
  const handleCreate = (values: any) => {
    const newQuotation: Quotation = {
      id: data.length + 1,
      quotationName: values.quotationName,
      validityPeriod: values.validityPeriod,
      paymentTerms: values.paymentTerms,
      products: values.products || [],
      status: "Draft",
      opportunity: values.opportunity,
    };
    setData((prev) => [...prev, newQuotation]);
    setIsCreateModalOpen(false);
    message.success("Tạo mới báo giá thành công!");
  };

  // chỉnh sửa báo giá
  const handleEdit = (values: any) => {
    if (!selectedQuotation) return;
    const updated: Quotation = {
      ...selectedQuotation,
      quotationName: values.quotationName,
      validityPeriod: values.validityPeriod,
      paymentTerms: values.paymentTerms,
      products: values.products || [],
      status: values.status,
      opportunity: values.opportunity,
    };
    setData((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setIsEditModalOpen(false);
    message.success("Cập nhật báo giá thành công!");
  };

  // handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success("Đã xóa mẫu báo giá");
      navigate(ROUTES_APP.crm.quotationList);
    } catch (err) {
      message.error("Không thể xóa mẫu báo giá");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div className="list-header">
        <h2>Danh sách mẫu báo giá</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Tìm kiếm theo tên mẫu báo giá"
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          {/* Filter button */}
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterOpen(true)}
            style={{ marginLeft: 8 }}
          >
            Bộ lọc
          </Button>
          <FilterQuotationDrawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onConfirm={(values) => console.log("Apply filter:", values)}
            filterVAT={filterVAT}
            setFilterVAT={setFilterVAT}
            filterProduct={filterProduct}
            setFilterProduct={setFilterProduct}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            VATOptions={VATOptions}
            ProductOptions={ProductOptions}
            StatusOptions={StatusOptions}
          />

          {/* Delete button */}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteOpen(true)}
            disabled={selectedRowKeys.length === 0}
            className={`delete-button ${selectedRowKeys.length === 0 ? "disabled" : ""}`}
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
            okButtonProps={{ danger: true, loading: deleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa mẫu báo giá này? Hành động này không thể hoàn tác.</p>
          </Modal>

          {/* Create button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo
          </Button>
        </div>
      </div>

      <TableQuotation
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        searchText={searchText}
        filterProduct={filterProduct}
        filterVat={filterVAT}
        filterStatus={filterStatus}
        getSummary={getSummary} // 👉 truyền xuống bảng để render cột tổng
        onEditClick={(record) => {
          setSelectedQuotation(record);
          setIsEditModalOpen(true);
        }}
      />

      {/* modals */}
      <QuotationForm
        mode="create"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreate}
      />

      <QuotationForm
        mode="edit"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEdit}
        initialValues={selectedQuotation}
      />
    </>
  );
};

export default QuotationList;
