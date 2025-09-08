import { useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined, DownloadOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { generatePath, useNavigate } from "react-router-dom";
import { DebtReportForm } from "../../../components/DebtReportForm/DebtReportForm";
import { TableDebtReport } from "../../../components/TableDebtReport/TableDebtReport";
import { FilterDebtReportDrawer } from "../../../components/Filter/FilterDebtReportDrawer";
import { ROUTES_APP } from "../../../routes";

export interface Invoice {
  invoiceNo: string; // Số hóa đơn
  invoiceDate: string; // Ngày hóa đơn (YYYY-MM-DD)
  rate?: number; // Tỉ lệ suất (%)
  amountNoVAT?: number; // Giá trị chưa VAT
}

export interface Payment {
  paymentCode: string; // Mã thanh toán
  amount: number; // Số tiền đã thu
  paymentDate: string; // Ngày thu tiền (YYYY-MM-DD)
  method: "Tiền mặt" | "Chuyển khoản"; // Phương thức thanh toán
}

export interface Collaborator {
  name: string; // Tên cộng tác viên
  phone?: string; // Số điện thoại
  commissionRate?: number; // Tỷ lệ hoa hồng (%)
  amount?: number; // Số tiền hoa hồng
}

export interface DebtReport {
  // 👉 Thông tin khởi tạo
  id: number;
  reportNo: string; // Số báo cáo
  reportDate: string; // Ngày lập báo cáo
  contract: string; // Hợp đồng
  customer: string; // Khách hàng
  auditor?: string; // Kiểm toán viên
  director?: string; // Giám đốc phụ trách
  status: "Khởi tạo" | "Chờ kế toán" | "Xác nhận"; // Trạng thái báo cáo

  // 👉 Thông tin chờ kế toán
  fee?: number; // Phí
  exchangeRate?: number; // Tỉ giá
  feeUSD?: number; // Phí USD
  feeNoVAT?: number; // Phí chưa VAT
  feeVND?: number; // Phí VNĐ
  feeWithVAT?: number; // Phí gồm VAT

  // 👉 Hóa đơn
  invoices?: Invoice[];

  // 👉 Thanh toán
  payments?: Payment[];

  // 👉 Công nợ
  debtNoVAT?: number; // Số tiền chưa VAT
  debtWithVAT?: number; // Số tiền đã VAT
  totalDebtRemaining?: number; // Tổng công nợ còn phải thu (đã VAT)
  badDebt?: number; // Nợ khó đòi

  // 👉 Hoa hồng cộng tác viên
  collaborators?: Collaborator[];

  // 👉 Thông tin tổng hợp cũ
  totalDebt?: number; // Tổng công nợ
  remainingDebt?: number; // Công nợ còn lại
  debtStatus?: "Còn nợ" | "Đã thanh toán" | "Khó đòi";
}

export const mockDebtReportData: DebtReport[] = [
  {
    id: 1,
    reportNo: "BCN-001",
    reportDate: "2025-09-01",
    contract: "HĐ-2025-01",
    customer: "Công ty ABC",
    auditor: "Nguyễn Văn A",
    director: "Trần Văn B",
    status: "Khởi tạo",
    debtStatus: "Còn nợ",
    fee: 1000,
    exchangeRate: 25000,
    feeUSD: 40,
    feeNoVAT: 900000,
    feeVND: 1000000,
    feeWithVAT: 1100000,
    invoices: [{ invoiceNo: "INV-001", invoiceDate: "2025-09-02", rate: 10, amountNoVAT: 500000 }],
    payments: [
      { paymentCode: "PMT-001", amount: 200000, paymentDate: "2025-09-03", method: "Chuyển khoản" },
    ],
    collaborators: [
      { name: "Nguyễn Văn CTV", phone: "0901234567", commissionRate: 5, amount: 25000 },
    ],
    debtNoVAT: 500000,
    debtWithVAT: 550000,
    totalDebtRemaining: 300000,
    badDebt: 0,
  },
];

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const exportToExcel = (data: DebtReport[], fileName = "debt-report.xlsx") => {
  // 1. Convert JSON → sheet
  const worksheet = XLSX.utils.json_to_sheet(
    data.map((r) => ({
      "Số báo cáo": r.reportNo,
      "Ngày báo cáo": r.reportDate,
      "Khách hàng": r.customer,
      "Hợp đồng": r.contract,
      "Trạng thái báo cáo": r.status,
      "Trạng thái công nợ": r.debtStatus ?? "-",
      "Tổng công nợ": r.totalDebt ?? "-",
      "Còn lại": r.remainingDebt ?? "-",
    }))
  );

  // 2. Tạo workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Báo cáo công nợ");

  // 3. Xuất ra buffer rồi tạo file
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, fileName);
};

