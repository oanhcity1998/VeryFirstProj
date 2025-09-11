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
  filterStatus: string | null;
}

export const TableDebtReport = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
  onDetailClick,
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
      align: "center",
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
      title: "Ngày lập",
      align: "center",
      dataIndex: "reportDate",
      key: "reportDate",
      width: 140,
      render: (val: string) => dayjs(val).format("YYYY-MM-DD"),
    },
    {
      title: "Hợp đồng",
      align: "center",
      dataIndex: "contract",
      key: "contract",
      width: 160,
    },
    {
      title: "Khách hàng",
      align: "center",
      dataIndex: "customer",
      key: "customer",
      width: 200,
    },
    {
      title: "Kiểm toán viên",
      align: "center",
      dataIndex: "auditor",
      key: "auditor",
      width: 200,
      render(value) {
        if (!value || value.length === 0) return "-";

        const auditors = Array.isArray(value) ? value : [value];

        return (
          <>
            {auditors.map((name) => (
              <p key={name}>{name}</p>
            ))}
          </>
        );
      },
    },
    {
      title: "Giám đốc",
      align: "center",
      dataIndex: "director",
      key: "director",
      width: 180,
    },
    {
      title: "Trạng thái công nợ",
      align: "center",
      dataIndex: "debtStatus",
      key: "debtStatus",
      width: 140,
    },
    {
      title: "Trạng thái báo cáo",
      align: "center",
      dataIndex: "status",
      key: "status",
      width: 140,
    },
    {
      title: "Tổng nợ còn lại",
      align: "center",
      dataIndex: "totalDebtRemaining",
      key: "totalDebtRemaining",
      width: 140,
      render: (value: number) => {
        if (value == null) return "-";
        return <span>{value.toLocaleString()} ₫</span>;
      },
    },
    {
      title: "Hành động",
      align: "center",
      key: "action",
      width: 70,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }}
            onClick={(e) => {
              e.stopPropagation();
              onEditClick?.(record);
            }}
          />
        </Tooltip>
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
