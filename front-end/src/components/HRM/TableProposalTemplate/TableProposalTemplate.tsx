import { useState } from "react";
import { Table, Checkbox, Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { ProposalTemplate } from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";
import { generatePath, Link } from "react-router-dom";
import { ROUTES_APP } from "@/app/routes";

interface TableProposalTemplateProps {
  data?: ProposalTemplate[];
  selectedRowKeys?: string[];
  setSelectedRowKeys: (keys: string[]) => void;
  onEdit?: (record: ProposalTemplate) => void;
}

const TableProposalTemplate: React.FC<TableProposalTemplateProps> = ({
  data = [],
  selectedRowKeys = [],
  setSelectedRowKeys,
  onEdit,
}) => {
  const allKeys = data.map((item) => item.key);
  const isAllChecked = selectedRowKeys.length === data.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < data.length;

  const handleEdit = (record: ProposalTemplate) => {
    if (onEdit) onEdit(record);
  };

  const columns = [
    {
      title: (
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys(allKeys);
            } else {
              setSelectedRowKeys([]);
            }
          }}
        />
      ),
      dataIndex: "option",
      width: 60,
      fixed: "left" as const,
      align: "center" as const,
      render: (_: any, record: ProposalTemplate) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.key)}
          onChange={(e: { target: { checked: boolean } }) => {
            if (e.target.checked) {
              setSelectedRowKeys([...selectedRowKeys, record.key]);
            } else {
              setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.key));
            }
          }}
        />
      ),
    },
    {
      title: "Tên mẫu đề xuất",
      dataIndex: "name",
      key: "name",
      width: 200,
      align: "center" as const,
      fixed: "left" as const,
      render: (value: string, record: ProposalTemplate) => (
        <Link to={generatePath(ROUTES_APP.hrm.proposalTemplateDetail, { id: record.key })}>
          {value}
        </Link>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Số lượng đề xuất",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      align: "center" as const,
    },
    {
      title: "Bắt buộc phê duyệt",
      dataIndex: "approvalRequired",
      key: "approvalRequired",
      width: 150,
      align: "center" as const,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      align: "center" as const,
    },
    {
      title: "",
      key: "action",
      fixed: "right" as const,
      width: 80,
      align: "center" as const,
      render: (_: any, record: ProposalTemplate) => (
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
          className="template-edit-icon"
        ></Button>
      ),
    },
  ];

  return (
    <Table
      className="proposal-template-table"
      columns={columns}
      dataSource={data}
      pagination={{
        position: ["bottomCenter"],
        pageSize: 10,
        showSizeChanger: false,
      }}
      rowKey="key"
      scroll={{ x: 1200, y: 600 }}
      rowClassName={(record: ProposalTemplate) =>
        selectedRowKeys.includes(record.key) ? "selected-row" : ""
      }
    />
  );
};

export default TableProposalTemplate;
