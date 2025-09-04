import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Typography } from "antd";
import { TeamOutlined, ShopOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "../routes";
import "./Home.css"; // 👈 thêm file css

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-header">
        <Title level={2} className="home-title">
          Chào mừng đến với hệ thống quản lý
        </Title>
        <Paragraph className="home-subtitle">
          Vui lòng chọn một phân hệ để bắt đầu:
        </Paragraph>
      </div>

      <Row gutter={[24, 24]} justify="center" className="home-cards">
        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            className="home-card"
            onClick={() => navigate(ROUTES_APP.crm.homeCRM)}
          >
            <div className="icon-wrapper crm">
              <ShopOutlined className="card-icon" />
            </div>
            <Card.Meta
              title={<Title level={4} className="card-title">CRM</Title>}
              description="Quản lý khách hàng, cơ hội, báo giá và sản phẩm."
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} md={8}>
          <Card
            hoverable
            className="home-card"
            onClick={() => navigate(ROUTES_APP.hrm.homeHRM)}
          >
            <div className="icon-wrapper hrm">
              <TeamOutlined className="card-icon" />
            </div>
            <Card.Meta
              title={<Title level={4} className="card-title">HRM</Title>}
              description="Quản lý nhân sự, phòng ban và chức vụ."
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
