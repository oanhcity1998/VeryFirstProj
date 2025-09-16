import { useEffect, useMemo, useState } from "react";
import { Button, Modal, message, Select, Pagination, Empty } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import { createContact, deleteContact, updateContact } from "./contactService";
import TableContact, { Contact } from "@/components/CRM/TableContact/TableContact";
import ContactForm from "@/components/CRM/ContactForm/ContactForm";
import "@/index.css";

const { Option } = Select;

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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCustomer, setFilterCustomer] = useState<string | null>(null);
  const [filterMainContact, setFilterMainContact] = useState<string | null>(null);
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 5,
  });
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: mockContactDatas.length,
    pages: Math.ceil(mockContactDatas.length / 5),
  });

  const customerOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.customerName))),
    [data]
  );
  const mainContactOptions = useMemo(
    () => Array.from(new Set(data.map((d) => d.mainContact))),
    [data]
  );

  useEffect(() => {
    setData(mockContactDatas);
    setMeta({
      page: queryParams.page,
      limit: queryParams.limit,
      total: mockContactDatas.length,
      pages: Math.ceil(mockContactDatas.length / queryParams.limit),
    });
  }, [queryParams.limit]);

  const handleCreate = async (newContact: any) => {
    try {
      const saved = await createContact(newContact);
      setData((prev) => [...prev, saved]);
      setMeta((prev) => ({
        ...prev,
        total: prev.total + 1,
        pages: Math.ceil((prev.total + 1) / prev.limit),
      }));
      setIsCreateModalOpen(false);
      message.success("Đã thêm người liên hệ");
    } catch {
      message.error("Không thể thêm người liên hệ");
    }
  };

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

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await Promise.all(selectedRowKeys.map((id) => deleteContact(id)));
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setMeta((prev) => ({
        ...prev,
        total: prev.total - selectedRowKeys.length,
        pages: Math.ceil((prev.total - selectedRowKeys.length) / prev.limit),
      }));
      setSelectedRowKeys([]);
      message.success("Đã xóa thông tin người liên hệ");
    } catch {
      message.error("Không thể xóa thông tin người liên hệ");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ page, limit: pageSize });
  };

  const paginatedData = data.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  return (
    <>
      <div className="list-header">
        <h2>Danh sách thông tin liên hệ</h2>
        <div className="list-actions">
          <Search
            className="search-bar"
            placeholder="Nhập tên người liên hệ..."
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            className="filter-bar"
            allowClear
            placeholder="Lọc theo tên khách hàng"
            value={filterCustomer}
            onChange={(val) => setFilterCustomer(val)}
            options={customerOptions.map((c) => ({ label: c, value: c }))}
          />
          <Select
            className="filter-bar"
            allowClear
            placeholder="Lọc theo người liên hệ chính"
            value={filterMainContact}
            onChange={(val) => setFilterMainContact(val)}
            options={mainContactOptions.map((m) => ({ label: m, value: m }))}
          />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có thông tin liên hệ nào để hiển thị" />
          <p>Hiện tại không có dữ liệu liên hệ. Vui lòng thêm mới!</p>
        </div>
      ) : (
        <>
          <TableContact
            data={paginatedData}
            searchText={searchText}
            filterCustomer={filterCustomer}
            filterMainContact={filterMainContact}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onEditClick={(record) => {
              setSelectedContact(record);
              setIsEditModalOpen(true);
            }}
          />
          <div className="pagination-container">
            <Pagination
              current={meta.page}
              pageSize={meta.limit}
              total={meta.total}
              onChange={handlePageChange}
              showSizeChanger
              pageSizeOptions={["5", "10", "20"]}
            />
          </div>
        </>
      )}

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