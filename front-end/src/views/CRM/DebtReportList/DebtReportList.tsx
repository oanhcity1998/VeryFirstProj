import { useState } from "react";
import { Button, Space, Modal, message, Popover, Upload } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  FilterOutlined,
  SettingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { generatePath, useNavigate } from "react-router-dom";
import { TableDebtReport } from "../../../components/TableDebtReport/TableDebtReport";
import { FilterDebtReportDrawer } from "../../../components/Filter/FilterDebtReportDrawer";
import { ROUTES_APP } from "../../../routes";
import { normalizeDebtReport } from "./debtReport.utils";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { DebtReportForm } from "../../../components/DebtReportForm/DebtReportForm";
dayjs.extend(isBetween);

// 👉 Hóa đơn
export interface Invoice {
  invoiceNo: string; // Số hóa đơn
  invoiceDate: string; // Ngày hóa đơn (YYYY-MM-DD)
  rate?: number; // Tỉ lệ suất (%)
  amountNoVAT?: number; // Giá trị chưa VAT
  status?: "Thanh toán" | "Chưa thanh toán"; // Trạng thái hóa đơn
  totalAmount?: number; // Tổng giá trị hóa đơn
}

// 👉 Thanh toán
export interface Payment {
  paymentCode: string; // Mã thanh toán
  paymentDate: string; // Ngày thu tiền (YYYY-MM-DD)
  amount: number; // Số tiền đã thu
  method: "Tiền mặt" | "Chuyển khoản"; // Phương thức thanh toán
  status?: "Thanh toán" | "Chưa thanh toán"; // Trạng thái thanh toán
}

// 👉 Cộng tác viên
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
  status: "Khởi tạo" | "Chờ kế toán" | "Xác nhận" | "Hủy"; // Trạng thái báo cáo

  // 👉 Thông tin chờ kế toán
  exchangeRate?: number; // Tỉ giá
  feeUSD?: number; // Phí USD
  feeVND?: number; // Phí VNĐ
  feeNoVAT?: number; // Phí chưa VAT
  feeWithVAT?: number; // Phí gồm VAT

  // 👉 Hóa đơn
  invoice?: Invoice;

  // 👉 Thanh toán
  payments?: Payment[];

  // 👉 Công nợ
  debtNoVAT?: number; // Số tiền chưa VAT
  debtWithVAT?: number; // Số tiền đã VAT
  totalDebtRemaining?: number; // Tổng công nợ còn phải thu (đã VAT)
  badDebt?: number; // Nợ khó đòi

  // 👉 Hoa hồng cộng tác viên
  collaborator?: Collaborator;

  // 👉 Thông tin tổng hợp cũ
  totalDebt?: number; // Tổng công nợ
  remainingDebt?: number; // Công nợ còn lại
  debtStatus?: "Chưa thanh toán" | "Thanh toán một phần" | "Đã thanh toán" | "Khó đòi"; // Trạng thái công nợ
}

export const mockDebtReportData: DebtReport[] = [
  {
    // 👉 Thông tin khởi tạo
    id: 1,
    reportNo: "BCN-001",
    reportDate: "2025-09-01",
    contract: "HĐ-2025-01",
    customer: "Công ty ABC",
    auditor: "Nguyễn Văn A",
    director: "Trần Văn B",
    status: "Khởi tạo",

    // 👉 Thông tin chờ kế toán
    exchangeRate: 25000,
    feeUSD: 40,
    feeNoVAT: 900000,
    feeVND: 1000000,
    feeWithVAT: 1100000,

    // 👉 Hóa đơn
    invoice: {
      invoiceNo: "INV-001",
      invoiceDate: "2025-09-02",
      rate: 10,
      amountNoVAT: 500000,
      status: "Thanh toán",
      totalAmount: 550000,
    },

    // 👉 Thanh toán
    payments: [
      {
        paymentCode: "PMT-001",
        amount: 200000,
        paymentDate: "2025-09-03",
        method: "Chuyển khoản",
        status: "Thanh toán",
      },
    ],

    // 👉 Công nợ
    debtNoVAT: 900000,
    debtWithVAT: 982000,
    totalDebtRemaining: 300000,
    badDebt: 0,

    // 👉 Hoa hồng cộng tác viên
    collaborator: {
      name: "Nguyễn Văn CTV",
      phone: "0901234567",
      commissionRate: 5,
      amount: 25000,
      remainingAmount: 12500,
    },

    // 👉 Thông tin tổng hợp
    totalDebt: 982000,
    remainingDebt: 300000,
    debtStatus: "Thanh toán một phần",
  },
];

