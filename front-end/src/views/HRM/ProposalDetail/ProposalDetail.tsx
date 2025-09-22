import React from "react";
import { Breadcrumb, Card, Descriptions, Table, Divider, Tag, Form, Input, Select } from "antd";
import { useParams, Link } from "react-router-dom";
import { ROUTES_APP } from "../../../app/routes";
import { Proposal, statusProposalOptions } from "@/views/HRM/ProposalList/ProposalList"; // lấy interface Proposal bạn đã định nghĩa
import { mockProposals } from "@/views/HRM/ProposalList/ProposalList"; // mock data demo

const ProposalDetail: React.FC = () => {
  const { id } = useParams();
  const proposal: Proposal | undefined = mockProposals.find((p) => p.key === id);

  if (!proposal) {
    return <Card>Không tìm thấy đề xuất</Card>;
  }

  return (
    <>
      {/* Header */}
      <div className="detail-header">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.hrm.proposalList}>Danh sách đề xuất</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Chi tiết đề xuất</Breadcrumb.Item>
          <Breadcrumb.Item>{proposal.title}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      {/* Thông tin chi tiết */}
      <Card
        className="card-section"
        title={<h2 className="card-title">Chi tiết đề xuất: {proposal.title}</h2>}
      >
        <Form
          layout="horizontal"
          initialValues={proposal}
          labelCol={{ span: 6 }}
          labelAlign="left"
          disabled={true}
        >
          <Form.Item label="Tên đề xuất" name="title">
            <Input />
          </Form.Item>

          <Form.Item label="Người tạo" name="creator">
            <Input />
          </Form.Item>

          <Form.Item label="Loại đề xuất" name="type">
            <Input />
          </Form.Item>

          <Form.Item label="Lý do" name="reason">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày nghi" name="dayoff">
            <Input />
          </Form.Item>

          <Form.Item label="Người duyệt" name="approver">
            <Input />
          </Form.Item>

          <Form.Item label="Ngày duyệt" name="approvedDate">
            <Input />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select>
              {statusProposalOptions.map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default ProposalDetail;
