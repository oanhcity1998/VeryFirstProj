import { Table, Checkbox } from "antd";
import { Link } from "react-router-dom";

const TableCustomer = ({ data = [], selectedRowKeys = [], setSelectedRowKeys }) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRowKeys(allKeys); // check all
            } else {
              setSelectedRowKeys([]); // uncheck all
            }
          }}
        />
      ),
      dataIndex: "option",
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) => {
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
      title: "Tên khách hàng",
      dataIndex: "customerName",
      render: (text, record) => (
        <Link to={`/customerlist/${record.id}`}>{text}</Link>
      ),
    },
    { title: "Email", dataIndex: "email" },
    { title: "Số điện thoại", dataIndex: "phone" },
    { title: "Địa chỉ", dataIndex: "address" },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="key"
    />
  );
};

export default TableCustomer;
