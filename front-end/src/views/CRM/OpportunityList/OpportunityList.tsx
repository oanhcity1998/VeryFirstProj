import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import OpportunityForm from "@/components/CRM/OpportunityForm/OpportunityForm";
import { ROUTES_APP } from "@/app/routes";
import "@/index.css";
import { TableOpportunity } from "@/components/CRM/TableOpportunity/TableOpportunity";

const { Option } = Select;

export interface Product {
  id: number;
  productName: string;
  productType: string;
  priceVND: number;
  priceUSD: number;
  vat: number;
  afterVatVND: number;
  afterVatUSD: number;
}

export interface Opportunity {
  id: string; // Đổi thành string để đồng bộ
  name: string;
  contactName: string;
  company: string;
  expectedValue: number;
  expectedCloseDate: string;
  service: Product[];
  probability: number;
  priority: "Low" | "Medium" | "High";
  owner: string;
  stage: "Mới" | "Đạt yêu cầu" | "Đàm phán" | "Đóng";
}

export const serviceOpportunityOptions: Product[] = [
  {
    id: 1,
    productName: "Máy in HP 107w",
    productType: "Thiết bị văn phòng",
    priceVND: 5000000,
    priceUSD: 210,
    vat: 10,
    afterVatVND: 5500000,
    afterVatUSD: 231,
  },
  {
    id: 2,
    productName: "Giấy A4 Double A",
    productType: "Vật tư tiêu hao",
    priceVND: 250000,
    priceUSD: 11,
    vat: 5,
    afterVatVND: 262500,
    afterVatUSD: 11.55,
  },
];

const dataSource: Opportunity[] = [
  {
    id: "1",
    name: "Triển khai ERP cho công ty ABC",
    contactName: "Nguyễn Văn A",
    company: "Công ty ABC",
    expectedValue: 500_000_000,
    expectedCloseDate: "2025-09-15",
    service: [serviceOpportunityOptions[0], serviceOpportunityOptions[1]],
    probability: 70,
    priority: "High",
    owner: "Phạm Văn Quyết",
    stage: "Mới",
  },
];

const OpportunityList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    stage: searchParams.get("stage") || undefined,
    priority: searchParams.get("priority") || undefined,
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
    limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : 5,
  });
  const [data, setData] = useState<Opportunity[]>(dataSource);
  const [meta, setMeta] = useState<{ page: number; limit: number; total: number; pages: number }>({
    page: 1,
    limit: 5,
    total: dataSource.length,
    pages: Math.ceil(dataSource.length / 5),
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<Opportunity | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams();
    if (queryParams.q) params.set("q", queryParams.q);
    if (queryParams.stage) params.set("stage", queryParams.stage);
    if (queryParams.priority) params.set("priority", queryParams.priority);
    params.set("page", queryParams.page.toString());
    params.set("limit", queryParams.limit.toString());
    setSearchParams(params);
  }, [queryParams, setSearchParams]);

  const handleSave = async (values: Opportunity) => {
    try {
      if (editData) {
        setData((prev) => prev.map((item) => (item.id === editData.id ? values : item)));
        toast.success("Cập nhật cơ hội thành công");
      } else {
        const newOpportunity: Opportunity = {
          ...values,
        };
        setData((prev) => [...prev, newOpportunity]);
        setMeta((prev) => ({
          ...prev,
          total: prev.total + 1,
          pages: Math.ceil((prev.total + 1) / prev.limit),
        }));
        toast.success("Thêm cơ hội thành công");
      }
      setOpenForm(false);
      setEditData(null);
    } catch (err: any) {
      toast.error(`Không thể ${editData ? "cập nhật" : "thêm"} cơ hội`);
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
      toast.success("Đã xóa cơ hội thành công");
      setSelectedRowKeys([]);
      setDeleteOpen(false);
    } catch (err) {
      toast.error("Không thể xóa cơ hội");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (record: Opportunity) => {
    setEditData(record);
    setOpenForm(true);
  };

  const handleShowClick = (record: Opportunity) => {
    navigate(ROUTES_APP.crm.opportunityDetail.replace(":id", record.id));
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, limit: pageSize });
  };

  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(queryParams.q.toLowerCase()) ||
      item.contactName.toLowerCase().includes(queryParams.q.toLowerCase()) ||
      item.company.toLowerCase().includes(queryParams.q.toLowerCase());
    const matchesStage = queryParams.stage ? item.stage === queryParams.stage : true;
    const matchesPriority = queryParams.priority ? item.priority === queryParams.priority : true;
    return matchesSearch && matchesStage && matchesPriority;
  });

  const paginatedData = filteredData.slice(
    (queryParams.page - 1) * queryParams.limit,
    queryParams.page * queryParams.limit
  );

  return (
    <>
      <div className="list-header">
        <h2>Danh sách cơ hội</h2>
        <div className="list-actions">
          <Search
            placeholder="Tìm kiếm theo tên cơ hội, liên hệ, công ty"
            allowClear
            value={queryParams.q}
            onChange={(e) => handleSearch(e.target.value)}
            onSearch={handleSearch}
            className="search-bar"
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo giai đoạn"
            value={queryParams.stage}
            onChange={(stage) => setQueryParams({ ...queryParams, stage, page: 1 })}
            options={[
              { value: "Mới", label: "Mới" },
              { value: "Đạt yêu cầu", label: "Đạt yêu cầu" },
              { value: "Đàm phán", label: "Đàm phán" },
              { value: "Đóng", label: "Đóng" },
            ]}
            allowClear
          />
          <Select
            className="filter-bar"
            placeholder="Lọc theo ưu tiên"
            value={queryParams.priority}
            onChange={(priority) => setQueryParams({ ...queryParams, priority, page: 1 })}
            options={[
              { value: "High", label: "Cao" },
              { value: "Medium", label: "Trung bình" },
              { value: "Low", label: "Thấp" },
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
            <p>Bạn có chắc muốn xóa {selectedRowKeys.length} cơ hội đã chọn?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có cơ hội nào để hiển thị" />
          <p>Hiện tại không có dữ liệu cơ hội. Vui lòng thêm cơ hội mới!</p>
        </div>
      ) : (
        <>
          <TableOpportunity
            data={paginatedData}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onShowClick={handleShowClick}
            onEditClick={handleEdit}
            loading={false}
            searchText={""}
            filterPriority={""}
            filterStage={""}
            filterDate={["", ""]}
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

      <OpportunityForm
        mode={editData ? "edit" : "create"}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setEditData(null);
        }}
        onSave={handleSave}
        initialValues={editData}
        modalTitle={editData ? "Chỉnh sửa cơ hội" : "Thêm cơ hội"}
        cancelText="Hủy"
        saveText={editData ? "Xác nhận" : "Xác nhận"}
        loading={false}
      />
    </>
  );
};

export default OpportunityList;
