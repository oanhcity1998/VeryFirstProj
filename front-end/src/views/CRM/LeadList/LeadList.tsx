import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import TableLead from "@/components/CRM/TableLead/TableLead";
import LeadForm from "@/components/CRM/LeadForm/LeadForm";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Option } = Select;

interface Lead {
  id: string;
  leadName: string;
  contactName: string;
  email: string;
  phone: string;
  priority: string;
  owner: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const LeadList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    status: searchParams.get("status") || undefined,
    priority: searchParams.get("priority") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 5,
  });
  const [data, setData] = useState<Lead[]>([
    {
      id: "1",
      leadName: "Khách tiềm năng 1",
      contactName: "Nguyễn Thùy Linh",
      email: "thuy@example.com",
      phone: "098454546",
      priority: "Cao",
      owner: "Văn A",
      status: "Khách hàng mới",
      createdAt: "2025-09-01",
      updatedAt: "2025-09-10",
    },
  ]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: 1,
    pages: 1,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set("q", queryParams.q);
    if (queryParams.status) params.set("status", queryParams.status);
    if (queryParams.priority) params.set("priority", queryParams.priority);
    params.set("page", queryParams.page.toString());
    params.set("limit", queryParams.limit.toString());
    setSearchParams(params);
  }, [queryParams, setSearchParams]);

  const handleSave = async (values: Lead) => {
    try {
      if (selectedLead) {
        setData((prev) => prev.map((item) => (item.id === selectedLead.id ? values : item)));
        toast.success("Cập nhật khách hàng tiềm năng thành công");
      } else {
        const newLead: Lead = {
          id: String(Date.now()),
          ...values,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0],
        };
        setData((prev) => [...prev, newLead]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
          pages: Math.ceil((prev.total + 1) / prev.limit),
        }));
        toast.success("Thêm khách hàng tiềm năng thành công");
      }
      setOpenForm(false);
      setSelectedLead(null);
    } catch (err: any) {
      toast.error(`Không thể ${selectedLead ? "cập nhật" : "thêm"} khách hàng tiềm năng`);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setMeta((prev) => ({
        ...prev,
        total: prev.total - selectedRowKeys.length,
        pages: Math.ceil((prev.total - selectedRowKeys.length) / prev.limit),
      }));
      toast.success("Đã xóa khách hàng tiềm năng thành công");
      setSelectedRowKeys([]);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Không thể xóa khách hàng tiềm năng");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (record: Lead) => {
    setSelectedLead(record);
    setOpenForm(true);
  };

  const handleRowClick = (record: Lead) => {
    navigate(ROUTES_APP.crm.leadDetail.replace(":id", record.id));
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, limit: pageSize });
  };

  const filteredData = data.filter((item) => {
    const matchSearch =
      item.leadName.toLowerCase().includes(queryParams.q.toLowerCase()) ||
      item.contactName.toLowerCase().includes(queryParams.q.toLowerCase()) ||
      item.email.toLowerCase().includes(queryParams.q.toLowerCase());
    const matchStatus = queryParams.status ? item.status === queryParams.status : true;
    const matchPriority = queryParams.priority ? item.priority === queryParams.priority : true;
    return matchSearch && matchStatus && matchPriority;
  });

  const paginatedData = filteredData.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  return (
    <>
      <div className="list-header">
        <h2>Danh sách khách hàng tiềm năng</h2>
        <div className="list-actions">
          <Search
            placeholder="Tìm kiếm theo tên, liên hệ, email"
            allowClear
            value={queryParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            className="search-bar"
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo trạng thái"
            value={queryParams.status}
            onChange={(status) => setQueryParams({ ...queryParams, status, page: 1 })}
            options={[
              { value: "Khách hàng mới", label: "Khách hàng mới" },
              { value: "Đang chăm sóc", label: "Đang chăm sóc" },
              { value: "Chưa quan tâm", label: "Chưa quan tâm" },
            ]}
            allowClear
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo ưu tiên"
            value={queryParams.priority}
            onChange={(priority) => setQueryParams({ ...queryParams, priority, page: 1 })}
            options={[
              { value: "Cao", label: "Cao" },
              { value: "Thấp", label: "Thấp" },
            ]}
            allowClear
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
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} khách hàng tiềm năng đã chọn?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có khách hàng tiềm năng nào để hiển thị" />
          <p>Hiện tại không có dữ liệu khách hàng tiềm năng. Vui lòng thêm mới!</p>
        </div>
      ) : (
        <>
          <TableLead
            data={paginatedData}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onEdit={handleEdit}
            onRowClick={handleRowClick}
            loading={false}
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

      <LeadForm
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setSelectedLead(null);
        }}
        onSave={handleSave}
        lead={selectedLead}
        modalTitle={selectedLead ? "Chỉnh sửa khách hàng tiềm năng" : "Thêm khách hàng tiềm năng"}
        cancelText="Hủy"
        saveText={selectedLead ? "Xác nhận" : "Xác nhận"}
        loading={false}
      />
    </>
  );
};

export default LeadList;