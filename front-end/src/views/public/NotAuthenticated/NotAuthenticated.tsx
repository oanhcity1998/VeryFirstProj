import { Button, Card, Col, Row, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { LockOutlined, LoginOutlined } from "@ant-design/icons";

import { ROUTES_APP } from "../../../app/routes";

const { Title, Paragraph, Text } = Typography;

export const NotAuthenticated = () => {
    const navigate = useNavigate();

    return (
        <Row justify="center" align="middle" className="error-page">
            <Col xs={22} sm={20} md={14} lg={10} xl={8}>
                <Card className="error-card">
                    <div className="error-icon-wrapper">
                        <LockOutlined className="error-icon warning" />
                    </div>

                    <Title level={2} className="error-title">
                        401 - Không Có Quyền Truy Cập
                    </Title>
                    <Paragraph className="error-subtitle">
                        Bạn cần đăng nhập để truy cập vào trang này.
                        Vui lòng đăng nhập hoặc liên hệ quản trị viên.
                    </Paragraph>

                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<LoginOutlined />}
                            block
                            onClick={() => navigate(ROUTES_APP.login)}
                        >
                            Đăng Nhập Ngay
                        </Button>

                        <Button
                            size="large"
                            block
                            onClick={() => navigate(-1)}
                        >
                            Quay Lại Trang Trước
                        </Button>
                    </Space>

                    <div className="error-footer">
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            © {new Date().getFullYear()} Công ty của bạn. All rights reserved.
                        </Text>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};
