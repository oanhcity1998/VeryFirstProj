import { useState } from "react";
import { Card, Input, Button, Form, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/services/public/auth.service";
import "./Login.css";
import { ROUTES_APP } from "@/app/routes";
import useToast from "@/hooks/useToast";

const { Title, Text } = Typography;

export default function Login() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { success, error: toastError } = useToast();

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await login({
        username: values.email,
        password: values.password,
      }).unwrap();

      success("Đăng nhập thành công!");
      navigate(ROUTES_APP.home);
    } catch (err: any) {
      toastError(`Đăng nhập thất bại: ${err.message || "Email hoặc mật khẩu không hợp lệ"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <Card className="login-card" bordered={false}>
        <div className="login-header">
          <Title level={3} className="login-title">
            Management System
          </Title>
          <Text className="login-subtitle">Đăng nhập để tiếp tục</Text>
        </div>

        <Form name="login" onFinish={onFinish} layout="vertical" className="login-form">
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Vui lòng nhập Email!" }]}
            className="margin-bottom-16"
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Nhập email"
              size="large"
              className="login-input"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
            className="margin-bottom-16"
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Nhập mật khẩu"
              size="large"
              className="login-input"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-button"
              size="large"
              loading={loading || isLoading}
              block
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-footer">
            <a href="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
}
