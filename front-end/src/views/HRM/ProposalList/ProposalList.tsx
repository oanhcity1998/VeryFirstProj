import { useState } from "react";
import { Button, Space, Modal, message } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import TableProposal from "@/components/HRM/TableProposal/TableProposal";
import ProposalForm from "@/components/HRM/ProposalForm/ProposalForm"; // ⚡ form modal riêng cho Proposal

export interface Proposal {
  key: string;
  title: string; // Tên đề xuất
  type: string; // Loại đề xuất
  creator: string; // Người tạo
  approver?: string; // Người duyệt
  createdDate: string; // Ngày tạo
  approvedDate?: string; // Ngày duyệt
  reason?: string; // Lý do
  dayoff?: string; // Ngày nghỉ
  status: "Đã duyệt" | "Chưa duyệt";
}

export const mockProposals: Proposal[] = [
  {
    key: "P001",
    title: "Xin nghỉ ốm",
    type: "Nghỉ phép",
    creator: "Nguyễn Văn A",
    approver: "Trần Văn B",
    createdDate: "01/09/2025",
    approvedDate: "02/09/2025",
    reason: "Ốm nặng",
    dayoff: "01/09/2025",
    status: "Đã duyệt",
  },
  {
    key: "P002",
    title: "Đi công tác",
    type: "Công tác",
    creator: "Lê Văn C",
    approver: "Trần Văn B",
    createdDate: "05/09/2025",
    approvedDate: "",
    reason: "Đi họp khách hàng",
    dayoff: "05/09/2025",
    status: "Chưa duyệt",
  },
];

export const proposalTypeOptions = [
  { value: "Nghỉ phép", label: "Nghỉ phép" },
  { value: "Công tác", label: "Công tác" },
  { value: "Khác", label: "Khác" },
];

export const statusProposalOptions = [
  { value: "Đã duyệt", label: "Đã duyệt" },
  { value: "Chưa duyệt", label: "Chưa duyệt" },
];

const ProposalList: React.FC = () => {
  const [data, setData] = useState<Proposal[]>(mockProposals);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);

  // ✅ Thêm / Sửa
  const handleSave = (values: Proposal) => {
    if (selectedProposal) {
      // update
      setData((prev) =>
        prev.map((item) => (item.key === selectedProposal.key ? { ...item, ...values } : item))
      );
      message.success("Cập nhật đề xuất thành công");
    } else {
      // create
      const newProposal: Proposal = {
        ...values,
        key: `P${Date.now()}`,
        creator: "Nguyễn Văn Admin", // mặc định người tạo
        createdDate: new Date().toLocaleDateString("vi-VN"),
        status: "Chưa duyệt",
      };
      setData((prev) => [...prev, newProposal]);
      message.success("Thêm đề xuất thành công");
    }

    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  // ✅ Xóa
  const handleDelete = async () => {
    try {
      setDeleting(true);
      await new Promise((res) => setTimeout(res, 1000));
      setData((prev) => prev.filter((item) => !selectedRowKeys.includes(item.key)));
      message.success("Đã xóa đề xuất");
    } catch {
      message.error("Xóa thất bại");
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setSelectedRowKeys([]);
    }
  };

  return (
    <>
      <div className="list-header">
        <h2>Danh sách đề xuất</h2>
        <div className="list-actions">
          <Space wrap>
            <Search
              placeholder="Tìm kiếm đề xuất"
              allowClear
              onChange={(e) => {
                const value = e.target.value.toLowerCase();
                setData(mockProposals.filter((p) => p.title.toLowerCase().includes(value)));
              }}
            />

            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
              onClick={() => setDeleteOpen(true)}
            >
              Xóa
            </Button>

            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setSelectedProposal(null);
                setIsModalOpen(true);
              }}
            >
              Tạo
            </Button>
          </Space>
        </div>
      </div>

      <TableProposal
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={(record) => {
          setSelectedProposal(record);
          setIsModalOpen(true);
        }}
      />

      {/* Modal Xác nhận Xóa */}
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
        <p>Bạn có chắc muốn xóa đề xuất này?</p>
      </Modal>

      {/* Modal Form Thêm/Sửa */}
      <ProposalForm
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setSelectedProposal(null);
        }}
        onSave={handleSave}
        proposal={selectedProposal}
        modalTitle={selectedProposal ? "Cập nhật đề xuất" : "Thêm đề xuất"}
        cancelText="Hủy"
        saveText="Xác nhận"
      />
    </>
  );
};

export default ProposalList;
