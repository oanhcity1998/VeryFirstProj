import { useMemo, useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import { OpportunityForm } from "../../../components/OpportunityForm/OpportunityForm";
import { TableOpportunity } from "../../../components/TableOpportunity/TableOpportunity";
import { ROUTES_APP } from "../../../routes";
import { FilterOpportunityDrawer } from "../../../components/Filter/FilterOpportunityDrawer";
import dayjs from "dayjs";
import { Product } from "../QuotationList/QuotationList";

// Interface CRM Opportunity
export interface Opportunity {
  id: number;
  name: string; // Tên cơ hội
  contactName: string; // Tên liên hệ
  company: string; // Công ty
  expectedValue: number; // Giá trị dự kiến
  expectedCloseDate: string; // Ngày dự kiến chốt
  service: Product[]; // Dịch vụ dự kiến
  probability: number; // Xác suất %
  priority: "Low" | "Medium" | "High"; // Ưu tiên
  owner: string; // Nhân viên phụ trách
  // stage: "Qualification" | "Proposal" | "Negotiation" | "Closed Won" | "Closed Lost"; // Giai đoạn
  stage: "Mới" | "Đạt yêu cầu" | "Đàm phán" | "Đóng"; // Giai đoạn
  nextAction?: string; // Hành động tiếp theo
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
    nextAction: "Chuẩn bị demo cho khách hàng",
  },
];

const OpportunityList = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Opportunity[]>(dataSource);

  // 🔎 search + filter
  const [searchText, setSearchText] = useState("");
  const [filterPriority, setFilterPriority] = useState<string | null>(null);
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<[string, string] | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  // [start, end] cho khoảng ngày

  // Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | null>(null);

  // Delete state
  const [deleting, setDeleting] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);

  // 👉 Tạo mới
  const handleCreate = (values: Opportunity) => {
    const newOpportunity: Opportunity = { ...values, id: data.length + 1 };
    setData((prev) => [...prev, newOpportunity]);
    setIsCreateModalOpen(false);
    message.success("Tạo mới cơ hội thành công!");
  };

  // 👉 Chỉnh sửa
  const handleEdit = (values: Opportunity) => {
    if (!selectedOpportunity) return;
    const updated: Opportunity = { ...selectedOpportunity, ...values };
    setData((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
    setIsEditModalOpen(false);
    message.success("Cập nhật cơ hội thành công!");
  };

  // 👉 Xóa
  const handleDelete = async () => {
    try {
      setDeleting(true);
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
      setSelectedRowKeys([]);
      message.success("Đã xóa cơ hội");
      navigate(ROUTES_APP.crm.opportunityList);
    } catch (err) {
      message.error("Không thể xóa cơ hội");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <h2>Danh sách cơ hội</h2>

        <Space>
          <Search
            placeholder="Nhập tên cơ hội..."
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            style={{ maxWidth: 300, marginRight: "auto", marginLeft: 8 }}
          />
          {/* Filter button */}
          <Button
            icon={<FilterOutlined />}
            onClick={() => setFilterOpen(true)}
            style={{ marginLeft: 8 }}
          >
            Bộ lọc
          </Button>
          <FilterOpportunityDrawer
            open={filterOpen}
            onClose={() => setFilterOpen(false)}
            onConfirm={(e) => {
              setFilterOpen(false);
            }}
            filterPriority={filterPriority}
            setFilterPriority={setFilterPriority}
            filterStage={filterStage}
            setFilterStage={setFilterStage}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
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
            <p>Bạn có chắc muốn xóa cơ hội này? Hành động này không thể hoàn tác.</p>
          </Modal>

          {/* Create button */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsCreateModalOpen(true)}>
            Tạo
          </Button>
        </Space>
      </div>

      {/* Bảng cơ hội */}
      <TableOpportunity
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        searchText={searchText}
        onEditClick={(record) => {
          setSelectedOpportunity(record);
          setIsEditModalOpen(true);
        }}
        filterPriority={filterPriority}
        filterStage={filterStage}
        filterDate={filterDate}
      />

      {/* Modal create */}
      <OpportunityForm
        mode="create"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        onOk={handleCreate}
      />

      {/* Modal edit */}
      <OpportunityForm
        mode="edit"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleEdit}
        initialValues={selectedOpportunity}
      />
    </>
  );
};

export default OpportunityList;
