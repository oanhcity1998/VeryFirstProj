import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { Position } from "@/models/HRM/position.model";

interface TablePositionProps {
  data?: Position[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Position) => void;
  onShowClick?: (record: Position) => void;
  loading?: boolean;
  selectable?: boolean;
}

const TablePosition: React.FC<TablePositionProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  loading = false,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Position) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Position> = [
    {
      title: "Mã chức vụ",
      dataIndex: "code",
      key: "code",
      align: "center",
      width: 120,
      fixed: "left",
      render: (code: string | null, record: Position) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(`/crm/position/${record.id}`);
            }
          }}
        >
          {code || "-"}
        </Typography.Link>
      ),
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 200,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority_level",
      key: "priority_level",
      align: "center",
      width: 100,
      render: (priority: number | null) => priority ?? "-",
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
      render: (_: any, record: Position) => (
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

export default TablePosition;