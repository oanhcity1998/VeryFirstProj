import { useState } from "react";
import { Button, Space, Modal, message, Popover, Upload } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  DownloadOutlined,
  SettingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { generatePath, useNavigate } from "react-router-dom";
import { DebtReportForm } from "../../../components/DebtReportForm/DebtReportForm";
import { TableDebtReport } from "../../../components/TableDebtReport/TableDebtReport";
import { FilterDebtReportDrawer } from "../../../components/Filter/FilterDebtReportDrawer";
import { ROUTES_APP } from "../../../routes";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

export interface Invoice {
  invoiceNo: string; // Số hóa đơn
  invoiceDate: string; // Ngày hóa đơn (YYYY-MM-DD)
  rate?: number; // Tỉ lệ suất (%)
  amountNoVAT?: number; // Giá trị chưa VAT
  status?: "Thanh toán" | "Chưa thanh toán"; // Trạng thái hóa đơn
  totalAmount?: number; // Tổng giá trị hóa đơn
}

export interface Payment {
  paymentCode: string; // Mã thanh toán
  paymentDate: string; // Ngày thu tiền (YYYY-MM-DD)
  amount: number; // Số tiền đã thu
  method: "Tiền mặt" | "Chuyển khoản"; // Phương thức thanh toán
  status?: "Thanh toán" | "Chưa thanh toán"; // Trạng thái thanh toán
}

export interface Collaborator {
  name: string; // Tên cộng tác viên
  phone?: string; // Số điện thoại
  commissionRate?: number; // Tỷ lệ hoa hồng (%)
  amount?: number; // Số tiền hoa hồng
  remainingAmount?: number; // 👉 Số tiền còn phải chi
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
  exchangeRate?: number; // Tỉ giá
  feeUSD?: number; // Phí USD
  feeVND?: number; // Phí VNĐ
  feeNoVAT?: number; // Phí chưa VAT
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
    exchangeRate: 25000,
    feeUSD: 40,
    feeNoVAT: 900000,
    feeVND: 1000000,
    feeWithVAT: 1100000,
    invoices: [
      {
        invoiceNo: "INV-001",
        invoiceDate: "2025-09-02",
        rate: 10,
        amountNoVAT: 500000,
        status: "Thanh toán",
        totalAmount: 550000,
      },
    ],
    payments: [
      {
        paymentCode: "PMT-001",
        amount: 200000,
        paymentDate: "2025-09-03",
        method: "Chuyển khoản",
        status: "Thanh toán",
      },
    ],
    collaborators: [
      {
        name: "Nguyễn Văn CTV",
        phone: "0901234567",
        commissionRate: 5,
        amount: 25000,
        remainingAmount: 12500,
      },
    ],
    debtNoVAT: 500000,
    debtWithVAT: 550000,
    totalDebtRemaining: 300000,
    badDebt: 0,
    remainingDebt: 300000,
    totalDebt: 550000,
  },
];

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
      ? dayjs(item.reportDate).isBetween(filterDate[0], filterDate[1], "day", "[]")
      : true;

    return (
      matchSearch && matchStatus && matchContract && matchCustomer && matchDebtStatus && matchDate
    );
  });

  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  // upload handler
  const handleUpload = async (file) => {
    setImporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake API call
      message.success(`${file.name} đã được import thành công`);
      setImportOpen(false);
    } catch (err) {
      message.error("Import thất bại");
    } finally {
      setImporting(false);
    }
    return false;
  };
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

          {/* Cài đặt */}
          <Popover
            content={
              <Space direction="vertical">
                <Button type="text" onClick={() => setImportOpen(true)}>
                  {/* must have onClick to trigger */}
                  Import
                </Button>
                <Button
                  type="text"
                  onClick={() => {
                    console.log("Export clicked");
                    if (!selectedReport) {
                      message.warning("Vui lòng chọn báo cáo trước khi export");
                      return;
                    }
                    handleExport(selectedReport, "excel");
                  }}
                >
                  Export
                </Button>
              </Space>
            }
            trigger="click"
            placement="bottom"
          >
            <Button icon={<SettingOutlined />}>Cài đặt</Button>
          </Popover>
          <Modal
            open={importOpen}
            title="Import dữ liệu"
            onCancel={() => setImportOpen(false)}
            footer={null}
            centered
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={importing}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây để Import</p>
              <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
            </Upload.Dragger>
          </Modal>
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
