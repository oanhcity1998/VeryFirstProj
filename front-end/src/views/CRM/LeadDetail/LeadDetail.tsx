import React from "react";
import { Descriptions, Breadcrumb, Button } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./LeadDetail.css";

const LeadDetail: React.FC = () => {
  const { id } = useParams(); // 👈 get lead id from URL
  const navigate = useNavigate();

  // Mock data – later replace with API call
  const lead = {
    id,
    leadName: "Lead 1",
    contactName: "Nguyễn Thùy Linh",
    position: "Tạp vụ",
    company: "Piggy Hotel",
    email: "thuyinhvippro@gmail.com",
    phone: "0904157687",
    address: "HBT, Hanoi",
    website: "piggyhotel.com",
    source: "Website SEO",
    priority: "Cao",
    owner: "Nguyễn Văn A",
    status: "Mới",
  };

  return (
    <div className="lead-detail-container">
        <div className="lead-detail-header">
            <Button
            icon={<ArrowLeftOutlined />}
            type="text"
            onClick={() => navigate(-1)}
            className="back-button"
            />
            <Breadcrumb className="lead-detail-breadcrumb" separator=">">
            <Breadcrumb.Item>Danh sách lead</Breadcrumb.Item>
            <Breadcrumb.Item>{lead.leadName}</Breadcrumb.Item>
            </Breadcrumb>
        </div>

      <div className="lead-detail-content">
        <Descriptions bordered column={1} size="middle">
          <Descriptions.Item label="Tên lead">{lead.leadName}</Descriptions.Item>
          <Descriptions.Item label="Tên liên hệ">{lead.contactName}</Descriptions.Item>
          <Descriptions.Item label="Chức vụ">{lead.position}</Descriptions.Item>
          <Descriptions.Item label="Công ty">{lead.company}</Descriptions.Item>
          <Descriptions.Item label="Email">{lead.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại">{lead.phone}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ">{lead.address}</Descriptions.Item>
          <Descriptions.Item label="Website">{lead.website}</Descriptions.Item>
          <Descriptions.Item label="Nguồn">{lead.source}</Descriptions.Item>
          <Descriptions.Item label="Ưu tiên">{lead.priority}</Descriptions.Item>
          <Descriptions.Item label="Nhân viên phụ trách">{lead.owner}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái">{lead.status}</Descriptions.Item>
        </Descriptions>
      </div>
    </div>
  );
};

export default LeadDetail;
