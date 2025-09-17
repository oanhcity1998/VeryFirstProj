import React, { useMemo } from "react";
import { Table, Tooltip, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Link } = Typography;

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
  selectedRowKeys?: React.Key[];
  setSelectedRowKeys?: (keys: string[]) => void;
  onEditClick?: (record: Quote) => void;
  onShowClick?: (record: Quote) => void;
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
  loading = false,
  selectable = true,
  showEdit = true,
  searchText = "",
  filterCustomer = null,
  filterMainContact = null,
}) => {
  const navigate = useNavigate();

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
      width: 150,
    },
    {
      title: "Tên báo giá",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (text, record) => (
        <Link
          className="quote-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(
                generatePath(ROUTES_APP.crm.quoteDetail, { id: record.id }) +
                `?loai=baogia`
              );
            }
          }}
        >
          {text}
        </Link>
      ),
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: 200,
    },
    {
      title: "Tổng giá trị (VND)",
      dataIndex: "total",
      key: "total",
      width: 150,
      render: (value?: number) =>
        typeof value === "number" ? value.toLocaleString("vi-VN") : "0",
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
    },
    {
      title: "Người duyệt",
      dataIndex: "approver",
      key: "approver",
      width: 150,
    },
    {
      title: "Ngày duyệt",
      dataIndex: "approvedAt",
      key: "approvedAt",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
    },
    ...(showEdit
      ? [
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
                  e.stopPropagation();
                  onEditClick?.(record);
                }}
              />
            </Tooltip>
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
            onChange: (keys) => setSelectedRowKeys(keys as string[]),
          },
        }
        : {})}
      columns={columns}
      dataSource={filteredData}
      loading={loading}
      pagination={false}
      rowKey="id"
      className="base-table"
      scroll={{ x: 1050 }}
    />
  );
};

export default TableQuote;