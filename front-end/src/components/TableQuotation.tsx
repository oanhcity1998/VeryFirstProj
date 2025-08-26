import { Table } from "antd";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { ColumnsType } from "antd/es/table";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

// Interface Quotation
export interface Quotation {
  id: number;
  quotationName: string;
  validityPeriod: string;
  paymentTerms: string;
  Products: { id: number; name: string }[];
  priceVND: number;
  priceUSD: number;
  vat: number;
  status: "Draft" | "Sent" | "Approved" | "Rejected";
}

interface TableQuotationProps {
  data: Quotation[];
  searchText: string;
  filterProduct: string | null;
  filterVat: number | null;
  filterStatus: Quotation["status"] | null;
  selectedRowKeys: number[];
  setSelectedRowKeys: (keys: number[]) => void;
  onShowClick?: (record: Quotation) => void;
  onEditClick?: (record: Quotation) => void;
}

const TableQuotation = ({
  data,
  searchText,
  filterProduct,
  filterVat,
  filterStatus,
  selectedRowKeys,
  setSelectedRowKeys,
  onShowClick,
  onEditClick,
}: TableQuotationProps) => {
  // 🔎 lọc theo search + filter
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const matchSearch = item.quotationName.toLowerCase().includes(searchText.toLowerCase());

      const matchProduct = filterProduct
        ? item.Products.some((p) => p.name.toLowerCase().includes(filterProduct.toLowerCase()))
        : true;

      const matchVat = filterVat !== null ? item.vat === filterVat : true;

      const matchStatus = filterStatus ? item.status === filterStatus : true;

      return matchSearch && matchProduct && matchVat && matchStatus;
    });
  }, [data, searchText, filterProduct, filterVat, filterStatus]);

  const columns: ColumnsType<Quotation> = [
    {
      title: "Tên mẫu báo giá",
      dataIndex: "quotationName",
      key: "quotationName",
      width: 220,
      fixed: "left",
      render: (_, record) => (
        <Link onClick={() => onShowClick?.(record)} to="#">
          <FileTextOutlined style={{ marginRight: 6, color: "#1890ff" }} />
          {record.quotationName}
        </Link>
      ),
    },
    {
      title: "Thời hạn hiệu lực",
      dataIndex: "validityPeriod",
      key: "validityPeriod",
      width: 180,
      fixed: "left",
    },
    {
      title: "Điều khoản thanh toán",
      dataIndex: "paymentTerms",
      key: "paymentTerms",
      width: 180,
    },
    {
      title: "Sản phẩm",
      dataIndex: "Products",
      key: "Products",
      width: 220,
      render: (products) =>
        Array.isArray(products) ? products.map((p: any) => p.name).join(", ") : products,
    },
    {
      title: "Giá (VND)",
      dataIndex: "priceVND",
      key: "priceVND",
      width: 150,
    },
    {
      title: "Giá (USD)",
      dataIndex: "priceUSD",
      key: "priceUSD",
      width: 150,
    },
    {
      title: "VAT",
      dataIndex: "vat",
      key: "vat",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 160,
    },
    {
      title: "",
      key: "action",
      width: 60,
      fixed: "right",
      render: (_, record) => (
        <Tooltip title="Chỉnh sửa">
          <EditOutlined
            style={{
              fontSize: 20,
              display: "block",
              cursor: "pointer",
              color: "#1890ff",
              padding: 8,
            }}
            onClick={(e) => {
              e.stopPropagation(); // chặn click row
              onEditClick?.(record);
            }}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <Table<Quotation>
      rowSelection={{
        selectedRowKeys,
        onChange: (keys) => {
          setSelectedRowKeys(keys as number[]);
        },
      }}
      columns={columns}
      dataSource={filteredData}
      rowKey="id" // 👈 sửa đúng
      scroll={{ x: "max-content", y: "calc(100vh - 330px)" }}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};

export default TableQuotation;
