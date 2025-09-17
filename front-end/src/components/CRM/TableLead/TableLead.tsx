import { Table, Checkbox, Button, Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate, generatePath, Link } from "react-router-dom";
import { ColumnsType } from "antd/es/table";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

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
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: Lead) => void;
  loading?: boolean;
}

const TableLead: React.FC<TableLeadProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEdit,
  loading = false,
}) => {
  const navigate = useNavigate();
  const allKeys = data.map((item) => item.id);
  const isAllChecked = selectedRowKeys.length === data.length && data.length > 0;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns: ColumnsType<Lead> = [
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
      render: (_: any, record: Lead) => (
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
      title: "Tên lead",
      dataIndex: "leadName",
      key: "leadName",
      width: 150,
      fixed: "left",
      align: "center",
      render: (text: string, record: Lead) => (
        <Link to={generatePath(ROUTES_APP.crm.leadDetail, { id: record.id })}>
          {text}
        </Link>
      ),
    },
    {
      title: "Tên liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      width: 150,
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 150,
      align: "center",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
      align: "center",
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 120,
      align: "center",
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      width: 200,
      align: "center",
    },
    {
      title: "Giai đoạn",
      dataIndex: "status",
      key: "status",
      width: 120,
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
      title: "Ngày cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      align: "center",
    },
    {
      title: "",
      key: "action",
      width: 80,
      fixed: "right",
      align: "center",
      render: (_: any, record: Lead) => (
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
      scroll={{ x: 1000 }}
      rowClassName={(record: Lead) =>
        selectedRowKeys.includes(record.id) ? "selected-row" : ""
      }
    />
  );
};

export default TableLead;