const DebtReportList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<DebtReport[]>(mockDebtReportData);

  // filter + search
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<[string, string] | null>(null);
  const [filterContract, setFilterContract] = useState<string | null>(null);
  const [filterCustomer, setFilterCustomer] = useState<string | null>(null);
  const [filterDebtStatus, setFilterDebtStatus] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  // modal state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<DebtReport | null>(null);

  // delete state
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // 👉 Create
  const handleCreate = (values: DebtReport) => {
    const newReport: DebtReport = { ...values, id: data.length + 1 };
    setData((prev) => [...prev, newReport]);
    setIsCreateModalOpen(false);
    message.success("Tạo báo cáo thành công!");
  };

  // 👉 Edit
  const handleEdit = (values: DebtReport) => {
    if (!selectedReport) return;
    const updated: DebtReport = { ...selectedReport, ...values };
    setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setIsEditModalOpen(false);
    message.success("Cập nhật báo cáo thành công!");
  };

  // 👉 Delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success("Đã xóa báo cáo");
      navigate(ROUTES_APP.crm.debtReportList);
    } catch (err) {
      message.error("Không thể xóa báo cáo");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  // 👉 Export (Excel/PDF)
  const handleExport = (record: DebtReport, type: "excel" | "pdf") => {
    if (type === "excel") {
      exportToExcel([record], `${record.reportNo}.xlsx`);
      message.success(`Đã xuất ${record.reportNo} sang Excel`);
    } else {
      message.info("Chưa hỗ trợ PDF, cần cài thêm jspdf + autotable");
    }
  };

  // 👉 Apply filter + search
  const filteredData = data.filter((item) => {
    const matchSearch =
      item.reportNo.toLowerCase().includes(searchText.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchText.toLowerCase());

    const matchStatus = filterStatus ? item.status === filterStatus : true;
    const matchContract = filterContract
      ? item.contract.toLowerCase().includes(filterContract.toLowerCase())
      : true;
    const matchCustomer = filterCustomer
      ? item.customer.toLowerCase().includes(filterCustomer.toLowerCase())
      : true;
    const matchDebtStatus = filterDebtStatus ? item.debtStatus === filterDebtStatus : true;
    const matchDate = filterDate
      ? item.reportDate >= filterDate[0] && item.reportDate <= filterDate[1]
      : true;

    return (
      matchSearch && matchStatus && matchContract && matchCustomer && matchDebtStatus && matchDate
    );
  });

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Báo cáo Công nợ</h2>
        <Space>
          <Search
            placeholder="Tìm theo số báo cáo / khách hàng..."
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 300 }}
          />

          {/* Filter */}
          <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
            Bộ lọc
          </Button>
          <FilterDebtReportDrawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onConfirm={() => setFilterOpen(false)}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterContract={filterContract}
            setFilterContract={setFilterContract}
            filterCustomer={filterCustomer}
            setFilterCustomer={setFilterCustomer}
            filterDebtStatus={filterDebtStatus}
            setFilterDebtStatus={setFilterDebtStatus}
          />

          {/* Delete */}
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
            okButtonProps={{ danger: true, loading: deleting }}
            centered
          >
            <p>Bạn có chắc muốn xóa báo cáo này?</p>
          </Modal>

          {/* Create */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo báo cáo
          </Button>
        </Space>
      </div>

      {/* Table */}
      <TableDebtReport
        data={filteredData}
        searchText={searchText}
        filterStatus={filterStatus}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEditClick={(record) => {
          setSelectedReport(record);
          setIsEditModalOpen(true);
        }}
        onExportClick={handleExport}
        onDetailClick={(record) =>
          navigate(generatePath(ROUTES_APP.crm.debtReportDetail, { id: record.id }))
        }
      />

      {/* Modal create → HCNS */}
      <DebtReportForm
        mode="create"
        role="HCNS"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={(values, status) => {
          const newReport: DebtReport = {
            ...values,
            id: data.length + 1,
            status: status ?? "Khởi tạo",
          };
          setData((prev) => [...prev, newReport]);
          setIsCreateModalOpen(false);
          message.success("Tạo báo cáo thành công!");
        }}
      />

      {/* Modal edit → Kế toán */}
      <DebtReportForm
        mode="edit"
        role="KETOAN"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={(values, status) => {
          if (!selectedReport) return;
          const updated: DebtReport = { ...selectedReport, ...values, status };
          setData((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
          setIsEditModalOpen(false);
          message.success(
            status === "Xác nhận" ? "Báo cáo đã được xác nhận!" : "Lưu báo cáo tạm thành công!"
          );
        }}
        initialValues={selectedReport}
      />
    </>
  );
};

export default DebtReportList;
