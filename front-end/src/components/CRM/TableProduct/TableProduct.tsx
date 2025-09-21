import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";

export interface Product {
  id: string;
  name: string;
  description: string;
  type: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  priceAfterVatVND: number;
  priceAfterVatUSD: number;
}

interface TableProductProps {
  data?: Product[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: Product) => void;
  onShowClick?: (record: Product) => void;
  loading?: boolean;
  selectable?: boolean;
}

const TableProduct: React.FC<TableProductProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  loading = false,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Product) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<Product> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Product) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(`/crm/productlist/${record.id}`);
            }
          }}
        >
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "type",
      key: "type",
      align: "center" as const,
      width: 150,
      render: (value: string) => (value === "package" ? "Theo gói" : "Theo tháng"),
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      align: "center" as const,
      width: 150,
      render: (value: number) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      align: "center" as const,
      width: 150,
      render: (value: number) => value.toLocaleString("en-US"),
    },
    {
      title: "VAT (%)",
      dataIndex: "vat",
      key: "vat",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Giá sau VAT (VND)",
      dataIndex: "priceAfterVatVND",
      key: "priceAfterVatVND",
      align: "center" as const,
      width: 150,
      render: (value: number) => value.toLocaleString("vi-VN"),
    },
    {
      title: "Giá sau VAT (USD)",
      dataIndex: "priceAfterVatUSD",
      key: "priceAfterVatUSD",
      align: "center" as const,
      width: 150,
      render: (value: number) => value.toLocaleString("en-US"),
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: Product) => (
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

export default TableProduct;