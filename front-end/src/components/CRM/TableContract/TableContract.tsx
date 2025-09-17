import React from "react";
import { Table, Checkbox, Button, Typography, Tooltip } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Link } = Typography;

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
  selectedRowKeys?: string[];
  setSelectedRowKeys?: (keys: string[]) => void;
  onEditClick?: (record: Contract) => void;
  onEdit?: (record: Contract) => void;
  onRowClick?: (record: Contract) => void;
  loading?: boolean;
  showEdit?: boolean;
}

const TableContract: React.FC<TableContractProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEditClick,
  onRowClick,
  loading = false,
  showEdit = true,
}) => {
  const navigate = useNavigate();
  const allKeys = data.map((item) => item.id);
  const isAllChecked = selectedRowKeys.length === data.length && data.length > 0;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns: ColumnsType<Contract> = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => {
            if (e.target.checked && setSelectedRowKeys) {
              setSelectedRowKeys(allKeys);
            } else if (setSelectedRowKeys) {
              setSelectedRowKeys([]);
            }
          }}
          disabled={data.length === 0 || !setSelectedRowKeys}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left",
      align: "center",
      render: (_: any, record: Contract) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked && setSelectedRowKeys) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else if (setSelectedRowKeys) {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
            }
          }}
          disabled={!setSelectedRowKeys}
        />
      ),
    },
    {
      title: "Mã hợp đồng",
      dataIndex: "code",
      key: "code",
      width: 150,
      align: "center",
      fixed: "left",
    },
    {
      title: "Tên hợp đồng",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center" as const,
      render: (text: string, record: Contract) =>
        showEdit ? (
          <Link
            className="contract-link"
            onClick={() => {
              if (onRowClick) {
                onRowClick(record);
              } else {
                navigate(
                  generatePath(ROUTES_APP.crm.contractDetail, { id: record.id }) +
                  `?loai=hopdong`
                );
              }
            }}
          >
            {text}
          </Link>
        ) : (
          <>{text}</>
        ),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      align: "center",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      width: 150,
      align: "center",
    },
    {
      title: "Tổng giá trị (VND)",
      dataIndex: "total",
      key: "total",
      width: 150,
      align: "center",
      render: (value?: number) =>
        typeof value === "number" ? value.toLocaleString("vi-VN") : "0",
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      width: 200,
      align: "center",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      align: "center",
    },
    {
      title: "Người duyệt",
      dataIndex: "approver",
      key: "approver",
      width: 150,
      align: "center",
    },
    {
      title: "Ngày duyệt",
      dataIndex: "approvedAt",
      key: "approvedAt",
      width: 120,
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      align: "center",
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
      className="base-table"
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={false}
      rowKey="id"
      scroll={{ x: 1200 }}
      rowClassName={(record: Contract) =>
        selectedRowKeys.includes(record.id) ? "selected-row" : ""
      }
      onRow={(record) => ({
        onClick: () => onRowClick?.(record),
      })}
    />
  );
};

export default TableContract;