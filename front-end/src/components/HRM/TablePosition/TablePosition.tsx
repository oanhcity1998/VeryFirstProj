import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

import { Position } from "@/models/HRM/position.model";

interface TablePositionProps {
  data?: Position[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: Position) => void;
  loading?: boolean;
}

const TablePosition: React.FC<TablePositionProps> = ({
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
      render: (_: any, record: Position) => (
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
      title: "Mã chức vụ",
      dataIndex: "code",
      key: "code",
      fixed: "left" as const,
      width: 120,
      align: "center" as const,
      render: (code: string | null) => code || "-",
    },
    {
      title: "Tên chức vụ",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority_level",
      key: "priority_level",
      width: 100,
      align: "center" as const,
      render: (priority: number | null) => priority ?? "-",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      align: "center" as const,
      render: (note: string | null) => note || "-",
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      align: "center" as const,
      render: (_: any, record: Position) => (
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
      scroll={{ x: 800, y: 600 }}
      rowClassName={(record: Position) =>
        selectedRowKeys.includes(record.id.toString()) ? "selected-row" : ""
      }
    />
  );
};

export default TablePosition;