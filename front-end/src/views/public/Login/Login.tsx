import { useEffect } from "react";
import { Card, Input, Button, Checkbox, Form, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, } from "@/app/store";
import "./Login.css";
import { ROUTES_APP } from "@/app/routes";
import { setCredentials, setError, setLoading } from "@/redux/public/slices/authSlice";
import { useLoginMutation } from "@/services/public/auth.service";

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isLoading) {
      setLoading();
      dispatch(setLoading());
    }
  }, [isLoading, dispatch]);

  useEffect(() => {
    if (error) {
      setLoading();
      dispatch(setError('Invalid email or password'));
      message.error('Invalid email or password');
    }
  }, [error, dispatch]);

  const onFinish = async (values: any) => {
    try {
      const response = await login({
        username: values.email,
        password: values.password,
      }).unwrap();

      dispatch(setCredentials({ uid: response.uid }));
      message.success(response.message);
      setLoading();
      navigate(ROUTES_APP.home || '/home');
    } catch (err) {
      // Error is handled by useEffect
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