import { useState } from "react";
import { Button, Space, Modal, message, Input, Popover, Upload } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  FilterOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import TableCustomer from "../../../components/TableCustomer/TableCustomer";
import CreateCustomerForm from "../../../components/CustomerForm/CreateCustomerForm";
import FilterDrawer from "../../../components/Filter/FilterDrawer";

import "./CustomerList.css";
import { ROUTES_APP } from "../../../app/routes";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";

const CustomerList = () => {
  const navigate = useNavigate();
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
  const [filterOpen, setFilterOpen] = useState(false);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [importOpen, setImportOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (record) => {
    setEditingCustomer(record); // set current row
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCustomer(null); // reset
    setIsModalOpen(true);
  };

  // handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      // TODO: replace with your real API delete call
      // await api.delete(`/customers/${customer.id}`);

      message.success("Đã xóa khách hàng");
      navigate(ROUTES_APP.crm.customerList);
    } catch (err) {
      message.error("Không thể xóa khách hàng");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  // upload handler
  const handleUpload = async (file) => {
    setImporting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500)); // fake API call
      message.success(`${file.name} đã được import thành công`);
      setImportOpen(false);
    } catch (err) {
      message.error("Import thất bại");
    } finally {
      setImporting(false);
    }
    return false;
  };

  return (
    <>
      <div className="customer-list-header">
        <h2>Danh sách khách hàng</h2>

        <div className="customer-list-actions">
          {/* Search bar */}
          <Search
            placeholder="Tìm kiếm khách hàng..."
            allowClear
            className="customer-list-search"
            name="search"
          />

          {/* Bộ lọc */}
          <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
            Bộ lọc
          </Button>

          {/* Cài đặt */}
          <Popover
            content={
              <Space direction="vertical">
                <Button type="text" onClick={() => setImportOpen(true)}>
                  {" "}
                  {/* must have onClick to trigger */}
                  Import
                </Button>
                <Button type="text" onClick={() => console.log("Export clicked")}>
                  Export
                </Button>
              </Space>
            }
            trigger="click"
            placement="bottom"
          >
            <Button icon={<SettingOutlined />}>Cài đặt</Button>
          </Popover>
          <Modal
            open={importOpen}
            title="Import dữ liệu"
            onCancel={() => setImportOpen(false)}
            footer={null}
            centered
          >
            <Upload.Dragger
              name="file"
              multiple={false}
              beforeUpload={handleUpload}
              showUploadList={false}
              disabled={importing}
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click hoặc kéo thả file vào đây để Import</p>
              <p className="ant-upload-hint">Chỉ chấp nhận 1 file mỗi lần</p>
            </Upload.Dragger>
          </Modal>

          {/* Delete */}
          <Button
            danger
            icon={<DeleteOutlined />}
            disabled={selectedRowKeys.length === 0}
            onClick={() => setDeleteOpen(true)}
          >
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

          {/* Create */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Tạo
          </Button>
        </div>
      </div>

      <TableCustomer
        data={data as any}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
      />

      <CreateCustomerForm
        open={isModalOpen}
        mode={editingCustomer ? "edit" : "add"}
        customer={editingCustomer} // 👈 pass the record when editing
        onCancel={() => setIsModalOpen(false)}
        onSave={(values) => {
          console.log("Saved customer:", values);
          setIsModalOpen(false);
        }}
      />

      {/* Drawer */}
      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={(values) => console.log("Apply filter:", values)}
      />
    </>
  );
};

export default CustomerList;
