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
              setSelectedRowKeys(allKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left", // ✅ fixed
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
      title: "Mã khách hàng",
      dataIndex: "id",
      width: 120,
      fixed: "left", // ✅ fixed
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      width: 200,
      fixed: "left", // ✅ fixed
      render: (text, record) => (
        <Link to={`/customerlist/${record.id}`}>{text}</Link>
      ),
    },
    { title: "Tên DN ghi trên hợp đồng", dataIndex: "contractName", width: 200 },
    { title: "Tên DN bằng tiếng Anh", dataIndex: "englishName", width: 200 },
    { title: "Mã số thuế", dataIndex: "taxCode", width: 150 },
    { title: "Số điện thoại", dataIndex: "phone", width: 150 },
    { title: "Số fax", dataIndex: "fax", width: 150 },
    { title: "Email", dataIndex: "email", width: 200 },
    { title: "Địa chỉ", dataIndex: "address", width: 250 },
    { title: "Ngành", dataIndex: "industry", width: 180 },
    { title: "Thị trường chính", dataIndex: "market", width: 180 },
    { title: "Số lượng chi nhánh", dataIndex: "branches", width: 180 },
    { title: "Số nhân sự", dataIndex: "employees", width: 180 },
    { title: "Doanh thu TB/năm", dataIndex: "revenue", width: 180 },
    { title: "Văn bản TB/tháng", dataIndex: "documentsPerMonth", width: 180 },
    {
    title: "Tài liệu",
    dataIndex: "documents",
    width: 200,
    render: (file) =>
        file ? (
        <a href={file} download target="_blank" rel="noopener noreferrer">
            📂 Tải xuống
        </a>
        ) : (
        "—"
        ),
    },    
  ];

  return (
    <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        rowKey="key"
        scroll={{ x: 2500, y: 600 }} // ✅ enable horizontal scroll
    />
  );
};

export default TableCustomer;