const exportDebtReportsToExcel = (reports: DebtReport[], fileName = "debt-reports.xlsx") => {
  if (!reports.length) return;

  const workbook = XLSX.utils.book_new();

  // Sheet chính: thông tin tổng hợp
  const mainSheet = XLSX.utils.json_to_sheet(
    reports.map((r) => ({
      "Số báo cáo": r.reportNo,
      "Ngày báo cáo": dayjs(r.reportDate).format("DD/MM/YYYY"),
      "Khách hàng": r.customer,
      "Hợp đồng": r.contract,
      "Trạng thái báo cáo": r.status,
      "Trạng thái công nợ": r.debtStatus ?? "-",
      "Tổng công nợ": r.totalDebt ? Intl.NumberFormat("vi-VN").format(r.totalDebt) : "-",
      "Còn lại": r.remainingDebt ? Intl.NumberFormat("vi-VN").format(r.remainingDebt) : "-",
    }))
  );
  XLSX.utils.book_append_sheet(workbook, mainSheet, "Tổng hợp");

  // Sheet hóa đơn
  const allInvoices: any[] = [];
  reports.forEach((r) => {
    if (r.invoice) {
      const inv = r.invoice;
      allInvoices.push({
        "Báo cáo": r.reportNo,
        "Hóa đơn": inv.invoiceNo,
        Ngày: dayjs(inv.invoiceDate).format("DD/MM/YYYY"),
        "Tỉ lệ (%)": inv.rate ?? "-",
        "Giá trị chưa VAT": inv.amountNoVAT
          ? Intl.NumberFormat("vi-VN").format(inv.amountNoVAT)
          : "-",
        "Trạng thái": inv.status ?? "-",
        "Tổng giá trị": inv.totalAmount ? Intl.NumberFormat("vi-VN").format(inv.totalAmount) : "-",
      });
    }
  });
  const invoiceSheet = XLSX.utils.json_to_sheet(allInvoices);
  XLSX.utils.book_append_sheet(workbook, invoiceSheet, "Hóa đơn");

  // Sheet thanh toán
  const allPayments: any[] = [];
  reports.forEach((r) => {
    (r.payments || []).forEach((pmt) => {
      allPayments.push({
        "Báo cáo": r.reportNo,
        "Mã thanh toán": pmt.paymentCode,
        "Ngày thu tiền": dayjs(pmt.paymentDate).format("DD/MM/YYYY"),
        "Số tiền đã thu": pmt.amount ? Intl.NumberFormat("vi-VN").format(pmt.amount) : "-",
        "Phương thức": pmt.method,
        "Trạng thái": pmt.status ?? "-",
      });
    });
  });
  const paymentSheet = XLSX.utils.json_to_sheet(allPayments);
  XLSX.utils.book_append_sheet(workbook, paymentSheet, "Thanh toán");

  // Sheet CTV
  const allCTVs: any[] = [];
  reports.forEach((r) => {
    if (r.collaborator) {
      const ctv = r.collaborator;
      allCTVs.push({
        "Báo cáo": r.reportNo,
        "Tên CTV": ctv.name,
        SĐT: ctv.phone ?? "-",
        "Tỷ lệ hoa hồng (%)": ctv.commissionRate ?? "-",
        "Số tiền hoa hồng": ctv.amount ? Intl.NumberFormat("vi-VN").format(ctv.amount) : "-",
        "Còn phải chi": ctv.remainingAmount
          ? Intl.NumberFormat("vi-VN").format(ctv.remainingAmount)
          : "-",
      });
    }
  });
  const ctvSheet = XLSX.utils.json_to_sheet(allCTVs);
  XLSX.utils.book_append_sheet(workbook, ctvSheet, "CTV");

  // Xuất file
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
  const handleCreate = (report: DebtReport) => {
    const newReport: DebtReport = { ...report, id: data.length + 1 };
    const normalized = normalizeDebtReport(newReport); // normalize sau khi có id
    setData((prev) => [...prev, normalized]);
    setIsCreateModalOpen(false);
    message.success("Tạo báo cáo thành công!");
  };

  // 👉 Edit
  const handleEdit = (report: DebtReport) => {
    if (!selectedReport) return;
    const updated: DebtReport = { ...selectedReport, ...report };
    const normalized = normalizeDebtReport(updated); // normalize khi update
    setData((prev) => prev.map((r) => (r.id === updated.id ? normalized : r)));
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
    } catch (err) {
      message.error("Không thể xóa báo cáo");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
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
                  disabled={!selectedRowKeys.length}
                  onClick={() => {
                    if (!selectedRowKeys.length) {
                      message.warning("Vui lòng chọn ít nhất 1 báo cáo để xuất");
                      return;
                    }
                    const reportsToExport = data.filter((r) => selectedRowKeys.includes(r.id));
                    exportDebtReportsToExcel(
                      reportsToExport,
                      `debt-reports-${dayjs().format("YYYYMMDD_HHmmss")}.xlsx`
                    );
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
        onOk={(values, status) => handleEdit({ ...values, status } as DebtReport)}
        initialValues={selectedReport}
      />
    </>
  );
};

export default DebtReportList;
