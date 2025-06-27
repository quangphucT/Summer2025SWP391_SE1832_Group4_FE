import { Button, Form, Input, Card, Typography, Space, Divider } from "antd";
import { MailOutlined, LockOutlined, ArrowLeftOutlined, MedicineBoxOutlined, SafetyOutlined, CheckCircleOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.scss";
import { useState } from "react";
import PopUpNotiThroughEmail from "../../../components/atoms/PopUpNotiThroughEmail";
import { forgotPassword } from "../../../apis/authenticationApi/forgotPasswordApi";

const { Title, Text } = Typography;

const ForgotPasswordPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    setLoading(true);
    try {
        await forgotPassword(values);
        toast.success("Password reset instructions sent to your email.");
        setIsModalVisible(true);
    } catch (error) {
      toast.error(error?.response?.data || "Failed to send reset link!");
    }
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-background-overlay"></div>
      
      <div className="forgot-password-content">
        {/* Left Side - Branding & Info */}
        <div className="forgot-password-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <MedicineBoxOutlined />
            </div>
            <Title level={1} className="brand-title">
              Password
            </Title>
            <Title level={2} className="brand-subtitle">
              Recovery
            </Title>
            <Text className="brand-description">
              Secure password recovery for your healthcare account. We'll help you regain access quickly and safely.
            </Text>
            
            <div className="recovery-steps">
              <div className="step-item">
                <MailOutlined className="step-icon" />
                <div className="step-content">
                  <span className="step-title">Email Verification</span>
                  <span className="step-desc">Secure link sent to your email</span>
                </div>
              </div>
              <div className="step-item">
                <SafetyOutlined className="step-icon" />
                <div className="step-content">
                  <span className="step-title">Secure Process</span>
                  <span className="step-desc">HIPAA compliant recovery</span>
                </div>
              </div>
              <div className="step-item">
                <CheckCircleOutlined className="step-icon" />
                <div className="step-content">
                  <span className="step-title">Quick Access</span>
                  <span className="step-desc">Resume your healthcare journey</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Recovery Form */}
        <div className="forgot-password-form-section">
          <Card className="forgot-password-card">
            <div className="forgot-password-header">
              <div className="header-icon">
                <LockOutlined />
              </div>
              <Title level={2} className="forgot-password-title">
                Reset Password
              </Title>
              <Text className="forgot-password-subtitle">
                Enter your email address and we'll send you instructions to reset your password
              </Text>
            </div>

            <Form 
              layout="vertical" 
              onFinish={onFinish}
              className="forgot-password-form"
              size="large"
              autoComplete="off"
            >
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email address!" },
                ]}
              >
                <Input
                  prefix={<MailOutlined className="input-icon" />}
                  placeholder="Enter your email address"
                  className="custom-input"
                />
              </Form.Item>

              <Form.Item className="form-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="reset-btn"
                  loading={loading}
                  block
                  size="large"
                >
                  {loading ? "Sending Reset Link..." : "Send Reset Link"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="forgot-password-divider">
              <Text type="secondary">Remember your password?</Text>
            </Divider>

            <div className="forgot-password-links">
              <Link to="/login-page" className="back-to-login">
                <ArrowLeftOutlined className="back-icon" />
                Back to Sign In
              </Link>
              
              <Space className="help-section">
                <Text type="secondary">Need more help?</Text>
                <Link to="/register-page" className="register-link">
                  Create New Account
                </Link>
              </Space>
            </div>
          </Card>
        </div>
      </div>

      <PopUpNotiThroughEmail
        isModalVisible={isModalVisible}
        setIsModalVisible={setIsModalVisible}
      />
    </div>
  );
};

export default ForgotPasswordPage;
