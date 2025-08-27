import { useMemo } from "react";
import { Table, Tooltip } from "antd";
import { EditOutlined, FileTextOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { Product, Quotation } from "../../views/CRM/QuotationList/QuotationList";

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
  getSummary: (products: Product[]) => {
    totalBeforeVat: number;
    vat5: number;
    vat10: number;
  };
}

export const TableQuotation = ({
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
}: TableQuotationProps) => {
  // 🔎 lọc theo search + filter
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
      dataIndex: "products",
      key: "products",
      width: 220,
      render: (products: Product[]) =>
        Array.isArray(products) ? products.map((p) => p.productName).join(", ") : "",
    },
    {
      title: "Tổng chưa VAT (VND)",
      dataIndex: "products",
      key: "totalBeforeVat",
      width: 180,
      render: (products: Product[]) => getSummary(products).totalBeforeVat.toLocaleString(),
    },
    {
      title: "VAT 5% (VND)",
      dataIndex: "products",
      key: "vat5",
      width: 150,
      render: (products: Product[]) => getSummary(products).vat5.toLocaleString(),
    },
    {
      title: "VAT 10% (VND)",
      dataIndex: "products",
      key: "vat10",
      width: 150,
      render: (products: Product[]) => getSummary(products).vat10.toLocaleString(),
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
              e.stopPropagation();
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
      rowKey="id"
      scroll={{ x: "max-content", y: "calc(100vh - 330px)" }}
      pagination={{ position: ["bottomCenter"] }}
    />
  );
};
