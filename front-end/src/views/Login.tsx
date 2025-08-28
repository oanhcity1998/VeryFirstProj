import { useState } from "react";
import { Card, Input, Button, Checkbox, Form, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { ROUTES_APP } from "../routes";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = (values) => {
    setLoading(true);

    // ✅ Check credentials (admin/admin allowed)
    if (values.email === "admin" && values.password === "admin") {
      message.success("Login successful!");
      setTimeout(() => {
        setLoading(false);
        navigate(ROUTES_APP.login); // redirect to homepage
      }, 1000);
    } else {
      message.error("Invalid email or password");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Card className="login-card" bordered={false}>
        <div className="login-logo">
          <img src="/logo.png" alt="Logo" />
        </div>
        <Title level={4} className="login-title">
          Sign in to your account
        </Title>

        <Form name="login" onFinish={onFinish} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your Password!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
          </Form.Item>

          <Form.Item>
            <div className="login-options">
              <Checkbox>Keep me logged in</Checkbox>
              <a href="/forgot-password">Forgot password?</a>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              size="large"
              loading={loading}
              block
            >
              Log in
            </Button>
          </Form.Item>
        </Form>

        <Text className="signup-text">
          Don’t have an account? <a href="/signup">Sign up</a>
        </Text>
      </Card>
    </div>
  );
}
