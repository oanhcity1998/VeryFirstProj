import React, { useMemo } from "react";
import { Table, Tooltip, Tag } from "antd";
import { EditOutlined, FileTextOutlined, DownloadOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { DebtReport } from "../../views/CRM/DebtReportList/DebtReportList";

interface TableDebtReportProps {
  data: DebtReport[];
  searchText: string;
  selectedRowKeys: number[];
  setSelectedRowKeys: (keys: number[]) => void;
  onEditClick?: (record: DebtReport) => void;
  onDetailClick?: (record: DebtReport) => void;
  onExportClick?: (record: DebtReport, type: "excel" | "pdf") => void;
  filterStatus: string | null;
}

export const TableDebtReport = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
  onDetailClick,
  onExportClick,
  filterStatus,
}: TableDebtReportProps) => {
  // 🔎 Lọc theo search + status
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText.toLowerCase();
      const matchSearch =
        item.reportNo.toLowerCase().includes(text) ||
        item.customer.toLowerCase().includes(text) ||
        item.contract.toLowerCase().includes(text);

      const matchStatus = filterStatus ? item.status === filterStatus : true;
      return matchSearch && matchStatus;
    });
  }, [data, searchText, filterStatus]);

  const columns: ColumnsType<DebtReport> = [
    {
      title: "Số báo cáo",
      dataIndex: "reportNo",
      key: "reportNo",
      width: 150,
      fixed: "left",
      render: (_, record) => (
        <span
          style={{ cursor: "pointer", color: "#1890ff" }}
          onClick={() => onDetailClick?.(record)}
        >
          <FileTextOutlined style={{ marginRight: 6 }} />
          {record.reportNo}
        </span>
      ),
    },
    {
      title: "Ngày báo cáo",
      dataIndex: "reportDate",
      key: "reportDate",
      width: 140,
      render: (val: string) => dayjs(val).format("YYYY-MM-DD"),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: 200,
    },
    {
      title: "Hợp đồng",
      dataIndex: "contract",
      key: "contract",
      width: 160,
    },
    {
      title: "Kiểm toán viên",
      dataIndex: "auditor",
      key: "auditor",
      width: 160,
    },
    {
      title: "Giám đốc phụ trách",
      dataIndex: "director",
      key: "director",
      width: 180,
    },
    {
      title: "Tổng công nợ",
      dataIndex: "totalDebt",
      key: "totalDebt",
      width: 160,
      render: (val?: number) => (val ? val.toLocaleString() : "-"),
    },
    {
      title: "Công nợ còn lại",
      dataIndex: "remainingDebt",
      key: "remainingDebt",
      width: 160,
      render: (val?: number) => (val ? val.toLocaleString() : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          "Khởi tạo": "blue",
          "Chờ kế toán": "orange",
          "Xác nhận": "green",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      fixed: "right",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined
              style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onEditClick?.(record);
              }}
            />
          </Tooltip>
          <Tooltip title="Xuất Excel">
            <DownloadOutlined
              style={{ fontSize: 18, color: "green", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onExportClick?.(record, "excel");
              }}
            />
          </Tooltip>
          <Tooltip title="Xuất PDF">
            <DownloadOutlined
              style={{ fontSize: 18, color: "red", cursor: "pointer" }}
              onClick={(e) => {
                e.stopPropagation();
                onExportClick?.(record, "pdf");
              }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table<DebtReport>
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as number[]),
      }}
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      scroll={{ x: "max-content", y: "calc(100vh - 150px)" }}
      pagination={{
        pageSize: 10,
        position: ["bottomCenter"],
      }}
    />
  );
};
