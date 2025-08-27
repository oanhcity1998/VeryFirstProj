// src/views/LeadList/LeadList.tsx
import { useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined, FilterOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import TableLead, { Lead } from "../../../components/TableLead/TableLead";
import "./LeadList.css";
import LeadForm from "../../../components/LeadForm/LeadForm";

const dataSource: Lead[] = [
  {
    id: 1,
    leadName: "Lead 1",
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
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const handleDelete = () => {
    setDeleting(true);
    setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.id)));
    setSelectedRowKeys([]);
    message.success("Đã xóa lead");
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



  return (
    <>
      <div className="leadlist-header">
        <h2>Danh sách lead</h2>
        <Search
          placeholder="Tìm kiếm lead..."
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          className="leadlist-search"
        />

        <Space>
          <Button>Cơ hội</Button>
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
            <p>Bạn có chắc muốn xóa lead này?</p>
          </Modal>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            Tạo
          </Button>
        </Space>
      </div>

      <TableLead
        data={data}
        searchText={searchText}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={handleEdit}   
      />

      <Modal
        open={openForm}
        title={editData ? "Chỉnh sửa Lead" : "Thêm mới Lead"}
        onCancel={() => setOpenForm(false)}
        footer={null}
        destroyOnClose
        >
        <LeadForm
            initialValues={editData}
            onCancel={() => setOpenForm(false)}
            onSubmit={handleSubmit}
        />
        </Modal>

    </>
  );
};

export default LeadList;
