import { useEffect, useMemo, useState } from "react";
import { Button, Space, Modal, message, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TableContact, { Contact } from "../../../components/TableContact/TableContact";
import ContactForm from "../../../components/ContactForm/ContactForm";
import Search from "antd/es/input/Search";
import { createContact, deleteContact, getContacts, updateContact } from "./contactService";

export const mockContactDatas: Contact[] = [
  {
    id: "1",
    contactName: "Nguyễn Văn A",
    customerName: "Công ty TNHH ABC",
    phone: "0901234567",
    email: "vana@abc.com",
    title: "Giám đốc",
    mainContact: "Nguyễn Văn A",
    note: "Khách hàng lâu năm",
  },
];

const ContactList = () => {
  const [data, setData] = useState<Contact[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 🔎 search + filter
  const [searchText, setSearchText] = useState("");
  const [filterCustomer, setFilterCustomer] = useState<string | null>(null);
  const [filterMainContact, setFilterMainContact] = useState<string | null>(null);

  const customerOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.customerName))),
    [data]
  );
  const mainContactOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.mainContact))),
    [data]
  );

  useEffect(() => {
    getContacts()
      .then((res) => setData(res))
      .catch(() => {
        console.warn("API lỗi, dùng mock data");
        setData(mockContactDatas);
      });
  }, []);

  // ➕ create
  const handleCreate = async (newContact: any) => {
    try {
      const saved = await createContact(newContact);
      setData((prev) => [...prev, saved]);
      setIsCreateModalOpen(false);
      message.success("Đã thêm người liên hệ");
    } catch {
      message.error("Không thể thêm người liên hệ");
    }
  };

  // ✏️ edit
  const handleEdit = async (updatedContact: any) => {
    if (!selectedContact) return;
    try {
      const saved = await updateContact(selectedContact.id, updatedContact);
      setData((prev) => prev.map((item) => (item.id === saved.id ? saved : item)));
      setIsEditModalOpen(false);
      message.success("Đã cập nhật thông tin liên hệ");
    } catch {
      message.error("Không thể cập nhật thông tin liên hệ");
    }
  };

  // 🗑 delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await Promise.all(selectedRowKeys.map((id) => deleteContact(id)));
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success("Đã xóa thông tin người liên hệ");
    } catch {
      message.error("Không thể xóa thông tin người liên hệ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      {/* header actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ flex: 1 }}>Danh sách thông tin liên hệ</h2>

        <Space>
          {/* Searchbar  */}
          <Search
            placeholder="Nhập tên người liên hệ..."
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="header-search"
          />

          {/* Filter  */}
          <Select
            allowClear
            placeholder="Lọc theo Khách hàng"
            style={{ width: 150 }}
            value={filterCustomer}
            onChange={(val) => setFilterCustomer(val)}
            options={customerOptions.map((c) => ({ label: c, value: c }))}
          />

          <Select
            allowClear
            placeholder="Lọc theo Liên hệ chính"
            style={{ width: 150 }}
            value={filterMainContact}
            onChange={(val) => setFilterMainContact(val)}
            options={mainContactOptions.map((m) => ({ label: m, value: m }))}
          />

          {/* Delete button */}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteOpen(true)}
            disabled={selectedRowKeys.length === 0}
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
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} người liên hệ đã chọn?</p>
          </Modal>

          {/* Create button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo
          </Button>
        </Space>
      </div>

      {/* table */}
      <TableContact
        data={data}
        searchText={searchText}
        filterCustomer={filterCustomer}
        filterMainContact={filterMainContact}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEditClick={(record) => {
          setSelectedContact(record);
          setIsEditModalOpen(true);
        }}
        selectable={true}
        showEdit={true}
      />

      {/* modals */}
      <ContactForm
        mode="create"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreate}
      />

      <ContactForm
        mode="edit"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEdit}
        initialValues={selectedContact}
      />
    </>
  );
};

export default ContactList;
