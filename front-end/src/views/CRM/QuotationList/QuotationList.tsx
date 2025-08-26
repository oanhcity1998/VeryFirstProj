import { useMemo, useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
// import CreateQuotationForm from "../components/CreateQuotationForm";
import { useNavigate } from "react-router-dom";
import TableQuotation, { Quotation } from "../../../components/TableQuotation/TableQuotation";
import "./QuotationList.css";
import FilterDrawer from "../../../components/Filter/FilterDrawer";
import FilterQuotationDrawer from "../../../components/Filter/FilterQuotationDrawer";
import Search from "antd/es/input/Search";

// Mock data
const dataSource: Quotation[] = [
  {
    id: 1,
    quotationName: "Báo giá thiết bị văn phòng",
    validityPeriod: "30 ngày",
    paymentTerms: "Thanh toán 50% trước, 50% sau giao hàng",
    Products: [
      { id: 1, name: "Máy in HP 107w" },
      { id: 2, name: "Giấy A4 Double A" },
    ],
    priceVND: 12500000,
    priceUSD: 520,
    vat: 10,
    status: "Draft",
  },
  {
    id: 2,
    quotationName: "Báo giá phần mềm quản lý bán hàng",
    validityPeriod: "15 ngày",
    paymentTerms: "Thanh toán 100% sau nghiệm thu",
    Products: [{ id: 3, name: "Phần mềm ERP Cloud" }],
    priceVND: 45000000,
    priceUSD: 1900,
    vat: 8,
    status: "Sent",
  },
  {
    id: 3,
    quotationName: "Báo giá dịch vụ bảo trì hệ thống",
    validityPeriod: "1 năm",
    paymentTerms: "Thanh toán theo quý",
    Products: [
      { id: 4, name: "Dịch vụ bảo trì server" },
      { id: 5, name: "Giám sát an ninh mạng" },
    ],
    priceVND: 72000000,
    priceUSD: 3000,
    vat: 10,
    status: "Approved",
  },
  {
    id: 4,
    quotationName: "Báo giá thi công nội thất văn phòng",
    validityPeriod: "45 ngày",
    paymentTerms: "30% đặt cọc, 70% khi bàn giao",
    Products: [
      { id: 6, name: "Bàn làm việc gỗ công nghiệp" },
      { id: 7, name: "Ghế xoay văn phòng" },
    ],
    priceVND: 98000000,
    priceUSD: 4100,
    vat: 10,
    status: "Rejected",
  },
];

const QuotationList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(dataSource);

  // 🔎 search + filter
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterVAT, setFilterVAT] = useState<number | null>(null);
  const [filterProduct, setFilterProduct] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Quotation["status"] | null>(null);

  const VATOptions = useMemo(() => Array.from(new Set(data.map((d) => d.vat))), [data]);
  const ProductOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.Products.map((p) => p.name)))).flat(),
    [data]
  );
  const StatusOptions = useMemo(() => Array.from(new Set(data.map((d) => d.status))), [data]);

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      // TODO: replace with your real API delete call
      // await api.delete(`/Quotations/${Quotation.id}`);

      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);

      message.success("Đã xóa mẫu báo giá");
      navigate("/quotation-list");
    } catch (err) {
      message.error("Không thể xóa mẫu báo giá");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách mẫu báo giá</h2>
        <Search
          placeholder="Nhập tên mẫu báo giá..."
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ maxWidth: 300, marginRight: "auto", marginLeft: 8 }}
        />

        <Space>
          {/* Filter button */}
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterOpen(true)}
            style={{ marginLeft: 8 }}
          >
            Bộ lọc
          </Button>
          {/* Drawer */}
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

          {/* Delete button  */}
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

          {/* Create button  */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo
          </Button>
        </Space>
      </div>

      <TableQuotation
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        searchText={searchText}
        filterProduct={filterProduct}
        filterVat={filterVAT}
        filterStatus={filterStatus}
        onShowClick={(record) => {
          setSelectedQuotation(record);
          setIsDetailModalOpen(true);
        }}
        onEditClick={(record) => {
          setSelectedQuotation(record);
          setIsEditModalOpen(true);
        }}
      />

      {/* modals */}
      {/* <QuotationForm
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

      <QuotationForm
        mode="detail"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        initialValues={selectedQuotation}
      /> */}
    </>
  );
};

export default QuotationList;
