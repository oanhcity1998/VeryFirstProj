import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

interface Lead {
  id: number;
  leadName: string;
  contactName: string;
  email: string;
  phone: string;
  priority: string;
  owner: string;
  status: string;
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
  const allKeys = data.map((item) => item.id.toString());
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => {
            if (e.target.checked) setSelectedRowKeys(allKeys);
            else setSelectedRowKeys([]);
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: Lead) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id.toString())}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.id.toString()]);
            } else {
              setSelectedRowKeys(
                selectedRowKeys.filter((key) => key !== record.id.toString())
              );
            }
          }}
        />
      ),
    },
    {
      title: "Tên khách hàng tiềm năng",
      dataIndex: "leadName",
      key: "leadName",
      fixed: "left" as const,
      width: 200,
      align: "center" as const,
    },
    {
      title: "Người liên hệ",
      dataIndex: "contactName",
      key: "contactName",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Nhân viên phụ trách",
      dataIndex: "owner",
      key: "owner",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      align: "center" as const,
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Lead) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit?.(record)}
          className="base-edit-icon"
        />
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
        selectedRowKeys.includes(record.id.toString()) ? "selected-row" : ""
      }
    />
  );
};

export default TableLead;