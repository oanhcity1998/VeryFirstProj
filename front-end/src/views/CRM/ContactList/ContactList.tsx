import { useMemo, useState } from "react";
import { Button, Space, Modal, message, Input, Dropdown, Select, Breadcrumb } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import TableContact, { Contact } from "../../../components/TableContact/TableContact";
import ContactForm from "../../../components/ContactForm/ContactForm";
import Search from "antd/es/input/Search";

const ContactList = () => {
  const [data, setData] = useState([
    {
      key: "1",
      id: "10",
      contactName: "Nguyễn Văn A",
      customerName: "Công ty TNHH ABC",
      phone: "0901234567",
      email: "vana@abc.com",
      title: "Giám đốc",
      mainContact: "Nguyễn Văn A",
      note: "Khách hàng lâu năm",
    },
    {
      key: "2",
      id: "11",
      contactName: "Trần Thị B",
      customerName: "Công ty TNHH XYZ",
      phone: "0912345678",
      email: "tranb@xyz.com",
      title: "Kế toán trưởng",
      mainContact: "Nguyễn Văn C",
      note: "Khách hàng mới",
    },
    {
      key: "3",
      id: "12",
      contactName: "Lê Văn C",
      customerName: "Công ty CP MNO",
      phone: "0923456789",
      email: "lec@mno.com",
      title: "Trưởng phòng Kinh doanh",
      mainContact: "Lê Văn C",
      note: "Tiềm năng",
    },
    {
      key: "4",
      id: "13",
      contactName: "Phạm Thị D",
      customerName: "Công ty TNHH ABC",
      phone: "0934567890",
      email: "phamd@abc.com",
      title: "Nhân viên",
      mainContact: "Nguyễn Văn A",
      note: "Liên hệ phụ",
    },
    {
      key: "5",
      id: "14",
      contactName: "Hoàng Văn E",
      customerName: "Công ty CP PQR",
      phone: "0945678901",
      email: "hoange@pqr.com",
      title: "Phó Giám đốc",
      mainContact: "Hoàng Văn E",
      note: "Khách VIP",
    },
    {
      key: "6",
      id: "15",
      contactName: "Đỗ Thị F",
      customerName: "Công ty TNHH XYZ",
      phone: "0956789012",
      email: "dof@xyz.com",
      title: "Trợ lý",
      mainContact: "Nguyễn Văn C",
      note: "Cần follow-up",
    },
  ]);

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  // 🗑 handle delete
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
      setSelectedRowKeys([]);
      message.success("Đã xóa thông tin người liên hệ");
    } catch (err) {
      message.error("Không thể xóa thông tin người liên hệ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  // ➕ handle create
  const handleCreate = (newContact: any) => {
    const newData = {
      key: Date.now().toString(),
      id: Date.now().toString(),
      ...newContact,
    };
    setData((prev) => [...prev, newData]);
    setIsCreateModalOpen(false);
    message.success("Đã thêm người liên hệ");
  };

  // ✏️ handle edit
  const handleEdit = (updatedContact: any) => {
    if (!selectedContact) return;
    setData((prev) =>
      prev.map((item) => (item.key === selectedContact.key ? { ...item, ...updatedContact } : item))
    );
    setIsEditModalOpen(false);
    message.success("Đã cập nhật thông tin liên hệ");
  };

  return (
    <>
      {/* header actions */}
      <div style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "center" }}>
        <h2 style={{ flex: 1, textAlign: "center" }}>Danh sách thông tin người liên hệ</h2>

        <Search
          placeholder="Nhập tên người liên hệ..."
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="header-search"
        />

        <Select
          allowClear
          placeholder="Lọc theo Khách hàng"
          style={{ width: 200 }}
          value={filterCustomer}
          onChange={(val) => setFilterCustomer(val)}
          options={customerOptions.map((c) => ({ label: c, value: c }))}
        />

        <Select
          allowClear
          placeholder="Lọc theo Liên hệ chính"
          style={{ width: 200 }}
          value={filterMainContact}
          onChange={(val) => setFilterMainContact(val)}
          options={mainContactOptions.map((m) => ({ label: m, value: m }))}
        />

        <Space>
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
        onShowClick={(record) => {
          setSelectedContact(record);
          setIsDetailModalOpen(true);
        }}
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

      <ContactForm
        mode="detail"
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        initialValues={selectedContact}
      />
    </>
  );
};

export default ContactList;
