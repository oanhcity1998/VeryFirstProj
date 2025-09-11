// src/components/TableLead/TableLead.tsx
import { Table, Tooltip, Button, Typography } from "antd";
import { generatePath, Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import "./TableLead.css"; // ✅ import css
import { ROUTES_APP } from "@/app/routes";

export interface Lead {
  id: number;
  leadName: string;
  contactName: string;
  email: string;
  phone: string;
  priority: string;
  owner: string;
  status: string;
}

interface TableLeadProps {
  data: any[];
  searchText: string;
  selectedRowKeys: React.Key[];
  setSelectedRowKeys: (keys: number[]) => void;
  onEdit: (record: any) => void;
}

const TableLead = ({
  data,
  searchText,
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
}: TableLeadProps) => {
  const filteredData = data.filter((item) =>
    item.leadName.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns: ColumnsType<Lead> = [
    {
      title: "Tên lead",
      dataIndex: "leadName",
      key: "leadName",
      render: (_: any, record: any) => (
        <Link to={generatePath(ROUTES_APP.crm.leadDetail, { id: record.id })}>
          {record.leadName}
        </Link> // 👈 link
      ),
    },
    { title: "Tên liên hệ", dataIndex: "contactName", key: "contactName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { title: "Ưu tiên", dataIndex: "priority", key: "priority" },
    { title: "Nhân viên phụ trách", dataIndex: "owner", key: "owner" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: any) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit(record)}
          className="lead-edit-icon"
        ></Button>
      ),
    },
  ];

  return (
    <Table<Lead>
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => setSelectedRowKeys(keys as number[]),
      }}
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default TableLead;
