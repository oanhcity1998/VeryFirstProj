import { useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import "./TablePosition.css";

interface Position {
  key: string;
  id: string;
  positionName: string;
  priority: number;
  note?: string;
}

interface TablePositionProps {
  data?: Position[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: Position) => void;
}

const TablePosition: React.FC<TablePositionProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEdit,
}) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const [positionData, setPositionData] = useState<Position[]>([...data]);

  const handleEdit = (record: Position) => {
    if (onEdit) onEdit(record);
  };

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys(allKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: Position) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(
                selectedRowKeys.filter((key) => key !== record.key)
              );
            }
          }}
        />
      ),
    },
    {
      title: "Mã chức vụ",
      dataIndex: "id",
      key: "id",
      fixed: "left" as const,
      width: 120,
      align: "center" as const,
    },
    {
      title: "Tên chức vụ",
      dataIndex: "positionName",
      key: "positionName",
      width: 200,
      align: "center" as const,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center" as const,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      align: "center" as const,
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
          onClick={() => handleEdit(record)}
          className="position-edit-icon"
        ></Button>
      ),
    },
  ];

  return (
    <Table
      className="position-table"
      columns={columns}
      dataSource={positionData}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 10,
        showSizeChanger: false,
      }}
      rowKey="key"
      scroll={{ x: 800, y: 600 }}
      rowClassName={(record: Position) =>
        selectedRowKeys.includes(record.key) ? "selected-row" : ""
      }
    />
  );
};

export default TablePosition;