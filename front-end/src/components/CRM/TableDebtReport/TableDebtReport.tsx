import React, { useMemo } from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import dayjs from "dayjs";
import { DebtReport } from "@/views/CRM/DebtReportList/DebtReportList";
import { ROUTES_APP } from "@/app/routes";

interface TableDebtReportProps {
  data: DebtReport[];
  searchText: string;
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEditClick?: (record: DebtReport) => void;
  onShowClick?: (record: DebtReport) => void;
  filterStatus: string | null;
  selectable?: boolean;
}

export const TableDebtReport: React.FC<TableDebtReportProps> = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
  onShowClick,
  filterStatus,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: DebtReport) => {
    if (onEditClick) {
      onEditClick(record);
    }
  };

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
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: DebtReport) => (
        <Typography.Link
          className="contract-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.debtReportDetail, { id: record.id }));
            }
          }}
        >
          <FileTextOutlined className="icon-link" />
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Ngày lập",
      dataIndex: "reportDate",
      key: "reportDate",
      align: "center" as const,
      width: 150,
      render: (val: string) => dayjs(val).format("YYYY-MM-DD"),
    },
    {
      title: "Hợp đồng",
      dataIndex: "contract",
      key: "contract",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Kiểm toán viên",
      dataIndex: "auditor",
      key: "auditor",
      align: "center" as const,
      width: 150,
      render: (value) => {
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
      dataIndex: "director",
      key: "director",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái công nợ",
      dataIndex: "debtStatus",
      key: "debtStatus",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái báo cáo",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Tổng nợ còn lại",
      dataIndex: "totalDebtRemaining",
      key: "totalDebtRemaining",
      align: "center" as const,
      width: 150,
      render: (value: number) => {
        if (value == null) return "-";
        return <span>{value.toLocaleString()} ₫</span>;
      },
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: DebtReport) => (
        <Space size="middle">
          <Button
            className="base-edit-icon"
            type="link"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table<DebtReport>
      {...(selectable && setSelectedRowKeys
        ? {
          rowSelection: {
            selectedRowKeys,
            onChange: (keys: Key[]) => setSelectedRowKeys(keys),
          },
        }
        : {})}
      className="base-table"
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={false}
    />
  );
};