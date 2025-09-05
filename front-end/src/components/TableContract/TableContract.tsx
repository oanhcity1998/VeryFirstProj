import React from "react";
import { Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { generatePath, useNavigate } from "react-router-dom";
import { ROUTES_APP } from "../../routes";

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
}

const TableContract: React.FC<TableContractProps> = ({
  data,
  selectedRowKeys,
  onSelectChange,
  onRow,
}) => {
  const navigate = useNavigate();

  const columns: ColumnsType<Contract> = [
    { title: "Mã báo giá/ hợp đồng", dataIndex: "code", key: "code" },
    {
      title: "Tên báo giá/hợp đồng",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <Link
          className="contract-link"
          onClick={() => navigate(generatePath(ROUTES_APP.crm.contractDetail, { id: record.id }))}
        >
          {text}
        </Link>
      ),
    },
    { title: "Loại", dataIndex: "type", key: "type" },
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
      pagination={{ pageSize: 5 }}
      className="contract-table"
      onRow={onRow}
    />
  );
};

export default TableContract;
