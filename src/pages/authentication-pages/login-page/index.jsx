import { Button, Form, Input, Typography, Card, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, HeartOutlined, MedicineBoxOutlined, SafetyOutlined } from "@ant-design/icons";
import "./index.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import { login } from "../../../apis/authenticationApi/loginApi";
import { useDispatch } from "react-redux";
import { saveInformation } from "../../../redux/feature/userSlice";

const { Title, Text } = Typography;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await login(values);
      toast.success("Login successful!");
      const { token, role, doctorSpecialty } = response.data;
      dispatch(saveInformation(response?.data));
      sessionStorage.setItem("token", token);
      switch (role) {
        case "Patient":
          navigate("/");
          break;

        case "Doctor":
          switch (doctorSpecialty) {
            case "Consultant":
              navigate("/doctorConsultant-dashboard");
              break;
            case "Testing":
              navigate("/doctorTesting-dashboard");
              break;
            case "Therapy":
              navigate("/doctorTherapy-dashboard");
              break;

            // có thể thêm nhiều specialty khác ở đây
            default:
              navigate("/doctor-dashboard"); // fallback nếu specialty không khớp
              break;
          }
          break;

        default:
          navigate("/dashboard"); // fallback cho các role khác như Admin, Nurse,...
          break;
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling logic login!"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-background-overlay"></div>
      
      <div className="login-content">
        {/* Left Side - Branding & Info */}
        <div className="login-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <MedicineBoxOutlined />
            </div>
            <Title level={1} className="brand-title">
              HIV Support
            </Title>
            <Title level={3} className="brand-subtitle">
              Medical Portal
            </Title>
            <Text className="brand-description">
              Advanced healthcare management system providing comprehensive HIV treatment and support services
            </Text>
            
            <div className="features-list">
              <div className="feature-item">
                <SafetyOutlined className="feature-icon" />
                <span>Secure & Confidential</span>
              </div>
              <div className="feature-item">
                <HeartOutlined className="feature-icon" />
                <span>Compassionate Care</span>
              </div>
              <div className="feature-item">
                <MedicineBoxOutlined className="feature-icon" />
                <span>Expert Medical Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="login-form-section">
          <Card className="login-card">
            <div className="login-header">
              <Title level={2} className="login-title">
                Welcome Back
              </Title>
              <Text className="login-subtitle">
                Sign in to access your healthcare dashboard
              </Text>
            </div>

            <Form
              layout="vertical"
              onFinish={onFinish}
              className="login-form"
              autoComplete="off"
              size="large"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please input your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined className="input-icon" />}
                  placeholder="Enter your email address"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: "Please input your password!" },
                  { min: 5, message: "Password must be at least 5 characters!" },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined className="input-icon" />}
                  placeholder="Enter your password"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item className="login-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-btn"
                  loading={isLoading}
                  block
                  size="large"
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="login-divider">
              <Text type="secondary">Need Help?</Text>
            </Divider>

            <div className="login-links">
              <Link to="/forgotpassword-page" className="forgot-link">
                Forgot your password?
              </Link>
              <Space className="register-section">
                <Text type="secondary">Don't have an account?</Text>
                <Link to="/register-page" className="register-link">
                  Create Account
                </Link>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
