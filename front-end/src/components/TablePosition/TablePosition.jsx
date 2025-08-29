import { useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const TablePosition = ({ data = [], selectedRowKeys = [], setSelectedRowKeys, onEdit }) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const [positionData, setPositionData] = useState([...data]);

  const handleEdit = (record) => {
    if (onEdit) onEdit(record);
  };

  const columns = [
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
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left",
      align: "center",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.key));
            }
          }}
        />
      ),
    },
    {
      title: "Mã chức vụ",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      width: 120,
      align: "center",
    },
    {
      title: "Tên chức vụ",
      dataIndex: "positionName",
      key: "positionName",
      width: 200,
      align: "center",
    //   render: (text, record) => <Link to={`/position/${record.id}`}>{text}</Link>,
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      width: 200,
      align: "center",
    },
    {
      title: "Hành động",
      key: "action",
      fixed: "right",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          Sửa
        </Button>
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
      rowClassName={(record) =>
        selectedRowKeys.includes(record.key) ? "selected-row" : ""
      }
    />
  );
};

export default TablePosition;
