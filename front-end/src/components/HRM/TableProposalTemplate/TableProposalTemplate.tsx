import React from "react";
import { Button, Space, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { EditOutlined } from "@ant-design/icons";
import { generatePath, useNavigate } from "react-router-dom";
import { Key } from "antd/lib/table/interface";
import { ProposalTemplate } from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";
import { ROUTES_APP } from "@/app/routes";

interface TableProposalTemplateProps {
  data?: ProposalTemplate[];
  selectedRowKeys?: Key[];
  setSelectedRowKeys?: (keys: Key[]) => void;
  onEdit?: (record: ProposalTemplate) => void;
  onShowClick?: (record: ProposalTemplate) => void;
  selectable?: boolean;
}

const TableProposalTemplate: React.FC<TableProposalTemplateProps> = ({
  data = [],
  selectedRowKeys,
  setSelectedRowKeys,
  onEdit,
  onShowClick,
  selectable = true,
}) => {
  const navigate = useNavigate();

  const handleEdit = (record: ProposalTemplate) => {
    if (onEdit) {
      onEdit(record);
    }
  };

  const columns: ColumnsType<ProposalTemplate> = [
    {
      title: "Tên mẫu đề xuất",
      dataIndex: "name",
      key: "name",
      align: "center",
      width: 150,
      fixed: "left",
      render: (value: string, record: ProposalTemplate) => (
        <Typography.Link
          className="contact-link"
          onClick={() => {
            if (onShowClick) {
              onShowClick(record);
            } else {
              navigate(generatePath(ROUTES_APP.hrm.proposalTemplateDetail, { id: record.key }));
            }
          }}
        >
          {value}
        </Typography.Link>
      ),
    },
    {
      title: "Người tạo",
      dataIndex: "creator",
      key: "creator",
      align: "center",
      width: 150,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdDate",
      key: "createdDate",
      align: "center",
      width: 150,
    },
    {
      title: "Số lượng đề xuất",
      dataIndex: "quantity",
      key: "quantity",
      align: "center",
      width: 150,
    },
    {
      title: "Bắt buộc phê duyệt",
      dataIndex: "approvalRequired",
      key: "approvalRequired",
      align: "center",
      width: 150,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      width: 150,
    },
    {
      title: "",
      key: "action",
      width: 60,
      align: "center",
      render: (_: any, record: ProposalTemplate) => (
        <Space size="middle">
          <Button
            className="base-edit-icon"
            type="link"
            onClick={() => handleEdit(record)}
            icon={<EditOutlined />}
          />
        </Space>
      ),
    },
  ];

  return (
    <Table
      {...(selectable && setSelectedRowKeys
        ? {
          rowSelection: {
            selectedRowKeys,
            onChange: (keys: Key[]) => setSelectedRowKeys(keys),
          },
        }
        : {})}
      className="base-table"
      columns={columns}
      dataSource={data}
      pagination={false}
      rowKey="key"
      scroll={{ x: "max-content" }}
    />
  );
};

export default TableProposalTemplate;