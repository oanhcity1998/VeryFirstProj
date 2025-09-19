import { useState } from "react";
import { Button, Space } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Search from "antd/es/input/Search";
import TableProposal from "@/components/HRM/TableProposal/TableProposal";

export interface Proposal {
  key: string;
  title: string;        // Tên đề xuất
  type: string;         // Loại đề xuất
  creator: string;      // Người tạo
  approver: string;     // Người duyệt
  createdDate: string;  // Ngày tạo
  approvedDate: string; // Ngày duyệt
  status: "Đã duyệt" | "Chưa duyệt";
}

const mockProposals: Proposal[] = [
  {
    key: "P001",
    title: "Xin nghỉ ốm",
    type: "Nghỉ phép",
    creator: "Nguyễn Văn A",
    approver: "Trần Văn B",
    createdDate: "01/09/2025",
    approvedDate: "02/09/2025",
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
    status: "Chưa duyệt",
  },
];

const ProposalList: React.FC = () => {
  const [data, setData] = useState<Proposal[]>(mockProposals);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

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
                setData(
                  mockProposals.filter((p) =>
                    p.title.toLowerCase().includes(value)
                  )
                );
              }}
            />
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={selectedRowKeys.length === 0}
            >
              Xóa
            </Button>
            <Button type="primary" icon={<PlusOutlined />}>
              Tạo
            </Button>
          </Space>
        </div>
      </div>

      <TableProposal
        data={data}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
        onEdit={(record) => console.log("edit", record)}
      />
    </>
  );
};

export default ProposalList;
