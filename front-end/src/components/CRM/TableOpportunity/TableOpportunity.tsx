import React, { useMemo } from "react";
import { Button, Space, Table, Typography, Spin } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { generatePath, useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { Opportunity } from "@/views/CRM/OpportunityList/OpportunityList";
import { ROUTES_APP } from "@/app/routes";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

interface TableOpportunityProps {
  data: Opportunity[];
  searchText: string;
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onShowClick?: (record: Opportunity) => void;
  onEditClick?: (record: Opportunity) => void;
  filterPriority: string | null;
  filterStage: string | null;
  filterDate: [string, string] | null;
  loading?: boolean;
  selectable?: boolean;
}

export const TableOpportunity: React.FC<TableOpportunityProps> = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onShowClick,
  onEditClick,
  filterPriority,
  filterStage,
  filterDate,
  loading = false,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Opportunity) => {
    if (onEditClick) {
      onEditClick(record);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText?.toLowerCase() || "";

      const matchSearch =
        (item.name ?? "").toLowerCase().includes(text) ||
        (item.company ?? "").toLowerCase().includes(text) ||
        (item.contactName ?? "").toLowerCase().includes(text);

      const matchPriority = filterPriority ? item.priority === filterPriority : true;
      const matchStage = filterStage ? item.stage === filterStage : true;

      const hasValidDateRange = Array.isArray(filterDate) && filterDate[0] && filterDate[1];

      const matchDate = hasValidDateRange
        ? dayjs(item.expectedCloseDate).isSameOrAfter(dayjs(filterDate[0]), "day") &&
          dayjs(item.expectedCloseDate).isSameOrBefore(dayjs(filterDate[1]), "day")
        : true;

      return matchSearch && matchPriority && matchStage && matchDate;
    });
  }, [data, searchText, filterPriority, filterStage, filterDate]);

  const columns: ColumnsType<Opportunity> = [
    {
      title: "Tên cơ hội",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Opportunity) => (
        <Typography.Link
          className="contract-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.opportunityDetail, { id: record.id }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Giá trị dự kiến (VND)",
      dataIndex: "expectedValue",
      key: "expectedValue",
      align: "center" as const,
      width: 150,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: "Ngày chốt dự kiến",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Dịch vụ dự kiến",
      dataIndex: "service",
      key: "service",
      align: "center" as const,
      width: 150,
      render: (services) =>
        Array.isArray(services) ? services.map((s) => <p key={s.id}>{s.productName}</p>) : "-",
    },
    {
      title: "Xác suất",
      dataIndex: "probability",
      key: "probability",
      align: "center" as const,
      width: 150,
      render: (prob: number) => <>{prob}%</>,
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Giai đoạn",
      dataIndex: "stage",
      key: "stage",
      align: "center" as const,
      width: 150,
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: Opportunity) => (
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
    <>
      {loading ? (
        <Spin />
      ) : (
        <Table<Opportunity>
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
          pagination={false}
          scroll={{ x: "max-content" }}
        />
      )}
    </>
  );
};
