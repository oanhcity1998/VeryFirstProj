import { useMemo } from "react";
import { Table, Tooltip, Tag, Progress } from "antd";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { generatePath, Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
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
  selectedRowKeys: number[];
  setSelectedRowKeys: (keys: number[]) => void;
  onShowClick?: (record: Opportunity) => void;
  onEditClick?: (record: Opportunity) => void;
  filterPriority: string | null;
  filterStage: string | null;
  filterDate: [string, string] | null;
}

export const TableOpportunity = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onShowClick,
  onEditClick,
  filterPriority,
  filterStage,
  filterDate,
}: TableOpportunityProps) => {
  // 🔎 lọc theo search
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(text) ||
        item.company.toLowerCase().includes(text) ||
        item.contactName.toLowerCase().includes(text);

      const matchPriority = filterPriority ? item.priority === filterPriority : true;
      const matchStage = filterStage ? item.stage === filterStage : true;

      const matchDate = filterDate
        ? dayjs(item.expectedCloseDate).isSameOrAfter(dayjs(filterDate[0])) &&
        dayjs(item.expectedCloseDate).isSameOrBefore(dayjs(filterDate[1]))
        : true;

      return matchSearch && matchPriority && matchStage && matchDate;
    });
  }, [data, searchText, filterPriority, filterStage, filterDate]);

  const columns: ColumnsType<Opportunity> = [
    {
      title: "Tên cơ hội",
      align: "center",
      dataIndex: "name",
      key: "name",
      width: 240,
      fixed: "left",
      render: (_, record) => (
        <Link to={generatePath(ROUTES_APP.crm.opportunityDetail, { id: record.id })}>
          <FileTextOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {record.name}
        </Link>
      ),
    },
    {
      title: "Liên hệ",
      align: "center",
      dataIndex: "contactName",
      key: "contactName",
      width: 180,
    },
    {
      title: "Công ty",
      align: "center",
      dataIndex: "company",
      key: "company",
      width: 200,
    },
    {
      title: "Giá trị dự kiến (VND)",
      align: "center",
      dataIndex: "expectedValue",
      key: "expectedValue",
      width: 180,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: "Ngày chốt dự kiến",
      align: "center",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      width: 150,
    },
    {
      title: "Dịch vụ dự kiến",
      align: "center",
      dataIndex: "service",
      key: "service",
      width: 200,
      render: (services) =>
        Array.isArray(services) ? services.map((s) => <p key={s.id}>{s.productName}</p>) : "-",
    },
    {
      title: "Xác suất",
      align: "center",
      dataIndex: "probability",
      key: "probability",
      width: 150,
      render: (prob: number) => <>{prob}%</>,
    },
    {
      title: "Ưu tiên",
      align: "center",
      dataIndex: "priority",
      key: "priority",
      width: 120,
    },
    {
      title: "Nhân viên phụ trách",
      align: "center",
      dataIndex: "owner",
      key: "owner",
      width: 180,
    },
    {
      title: "Giai đoạn",
      align: "center",
      dataIndex: "stage",
      key: "stage",
      width: 160,
    },
    {
      title: "Hành động",
      align: "center",
      key: "action",
      width: 60,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            style={{
              fontSize: 20,
              display: "block",
              cursor: "pointer",
              color: "#1890ff",
              padding: 8,
            }}
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
    <Table<Opportunity>
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys as number[]);
        },
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
