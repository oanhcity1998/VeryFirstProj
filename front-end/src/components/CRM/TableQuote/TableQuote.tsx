import React from "react";
import { Table, Typography, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, generatePath } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "@/app/routes";



const { Link } = Typography;

export interface Contract {
  id: string;
  code: string;
  name: string;
  type: string;
  customer: string;
  total: number;
  owner: string;
  createdAt: string;
  approver: string;
  approvedAt: string;
  status: string;
}

interface TableContractProps {
  data: Contract[];
  selectedRowKeys: React.Key[];
  onSelectChange: (keys: React.Key[]) => void;
  onRow?: (record: Contract) => React.HTMLAttributes<HTMLElement>;
  onEditClick?: (record: Contract) => void; // ✅ add callback
}

const TableQuote: React.FC<TableContractProps> = ({
  data,
  selectedRowKeys,
  onSelectChange,
  onRow,
  onEditClick,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<Contract> = [
    { title: "Mã báo giá", dataIndex: "code", key: "code" },
    {
      title: "Tên báo giá",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link
          className="contract-link"
          onClick={() => navigate(generatePath(ROUTES_APP.crm.quoteDetail, { id: record.id }))}
        >
          {text}
        </Link>
      ),
    },
    { title: "Khách hàng", dataIndex: "customer", key: "customer" },
    {
      title: "Tổng giá trị",
      dataIndex: "total",
      key: "total",
      render: (val) => val.toLocaleString("vi-VN"),
    },
    { title: "Nhân viên phụ trách", dataIndex: "owner", key: "owner" },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
    { title: "Người duyệt", dataIndex: "approver", key: "approver" },
    { title: "Ngày duyệt", dataIndex: "approvedAt", key: "approvedAt" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },

    // ✅ New action column like in TableQuotation
    {
      title: "",
      key: "action",
      width: 80,
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            style={{
              fontSize: 20,
              cursor: "pointer",
              color: "#1890ff",
              padding: 8,
            }}
            onClick={(e) => {
              e.stopPropagation(); // prevent row click
              onEditClick?.(record);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <Table
      rowSelection={rowSelection}
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{ pageSize: 5, position: ["bottomCenter"] }}
      className="base-table"
      onRow={onRow}
    />
  );
};

export default TableQuote;
