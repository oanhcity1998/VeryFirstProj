import { useState } from "react";
import { Button, Space, Modal, message, Input, Popover, Upload, Form } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  SettingOutlined,
  FilterOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { ROUTES_APP } from "../../../app/routes";
import { useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import TableCustomer from "@/components/CRM/TableCustomer/TableCustomer";
import CustomerForm from "@/components/CRM/CustomerForm/CustomerForm";
import FilterDrawer from "@/components/CRM/Filter/FilterDrawer";
import "@/index.css";

const CustomerList = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
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

  const handleEdit = (record: any) => {
    setEditingCustomer(record);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingCustomer(null);
    setIsModalOpen(true);
  };

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

  const handleUpload = async (file: any) => {
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
      <div className="list-header">
        <h2>Danh sách khách hàng</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Tìm kiếm theo tên khách hàng"
            allowClear
            name="search"
          />
          <Button icon={<FilterOutlined />} onClick={() => setFilterOpen(true)}>
            Bộ lọc
          </Button>
          <Popover
            content={
              <Space direction="vertical">
                <Button type="text" onClick={() => setImportOpen(true)}>
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
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo
          </Button>
        </div>
      </div>

      <TableCustomer
        data={data as any}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys as any}
        onEdit={handleEdit}
      />

      <CustomerForm
        open={isModalOpen}
        mode={editingCustomer ? "edit" : "add"}
        customer={editingCustomer}
        form={form}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onSave={(values: any) => {
          console.log("Saved customer:", values);
          setData((prev) =>
            editingCustomer
              ? prev.map((item) =>
                item.id === editingCustomer.id ? { ...item, ...values } : item
              )
              : [...prev, { ...values, key: String(Date.now()), id: String(Date.now()) }]
          );
          setIsModalOpen(false);
          form.resetFields();
        }}
      />

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onConfirm={(values: any) => console.log("Apply filter:", values)}
      />
    </>
  );
};

export default CustomerList;