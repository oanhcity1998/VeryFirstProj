import React from "react";
import { Breadcrumb, Button, Card, Descriptions, Table, Tag, Divider, Form, Select } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "../../../app/routes";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";
import {
  FieldMeta,
  ProposalTemplate,
  proposalTemplateMocks,
} from "@/views/HRM/ProposalTemplateList/ProposalTemplateList";

const ProposalTemplateDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const proposal = proposalTemplateMocks.find((item) => item.key === id);

  return (
    <>
      {/* Header */}
      <Breadcrumb style={{ marginBottom: "16px" }}>
        <Breadcrumb.Item>
          <Link to={ROUTES_APP.hrm.proposalTemplateList}>Danh sách mẫu đề xuất</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>Chi tiết mẫu đề xuất</Breadcrumb.Item>
        <Breadcrumb.Item>{proposal?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Card style={{ margin: "0" }}>
        {/* Thông tin chung */}
        <h3>Thông tin chi tiết mẫu đề xuất</h3>
        <Form
          layout="horizontal"
          initialValues={proposal}
          style={{ marginBottom: 24 }}
          labelCol={{ span: 6 }}
          labelAlign="left"
        >
          <Form.Item label="Tên mẫu đề xuất" name="name">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Người tạo" name="creator">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Ngày tạo" name="createdDate">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Bắt buộc phê duyệt" name="approvalRequired">
            <Input readOnly />
          </Form.Item>

          <Form.Item label="Trạng thái" name="status">
            <Select disabled>
              <Select.Option key={status} value={status}>
                status
              </Select.Option>
            </Select>
          </Form.Item>
        </Form>

        <Divider />

        {/* Danh sách trường */}
        <h3>Danh sách trường của mẫu</h3>
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
    </>
  );
};

export default ProposalTemplateDetail;
