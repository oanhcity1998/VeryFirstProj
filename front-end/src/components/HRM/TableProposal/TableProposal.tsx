import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { Proposal } from "@/views/HRM/ProposalList/ProposalList";

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
  const isIndeterminate =
    selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) =>
            setSelectedRowKeys(e.target.checked ? allKeys : [])
          }
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
    { title: "Tên đề xuất", dataIndex: "title", key: "title" },
    { title: "Loại đề xuất", dataIndex: "type", key: "type" },
    { title: "Người tạo", dataIndex: "creator", key: "creator" },
    { title: "Người duyệt", dataIndex: "approver", key: "approver" },
    { title: "Ngày tạo", dataIndex: "createdDate", key: "createdDate" },
    { title: "Ngày duyệt", dataIndex: "approvedDate", key: "approvedDate" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Hành động",
      key: "action",
      align: "center" as const,
      render: (_: any, record: Proposal) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => onEdit?.(record)}
        />
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
