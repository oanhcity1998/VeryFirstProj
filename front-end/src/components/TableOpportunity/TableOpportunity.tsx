import { useMemo } from "react";
import { Table, Tooltip, Tag, Progress } from "antd";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { Opportunity } from "../../views/CRM/OpportunityList/OpportunityList";

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
        ? item.expectedCloseDate >= filterDate[0] && item.expectedCloseDate <= filterDate[1]
        : true;

      return matchSearch && matchPriority && matchStage && matchDate;
    });
  }, [data, searchText, filterPriority, filterStage, filterDate]);

  const columns: ColumnsType<Opportunity> = [
    {
      title: "Tên cơ hội",
      dataIndex: "name",
      key: "name",
      width: 240,
      fixed: "left",
      render: (_, record) => (
        <Link onClick={() => onShowClick?.(record)} to="#">
          <FileTextOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {record.name}
        </Link>
      ),
    },
    {
      title: "Liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      width: 180,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      width: 200,
    },
    {
      title: "Giá trị dự kiến (VND)",
      dataIndex: "expectedValue",
      key: "expectedValue",
      width: 180,
      render: (val: number) => val.toLocaleString(),
    },
    {
      title: "Ngày chốt dự kiến",
      dataIndex: "expectedCloseDate",
      key: "expectedCloseDate",
      width: 150,
    },
    {
      title: "Dịch vụ dự kiến",
      dataIndex: "service",
      key: "service",
      width: 200,
    },
    {
      title: "Xác suất",
      dataIndex: "probability",
      key: "probability",
      width: 150,
      render: (prob: number) => <Progress percent={prob} size="small" />,
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      render: (priority: string) => {
        const color = priority === "High" ? "red" : priority === "Medium" ? "orange" : "blue";
        return <Tag color={color}>{priority}</Tag>;
      },
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      width: 180,
    },
    {
      title: "Giai đoạn",
      dataIndex: "stage",
      key: "stage",
      width: 160,
      render: (stage: string) => {
        const colorMap: Record<string, string> = {
          Qualification: "blue",
          Proposal: "orange",
          Negotiation: "purple",
          "Closed Won": "green",
          "Closed Lost": "red",
        };
        return <Tag color={colorMap[stage]}>{stage}</Tag>;
      },
    },
    {
      title: "Hành động tiếp theo",
      dataIndex: "nextAction",
      key: "nextAction",
      width: 220,
    },
    {
      title: "",
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
      scroll={{ x: "max-content", y: "calc(100vh - 330px)" }}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};
