import React from "react";
import { Breadcrumb, Button, Card } from "antd";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";
import "./ContactDetail.css";
import { ROUTES_APP } from "../../../routes";

const ContactDetail: React.FC = () => {
  const { id } = useParams(); // lấy contact id từ URL
  const navigate = useNavigate();

  // Mock data – sau này thay bằng gọi API
  const contact = {
    id,
    contactName: "Nguyễn Văn A",
    customerName: "Công ty TNHH ABC",
    phone: "0901234567",
    email: "vana@abc.com",
    title: "Giám đốc",
    mainContact: "Nguyễn Văn A",
    note: "Khách hàng lâu năm",
  };

  return (
    <div className="contact-detail-container">
      <div className="contact-detail-header">
        <Breadcrumb className="contact-detail-breadcrumb" separator=">">
          <Breadcrumb.Item>
            <Link to={ROUTES_APP.crm.contactList}>Danh sách liên hệ</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>{contact.contactName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <Card>
        <div className="contact-detail-title">Chi tiết {contact.contactName}</div>

        <div className="contact-detail-form">
          <div className="form-row first-row">
            <label>Tên liên hệ:</label>
            <input value={contact.contactName} disabled />
          </div>
          <div className="form-row">
            <label>Khách hàng:</label>
            <input value={contact.customerName} disabled />
          </div>
          <div className="form-row">
            <label>Điện thoại:</label>
            <input value={contact.phone} disabled />
          </div>
          <div className="form-row">
            <label>Email:</label>
            <input value={contact.email} disabled />
          </div>
          <div className="form-row">
            <label>Chức vụ:</label>
            <input value={contact.title} disabled />
          </div>
          <div className="form-row">
            <label>Liên hệ chính:</label>
            <input value={contact.mainContact} disabled />
          </div>
          <div className="form-row last-row">
            <label>Ghi chú:</label>
            <input value={contact.note} disabled />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ContactDetail;
