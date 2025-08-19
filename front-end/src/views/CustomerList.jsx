import { useState } from "react";
import { Button, Space, Modal, message  } from "antd";
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

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // handle delete
    const handleDelete = async () => {
    try {
        setDeleting(true);
        // TODO: replace with your real API delete call
        // await api.delete(`/customers/${customer.id}`);

        message.success("Đã xóa khách hàng");
        navigate("/customerlist");
    } catch (err) {
        message.error("Không thể xóa khách hàng");
    } finally {
        setDeleting(false);
        setDeleteOpen(false);
    }
    };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách khách hàng</h2>
        <Space>
            {/* Delete button  */}
            <Button danger onClick={() => setDeleteOpen(true)}>
                Xóa
            </Button>
            <Modal
                open={deleteOpen}
                title="Xác nhận xóa"
                onOk={handleDelete}
                onCancel={() => setDeleteOpen(false)}
                okText="Xóa"
                cancelText="Hủy"
                okButtonProps={{ danger: true, loading: deleting }}
                centered
                >
                <p>Bạn có chắc muốn xóa khách hàng này? Hành động này không thể hoàn tác.</p>
            </Modal>

            {/* Create button  */}
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
