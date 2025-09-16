import { Table, Checkbox, Button, Typography, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Link } = Typography;

interface Product {
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
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: Contract) => void;
  onRowClick?: (record: Contract) => void;
  loading?: boolean;
}

const TableContract: React.FC<TableContractProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEdit,
  onRowClick,
  loading = false,
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
            if (e.target.checked) {
              setSelectedRowKeys(allKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
          disabled={data.length === 0}
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
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
            }
          }}
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
      align: "center",
      render: (text: string, record: Contract) => (
        <Link
          onClick={() =>
            navigate(
              generatePath(ROUTES_APP.crm.contractDetail, { id: record.id }) +
              `?loai=${record.type === "Báo giá" ? "baogia" : "hopdong"}`
            )
          }
        >
          {text}
        </Link>
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
      width: 150,
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
    {
      title: "",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_: any, record: Contract) => (
        <Tooltip title="Chỉnh sửa">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(record);
            }}
            className="base-edit-icon"
          />
        </Tooltip>
      ),
    },
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