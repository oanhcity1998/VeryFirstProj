import React from "react";
import { Table, Typography, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useNavigate, generatePath } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "@/app/routes";

import "./TableQuote.css"


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
    { title: "Mã báo giá", width: 110, align: "center", dataIndex: "code", key: "code" },
    {
      title: "Tên báo giá",
      align: "center",
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
    { title: "Khách hàng", align: "center", dataIndex: "customer", key: "customer" },
    {
      title: "Tổng giá trị",
      align: "center",
      dataIndex: "total",
      key: "total",
      render: (val) => val.toLocaleString("vi-VN"),
    },
    { title: "Nhân viên phụ trách", align: "center", dataIndex: "owner", key: "owner" },
    { title: "Ngày tạo", align: "center", dataIndex: "createdAt", key: "createdAt" },
    { title: "Người duyệt", align: "center", dataIndex: "approver", key: "approver" },
    { title: "Ngày duyệt", align: "center", dataIndex: "approvedAt", key: "approvedAt" },
    { title: "Trạng thái", align: "center", dataIndex: "status", key: "status" },

    // ✅ New action column like in TableQuotation
    {
      title: "",
      align: "center",
      key: "action",
      width: 60,
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            className="quote-edit-icon"
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
      className="contract-table"
      onRow={onRow}
    />
  );
};

export default TableQuote;
