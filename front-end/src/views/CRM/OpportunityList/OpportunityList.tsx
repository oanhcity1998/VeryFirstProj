import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button, Modal, Select, Pagination, Empty, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import Search from "antd/es/input/Search";
import { TableOpportunity } from "@/components/CRM/TableOpportunity/TableOpportunity";
import OpportunityForm from "@/components/CRM/OpportunityForm/OpportunityForm";
import { ROUTES_APP } from "../../../app/routes";
import "@/index.css";

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
  id: number;
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

const dataSource: Opportunity[] = [
  {
    id: 1,
    name: "Triển khai ERP cho công ty ABC",
    contactName: "Nguyễn Văn A",
    company: "Công ty ABC",
    expectedValue: 500_000_000,
    expectedCloseDate: "2025-09-15",
    service: [
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
    ],
    probability: 70,
    priority: "High",
    owner: "Phạm Văn Quyết",
    stage: "Mới",
  },
];

const OpportunityList: React.FC = () => {
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryParams, setQueryParams] = useState({
    q: searchParams.get("q") || "",
    stage: searchParams.get("stage") || null,
    priority: searchParams.get("priority") || null,
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
        setData((prev) =>
          prev.map((item) => (item.id === editData.id ? { ...item, ...values } : item))
        );
        toast.success("Cập nhật cơ hội thành công");
      } else {
        const newOpportunity: Opportunity = {
          id: Date.now(),
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
      form.resetFields();
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
    navigate(
      `${ROUTES_APP.crm.opportunityDetail.replace(":id", String(record.id))}`
    );
  };

  const handleSearch = (value: string) => {
    setQueryParams({ ...queryParams, q: value, page: 1 });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setQueryParams({ ...queryParams, page, limit: pageSize });
  };

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
            <p>Bạn có chắc muốn xóa cơ hội này? Hành động này không thể hoàn tác.</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpenForm(true)}>
            Tạo
          </Button>
        </div>
      </div>

      {data.length === 0 ? (
        <div className="empty-message">
          <Empty description="Không có cơ hội nào để hiển thị" />
          <p>Hiện tại không có dữ liệu cơ hội. Vui lòng thêm cơ hội mới!</p>
        </div>
      ) : (
        <>
          <TableOpportunity
            data={data as any}
            searchText={queryParams.q}
            selectedRowKeys={selectedRowKeys}
            setSelectedRowKeys={setSelectedRowKeys}
            onShowClick={handleShowClick}
            onEditClick={handleEdit}
            filterPriority={queryParams.priority}
            filterStage={queryParams.stage}
            filterDate={null}
          />
          {meta && (
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
          )}
        </>
      )}

      <OpportunityForm
        mode={editData ? "edit" : "create"}
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setEditData(null);
          form.resetFields();
        }}
        onSave={handleSave}
        initialValues={editData}
        modalTitle={editData ? "Chỉnh sửa cơ hội" : "Thêm cơ hội"}
        cardTitle="Thông tin cơ hội"
        cancelText="Hủy"
        saveText={editData ? "Lưu thay đổi" : "Xác nhận"}
        loading={false}
        form={form}
      />
    </>
  );
};

export default OpportunityList;