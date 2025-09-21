import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";

interface Lead {
  id: string;
  leadName: string;
  contactName: string;
  email: string;
  phone: string;
  priority: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface TableLeadProps {
  data?: Lead[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Lead) => void;
  onShowClick?: (record: Lead) => void;
  loading?: boolean;
  selectable?: boolean;
}

const TableLead: React.FC<TableLeadProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  loading = false,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Lead) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Lead> = [
    {
      title: "Tên lead",
      dataIndex: "leadName",
      key: "leadName",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Lead) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.leadDetail, { id: record.id }));
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Tên liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      align: "center" as const,
      width: 150,
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
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      align: "center" as const,
      width: 150,
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: Lead) => (
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

export default TableLead;