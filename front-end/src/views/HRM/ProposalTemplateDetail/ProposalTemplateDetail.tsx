import React from "react";
import { Breadcrumb, Card, Descriptions, Table, Tag, Divider, Form, Select } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ROUTES_APP } from "../../../app/routes";
import Input from "antd/es/input/Input";
import {
  FieldMeta,
  proposalTemplateMocks,
} from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";

const ProposalTemplateDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const proposal = proposalTemplateMocks.find((item) => item.key === id);

  return (
    <>
      {/* Header */}
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link to={ROUTES_APP.hrm.proposalTemplateList}>Danh sách mẫu đề xuất</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết mẫu đề xuất</Breadcrumb.Item>
        <Breadcrumb.Item>{proposal?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card
        className="card-section"
        title={<h2 className="card-title">Chi tiết mẫu đề xuất: {proposal?.name}</h2>}
      >
        <Form
          layout="horizontal"
          initialValues={proposal}
          labelCol={{ span: 6 }}
          labelAlign="left"
          disabled={true}
        >
          <Card title="Thông tin chi tiết mẫu đề xuất" variant="outlined" className="card-section">
            <Form.Item label="Tên mẫu đề xuất" name="name">
              <Input />
            </Form.Item>

            <Form.Item label="Người tạo" name="creator">
              <Input />
            </Form.Item>

            <Form.Item label="Ngày tạo" name="createdDate">
              <Input />
            </Form.Item>

            <Form.Item label="Bắt buộc phê duyệt" name="approvalRequired">
              <Input />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status">
              <Select>
                <Select.Option>
                  status
                </Select.Option>
              </Select>
            </Form.Item>
          </Card>
        </Form>

        <Divider />

        {/* Danh sách trường */}
        <Card title="Danh sách trường của mẫu" variant="outlined" className="card-section">
          <Table<FieldMeta>
            rowKey="id"
            bordered
            pagination={false}
            dataSource={proposal?.fields}
            columns={[
              { title: "Tên trường", dataIndex: "fieldName", key: "fieldName" },
              { title: "Loại dữ liệu", dataIndex: "dataType", key: "dataType" },
              {
                title: "Bắt buộc",
                dataIndex: "required",
                key: "required",
                render: (val: boolean) => (val ? "Có" : "Không"),
              },
              { title: "Ví dụ", dataIndex: "example", key: "example" },
              { title: "Ghi chú", dataIndex: "note", key: "note" },
            ]}
          />
        </Card>
      </Card>
    </>
  );
};

export default ProposalTemplateDetail;
