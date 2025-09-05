import React from "react";
import { Descriptions, Breadcrumb, Button, Card } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./LeadDetail.css";
import { ROUTES_APP } from "../../../routes";

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
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.leadList}>Danh sách lead</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{lead.leadName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="lead-detail-content">
        <div className="lead-detail-title">Chi tiết {lead.leadName}</div>
        <div className="lead-detail-form">
          <div className="form-row first-row">
            <label>Tên lead:</label>
            <input value={lead.leadName} disabled />
          </div>
          <div className="form-row">
            <label>Tên liên hệ:</label>
            <input value={lead.contactName} disabled />
          </div>
          <div className="form-row">
            <label>Chức vụ:</label>
            <input value={lead.position} disabled />
          </div>
          <div className="form-row">
            <label>Công ty:</label>
            <input value={lead.company} disabled />
          </div>
          <div className="form-row">
            <label>Email:</label>
            <input value={lead.email} disabled />
          </div>
          <div className="form-row">
            <label>Số điện thoại:</label>
            <input value={lead.phone} disabled />
          </div>
          <div className="form-row">
            <label>Địa chỉ:</label>
            <input value={lead.address} disabled />
          </div>
          <div className="form-row">
            <label>Website:</label>
            <input value={lead.website} disabled />
          </div>
          <div className="form-row">
            <label>Nguồn:</label>
            <input value={lead.source} disabled />
          </div>
          <div className="form-row">
            <label>Ưu tiên:</label>
            <input value={lead.priority} disabled />
          </div>
          <div className="form-row">
            <label>Nhân viên phụ trách:</label>
            <input value={lead.owner} disabled />
          </div>
          <div className="form-row last-row">
            <label>Trạng thái:</label>
            <input value={lead.status} disabled />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
