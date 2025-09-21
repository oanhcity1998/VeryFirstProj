import React, { useMemo } from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { generatePath, useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { Product, Quotation } from "@/views/CRM/QuotationList/QuotationList";
import { ROUTES_APP } from "@/app/routes";

interface TableQuotationProps {
  data: Quotation[];
  searchText: string;
  filterProduct: string | null;
  filterVat: number | null;
  filterStatus: Quotation["status"] | null;
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onShowClick?: (record: Quotation) => void;
  onEditClick?: (record: Quotation) => void;
  getSummary: (products: Product[]) => {
    totalBeforeVat: number;
    vat5: number;
    vat10: number;
  };
  selectable?: boolean;
}

export const TableQuotation: React.FC<TableQuotationProps> = ({
  data,
  searchText,
  filterProduct,
  filterVat,
  filterStatus,
  selectedRowKeys,
  setSelectedRowKeys,
  onShowClick,
  onEditClick,
  getSummary,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: Quotation) => {
    if (onEditClick) {
      onEditClick(record);
    }
  };

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.quotationName.toLowerCase().includes(searchText.toLowerCase());

      const matchProduct = filterProduct
        ? item.products.some((p) =>
          p.productName.toLowerCase().includes(filterProduct.toLowerCase())
        )
        : true;

      const matchVat = filterVat !== null ? item.products.some((p) => p.vat === filterVat) : true;

      const matchStatus = filterStatus ? item.status === filterStatus : true;

      return matchSearch && matchProduct && matchVat && matchStatus;
    });
  }, [data, searchText, filterProduct, filterVat, filterStatus]);

  const columns: ColumnsType<Quotation> = [
    {
      title: "Tên mẫu báo giá",
      dataIndex: "quotationName",
      key: "quotationName",
      align: "center" as const,
      width: 150,
      fixed: "left" as const,
      render: (text: string, record: Quotation) => (
        <Typography.Link
          className="contract-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.crm.quotationDetail, { id: record.id }));
            }
          }}
        >
          <FileTextOutlined className="icon-link" />
          {text}
        </Typography.Link>
      ),
    },
    {
      title: "Thời hạn hiệu lực",
      dataIndex: "validityPeriod",
      key: "validityPeriod",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Điều khoản thanh toán",
      dataIndex: "paymentTerms",
      key: "paymentTerms",
      align: "center" as const,
      width: 150,
    },
    {
      title: "Sản phẩm",
      dataIndex: "products",
      key: "products",
      align: "center" as const,
      width: 150,
      render: (products: Product[]) =>
        Array.isArray(products) ? products.map((p) => p.productName).join(", ") : "",
    },
    {
      title: "Tổng chưa VAT (VND)",
      dataIndex: "products",
      key: "totalBeforeVat",
      align: "center" as const,
      width: 150,
      render: (products: Product[]) => getSummary(products).totalBeforeVat.toLocaleString(),
    },
    {
      title: "VAT 5% (VND)",
      dataIndex: "products",
      key: "vat5",
      align: "center" as const,
      width: 150,
      render: (products: Product[]) => getSummary(products).vat5.toLocaleString(),
    },
    {
      title: "VAT 10% (VND)",
      dataIndex: "products",
      key: "vat10",
      align: "center" as const,
      width: 150,
      render: (products: Product[]) => getSummary(products).vat10.toLocaleString(),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center" as const,
      width: 150,
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center" as const,
      render: (_: any, record: Quotation) => (
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
    <Table<Quotation>
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
      rowKey="id"
      scroll={{ x: "max-content" }}
      pagination={false}
    />
  );
};