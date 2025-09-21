import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { Department } from "@/models/HRM/department.model";

interface TableDepartmentProps {
  data?: Department[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Department) => void;
  onShowClick?: (record: Department) => void;
  selectable?: boolean;
  loading?: boolean;
}

const TableDepartment: React.FC<TableDepartmentProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  selectable = true,
  loading = false,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Department) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Department> = [
    {
      title: "Mã phòng ban",
      dataIndex: "code",
      key: "code",
      align: "center",
      width: 120,
      fixed: "left",
      render: (code: string | null, record: Department) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(`/crm/department/${record.id}`);
            }
          }}
        >
          {code || "-"}
        </Typography.Link>
      ),
    },
    {
      title: "Tên phòng ban",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 200,
    },
    {
      title: "Trưởng phòng",
      dataIndex: "manager_name",
      key: "manager_name",
      align: "center",
      width: 150,
      render: (manager_name: string | null) => manager_name || "-",
    },
    {
      title: "Số nhân viên",
      dataIndex: "employee_count",
      key: "employee_count",
      align: "center",
      width: 100,
      render: (count: number | undefined) => count ?? "-",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      width: 200,
      render: (note: string | null) => note || "-",
    },
    {
      title: "",
      key: "action",
      width: 80,
      align: "center",
      render: (_: any, record: Department) => (
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
    <Table
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
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TableDepartment;