import { Button, Card, Col, Row, Typography, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { ExclamationCircleOutlined, ArrowLeftOutlined, HomeOutlined } from "@ant-design/icons";
import { ROUTES_APP } from "../../../app/routes";

const { Title, Paragraph, Text } = Typography;

export const NotFound = () => {
    const navigate = useNavigate();

    return (
        <Row justify="center" align="middle" style={{ minHeight: "100vh", background: "#f5f6fa" }}>
            <Col xs={22} sm={20} md={14} lg={10} xl={8}>
                <Card
                    bordered={false}
                    style={{
                        textAlign: "center",
                        borderRadius: 16,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                        padding: "40px 24px",
                    }}
                >
                    <div style={{ marginBottom: 24 }}>
                        <ExclamationCircleOutlined style={{ fontSize: 64, color: "#fa8c16" }} />
                    </div>

                    <Title level={2} style={{ marginBottom: 8 }}>
                        404 - Không Tìm Thấy Trang
                    </Title>
                    <Paragraph type="secondary" style={{ marginBottom: 32 }}>
                        Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
                        Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
                    </Paragraph>

                    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                        <Button
                            type="primary"
                            size="large"
                            icon={<HomeOutlined />}
                            block
                            onClick={() => navigate(ROUTES_APP.home)}
                        >
                            Quay về Trang Chủ
                        </Button>

                    </Space>

                    <div style={{ marginTop: 40 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            © {new Date().getFullYear()} Công ty của bạn. All rights reserved.
                        </Text>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};
