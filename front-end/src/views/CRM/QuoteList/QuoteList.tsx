import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty, Row, Col, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import TableContract, { Contract } from "@/components/CRM/TableContract/TableContract";
import ContractForm from "@/components/CRM/ContractForm/ContractForm";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";

const { Option } = Select;

const QuoteList: React.FC = () => {
  const [urlSearchParams, setUrlSearchParams] = useSearchParams();
  const [searchParams, setSearchParams] = useState({
    q: urlSearchParams.get("q") || "",
    status: urlSearchParams.get("status") || undefined,
    type: urlSearchParams.get("type") || undefined,
    page: urlSearchParams.get("page") ? Number(urlSearchParams.get("page")) : 1,
    limit: urlSearchParams.get("limit") ? Number(urlSearchParams.get("limit")) : 5,
  });
  const [data, setData] = useState<Contract[]>([
    {
      id: "1",
      code: "AF25_BG1",
      name: "Báo giá Piggy hotel",
      type: "Báo giá",
      customer: "Piggy hotel",
      total: 10000000,
      owner: "Văn A",
      createdAt: "20/02/2025",
      approver: "Trần B",
      approvedAt: "",
      status: "Chờ duyệt",
    },
    {
      id: "2",
      code: "AC25_HD1",
      name: "Hợp đồng trường A",
      type: "Hợp đồng",
      customer: "Trường A",
      total: 15000000,
      owner: "Duy Khoa",
      createdAt: "25/05/2025",
      approver: "Trần B",
      approvedAt: "30/05/2025",
      status: "Đã duyệt",
    },
  ]);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: 2,
    pages: 1,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editRecord, setEditRecord] = useState<Contract | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (searchParams.q) params.set("q", searchParams.q);
    if (searchParams.status) params.set("status", searchParams.status);
    if (searchParams.type) params.set("type", searchParams.type);
    params.set("page", searchParams.page.toString());
    params.set("limit", searchParams.limit.toString());
    setUrlSearchParams(params);
  }, [searchParams, setUrlSearchParams]);

  const handleSave = (data: Contract) => {
    try {
      if (editRecord) {
        setData((prev) => prev.map((item) => (item.id === editRecord.id ? data : item)));
        toast.success("Cập nhật báo giá/hợp đồng thành công");
      } else {
        const newContract: Contract = {
          id: String(Date.now()),
          ...data,
          createdAt: new Date().toISOString().split("T")[0],
          approvedAt: "",
          status: "Chờ duyệt",
        };
        setData((prev) => [...prev, newContract]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
          pages: Math.ceil((prev.total + 1) / prev.limit),
        }));
        toast.success("Thêm báo giá/hợp đồng thành công");
      }
      setOpenForm(false);
      setEditRecord(null);
    } catch (err: any) {
      toast.error(`Không thể ${editRecord ? "cập nhật" : "thêm"} báo giá/hợp đồng`);
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
      toast.success(`Đã xóa ${selectedRowKeys.length} báo giá/hợp đồng thành công`);
      setSelectedRowKeys([]);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Không thể xóa báo giá/hợp đồng");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (record: Contract) => {
    setEditRecord(record);
    setOpenForm(true);
  };

  const handleRowClick = (record: Contract) => {
    navigate(
      `${ROUTES_APP.crm.contractDetail.replace(":id", record.id)}?loai=${record.type === "Báo giá" ? "baogia" : "hopdong"
      }`
    );
  };

  const handleSearch = (value: string) => {
    setSearchParams({ ...searchParams, q: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setSearchParams({ ...searchParams, page, limit: pageSize });
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchParams.q.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchParams.q.toLowerCase());
    const matchesStatus = searchParams.status ? item.status === searchParams.status : true;
    const matchesType = searchParams.type ? item.type === searchParams.type : true;
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedData = filteredData.slice(
    (searchParams.page - 1) * searchParams.limit,
    searchParams.page * searchParams.limit
  );

  return (
    <>
      <div className="list-header">
        <h2>Danh sách báo giá & hợp đồng</h2>
        <div className="list-actions">
          <Search
            placeholder="Tìm kiếm theo tên hoặc khách hàng"
            allowClear
            value={searchParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            className="search-bar"
          />
          <Select
            className="filter-bar"
            placeholder="Trạng thái"
            value={searchParams.status}
            onChange={(val) => setSearchParams({ ...searchParams, status: val, page: 1 })}
            allowClear
          >
            <Option value="Chờ duyệt">Chờ duyệt</Option>
            <Option value="Đã duyệt">Đã duyệt</Option>
            <Option value="Huỷ">Huỷ</Option>
          </Select>
          <Select
            className="filter-bar"
            placeholder="Loại"
            value={searchParams.type}
            onChange={(val) => setSearchParams({ ...searchParams, type: val, page: 1 })}
            allowClear
          >
            <Option value="Báo giá">Báo giá</Option>
            <Option value="Hợp đồng">Hợp đồng</Option>
          </Select>
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
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} báo giá/hợp đồng đã chọn?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>



      {filteredData.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có báo giá hoặc hợp đồng nào để hiển thị" />
          <p>Hiện tại không có dữ liệu. Vui lòng thêm mới!</p>
        </div>
      ) : (
        <>
          <TableContract
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

      <ContractForm
        open={openForm || !!editRecord}
        mode={editRecord ? "edit" : "create"}
        onCancel={() => {
          setOpenForm(false);
          setEditRecord(null);
        }}
        onSave={handleSave}
        initialValues={editRecord}
        modalTitle={editRecord ? "Chỉnh sửa báo giá & hợp đồng" : "Thêm báo giá & hợp đồng"}
        cancelText="Hủy"
        saveText={editRecord ? "Xác nhận" : "Xác nhận"}
        loading={false}
      />
    </>
  );
};

export default QuoteList;