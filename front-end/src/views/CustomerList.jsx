import { useState } from "react";
import { Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TableCustomer from "../components/TableCustomer";
import CreateCustomerForm from "../components/CreateCustomerForm";

const CustomerList = () => {
  const [data, setData] = useState([
    {
      key: "1",
      id: "101",
      customerName: "Công ty A",
      email: "a@company.com",
      phone: "0123456789",
      address: "123 Đường A",
    },
    {
      key: "2",
      id: "102",
      customerName: "Công ty B",
      email: "b@company.com",
      phone: "0987654321",
      address: "456 Đường B",
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách khách hàng</h2>
        <Space>
          <Button danger icon={<DeleteOutlined />}>Xoá</Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tạo
          </Button>
        </Space>
      </div>

      <TableCustomer
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />

      <CreateCustomerForm
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default CustomerList;
