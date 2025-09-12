// src/views/LeadList/LeadList.tsx
import { useState } from "react";
import { Button, Space, Modal, message, Select, Checkbox } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import "./LeadList.css";
import TableLead, { Lead } from "@/components/CRM/TableLead/TableLead";
import LeadForm from "@/components/CRM/LeadForm/LeadForm";

const dataSource: Lead[] = [
  {
    id: 1,
    leadName: "Khách tiềm năng 1",
    contactName: "Nguyễn Thùy Linh",
    email: "thuy@example.com",
    phone: "098454546",
    priority: "Cao",
    owner: "Văn A.",
    status: "Khách hàng mới",
  },
];

const LeadList = () => {
  const [data, setData] = useState(dataSource);
  const [searchText, setSearchText] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [opportunityOpen, setOpportunityOpen] = useState(false);
  const [converting, setConverting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: null,
    priority: null,
  });

  const handleDelete = () => {
    setDeleting(true);
    setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success("Đã xóa Khách tiềm năng");
    setDeleteOpen(false);
    setDeleting(false);
  };

  const handleCreate = () => {
    setEditData(null);
    setOpenForm(true);
  };

  const handleSubmit = (values: any) => {
    console.log("Form values:", values);
    setOpenForm(false);
  };

  const handleEdit = (record: any) => {
    setEditData(record);
    setOpenForm(true);
  };

  const handleCancel = () => {
    setOpenForm(false);
  };

  const handleConvertToOpportunity = () => {
    setConverting(true);
    // Example: convert logic here
    message.success("Khách tiềm năng đã được chuyển thành cơ hội");
    setSelectedRowKeys([]);
    setOpportunityOpen(false);
    setConverting(false);
  };

  const statusOptions = ["Khách hàng mới", "Đang chăm sóc", "Chưa quan tâm"];
  const priorityOptions = ["Có", "Không"];

  // Status popover content
  const StatusContent = (
    <div className="filter-popover">
      {statusOptions.map((opt) => (
        <Checkbox
          key={opt}
          checked={statusFilter.includes(opt)}
          onChange={(e) => {
            setStatusFilter((prev) =>
              e.target.checked ? [...prev, opt] : prev.filter((v) => v !== opt)
            );
          }}
        >
          {opt}
        </Checkbox>
      ))}
      <div className="filter-actions">
        <Button size="small" type="link" onClick={() => setStatusFilter([])}>
          Xoá chọn
        </Button>
      </div>
    </div>
  );

  const filteredData = data.filter((item) => {
    const matchStatus = filters.status ? item.status === filters.status : true;
    const matchPriority = filters.priority ? item.priority === filters.priority : true;
    return matchStatus && matchPriority;
  });

  return (
    <>
      <div className="leadlist-header">
        <h2>Danh sách khách hàng tiềm năng</h2>

        <Space>
          <Search
            placeholder="Tìm kiếm Khách tiềm năng..."
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="leadlist-search"
          />
          <Select
            allowClear
            placeholder="Trạng thái"
            style={{ width: 180 }}
            value={filters.status}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={[
              { label: "Khách hàng mới", value: "Khách hàng mới" },
              { label: "Đang chăm sóc", value: "Đang chăm sóc" },
              { label: "Chưa quan tâm", value: "Chưa quan tâm" },
            ]}
          />

          <Select
            allowClear
            placeholder="Ưu tiên"
            style={{ width: 150 }}
            value={filters.priority}
            onChange={(val) => setFilters((prev) => ({ ...prev, priority: val }))}
            options={[
              { label: "Cao", value: "Cao" },
              { label: "Thấp", value: "Thấp" },
            ]}
          />

          {/* Opportunity button  */}
          <Button onClick={() => setOpportunityOpen(true)} disabled={selectedRowKeys.length === 0}>
            Cơ hội
          </Button>
          {/* Opportunity Modal */}
          <Modal
            open={opportunityOpen}
            title="Chuyển thành cơ hội"
            onOk={handleConvertToOpportunity}
            onCancel={() => setOpportunityOpen(false)}
            okText="Xác nhận"
            cancelText="Hủy"
            okButtonProps={{ loading: converting }}
            centered
          >
            <p>Bạn có muốn chuyển Khách tiềm năng này thành cơ hội?</p>
          </Modal>

          {/* Delete button  */}
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => setDeleteOpen(true)}
            disabled={selectedRowKeys.length === 0}
          >
            Xóa
          </Button>
          {/* Delete Modal  */}
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
            <p>Bạn có chắc muốn xóa Khách tiềm năng này?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo
          </Button>
        </Space>
      </div>

      <TableLead
        data={filteredData}
        searchText={searchText}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}
      />

      <Modal
        open={openForm}
        title={editData ? "Chỉnh sửa Khách tiềm năng" : "Thêm mới Khách tiềm năng"}
        onCancel={() => setOpenForm(false)}
        footer={null}
        destroyOnClose
      >
        <LeadForm
          open={openForm}
          initialValues={editData}
          onCancel={() => setOpenForm(false)}
          onSubmit={handleSubmit}
        />
      </Modal>
    </>
  );
};

export default LeadList;
