import React, { useMemo } from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ROUTES_APP } from "@/app/routes";

export interface Quote {
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

interface TableQuoteProps {
  data: Quote[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEditClick?: (record: Quote) => void;
  onShowClick?: (record: Quote) => void;
  onRowClick?: (record: Quote) => void;
  loading?: boolean;
  selectable?: boolean;
  showEdit?: boolean;
  searchText?: string;
  filterCustomer?: string | null;
  filterMainContact?: string | null;
}

const TableQuote: React.FC<TableQuoteProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEditClick,
  onShowClick,
  onRowClick,
  loading = false,
  selectable = true,
  showEdit = true,
  searchText = "",
  filterCustomer = null,
  filterMainContact = null,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Quote) => {
    if (onEditClick) {
      onEditClick(record);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const text = searchText.toLowerCase();
      const matchSearch =
        item.name.toLowerCase().includes(text) ||
        item.customer.toLowerCase().includes(text) ||
        item.code.toLowerCase().includes(text);
      const matchCustomer = filterCustomer ? item.customer === filterCustomer : true;
      const matchMainContact = filterMainContact ? item.owner === filterMainContact : true;
      return matchSearch && matchCustomer && matchMainContact;
    });
  }, [data, searchText, filterCustomer, filterMainContact]);

  const columns: ColumnsType<Quote> = [
    {
      title: "Mã báo giá",
      dataIndex: "code",
      key: "code",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
    },
    {
      title: "Tên báo giá",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Quote) =>
        showEdit ? (
          <Typography.Link
            className="contract-link"
            onClick={() => {
              if (onShowClick) {
                onShowClick(record);
              } else if (onRowClick) {
                onRowClick(record);
              } else {
                navigate(
                  generatePath(ROUTES_APP.crm.quoteDetail, { id: record.id }) + `?loai=baogia`
                );
              }
            }}
          >
            {text}
          </Typography.Link>
        ) : (
          <>{text}</>
        ),
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
      width: 250,
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
          render: (_: any, record: Quote) => (
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
      dataSource={filteredData}
      loading={loading}
      pagination={false}
      rowKey="id"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TableQuote;