import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Proposal } from "@/views/HRM/ProposalList/ProposalList";
import { generatePath, Link } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";

interface TableProposalProps {
  data?: Proposal[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: Proposal) => void;
}

const TableProposal: React.FC<TableProposalProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEdit,
}) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => setSelectedRowKeys(e.target.checked ? allKeys : [])}
        />
      ),
      dataIndex: "option",
      width: 50,
      align: "center" as const,
      render: (_: any, record: Proposal) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e) =>
            setSelectedRowKeys(
              e.target.checked
                ? [...selectedRowKeys, record.key]
                : selectedRowKeys.filter((k) => k !== record.key)
            )
          }
        />
      ),
    },
    {
      title: "Tên đề xuất",
      dataIndex: "title",
      align: "center",
      key: "title",
      render: (text: string, record: Proposal) => (
        <Link to={generatePath(ROUTES_APP.hrm.proposalDetail, { id: record.key })}>{text}</Link>
      ),
    },
    { align: "center", title: "Loại đề xuất", dataIndex: "type", key: "type" },
    { align: "center", title: "Người tạo", dataIndex: "creator", key: "creator" },
    { align: "center", title: "Người duyệt", dataIndex: "approver", key: "approver" },
    { align: "center", title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate" },
    { align: "center", title: "Ngày duyệt", dataIndex: "approvedDate", key: "approvedDate" },
    { align: "center", title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: Proposal) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => onEdit?.(record)} />
      ),
    },
  ];

  return (
    <Table
      className="base-table"
      columns={columns}
      dataSource={data}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 10,
        showSizeChanger: false,
      }}
      rowKey="key"
    />
  );
};

export default TableProposal;
