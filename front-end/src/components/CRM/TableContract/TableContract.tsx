import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";

export interface Product {
  key: number;
  name: string;
  type: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
}

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
  products?: Product[];
}

interface TableContractProps {
  data?: Contract[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Contract) => void;
  onShowClick?: (record: Contract) => void;
  loading?: boolean;
  selectable?: boolean;
  showEdit?: boolean;
}

const TableContract: React.FC<TableContractProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  loading = false,
  selectable = true,
  showEdit = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Contract) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Contract> = [
    {
      title: "Mã hợp đồng",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Contract) => (
        <Typography.Link
          className="contract-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(
                generatePath(ROUTES_APP.crm.contractDetail, { id: record.id }) + `?loai=hopdong`
              );
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Tổng giá trị (VND)",
      dataIndex: "total",
      key: "total",
      align: "center" as const,
      width: 150,
      render: (value?: number) => (typeof value === "number" ? value.toLocaleString("vi-VN") : "0"),
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
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
      title: "Người duyệt",
      dataIndex: "approver",
      key: "approver",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Ngày duyệt",
      dataIndex: "approvedAt",
      key: "approvedAt",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 150,
    },
    ...(showEdit
      ? [
        {
          title: "",
          key: "action",
          width: 60,
          align: "center" as const,
          render: (_: any, record: Contract) => (
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
      ]
      : []),
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

export default TableContract;