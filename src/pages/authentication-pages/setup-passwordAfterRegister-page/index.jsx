import { useState } from "react";
import { Form, Input, Button, Typography, Card, Space, Divider } from "antd";
import { LockOutlined, CheckCircleOutlined, KeyOutlined, MedicineBoxOutlined, SafetyOutlined } from "@ant-design/icons";
import "./index.scss";
import { setupPassworApi } from "../../../apis/authenticationApi/setupPasswordApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const SetUpPasswordAfterRegister = () => {
  const [submitted, setSubmitted] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const token = urlParams.get('token');

  
  const onFinish = async(values) => {
    setLoading(true)
     try {
       await setupPassworApi(values, token);
       setSubmitted(true);
       toast.success("Password has been set successfully!");
       navigate("/login-page")
     } catch (error) {
      toast.error(error?.response?.data?.message || "Error while handling logic!!")
     }
     setLoading(false)
  };

  return (
    <div className="setup-password-container">
      <div className="setup-password-background-overlay"></div>
      
      <div className="setup-password-content">
        {/* Left Side - Branding & Info */}
        <div className="setup-password-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <MedicineBoxOutlined />
            </div>
            <Title level={1} className="brand-title">
              Secure Your
            </Title>
            <Title level={2} className="brand-subtitle">
              Healthcare Account
            </Title>
            <Text className="brand-description">
              Complete your account setup by creating a secure password. Your privacy and medical data security are our top priorities.
            </Text>
            
            <div className="security-features">
              <div className="security-item">
              
                <div className="security-content">
                  <span className="security-title">HIPAA Compliant</span>
                  <span className="security-desc">Enterprise-grade security</span>
                </div>
              </div>
              <div className="security-item">
                <SafetyOutlined className="security-icon" />
                <div className="security-content">
                  <span className="security-title">Data Encryption</span>
                  <span className="security-desc">End-to-end protection</span>
                </div>
              </div>
              <div className="security-item">
                <CheckCircleOutlined className="security-icon" />
                <div className="security-content">
                  <span className="security-title">Secure Access</span>
                  <span className="security-desc">Protected healthcare portal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Setup Form */}
        <div className="setup-password-form-section">
          <Card className="setup-password-card">
            {!submitted ? (
              <>
                <div className="setup-password-header">
                  <div className="header-icon">
                    <KeyOutlined />
                  </div>
                  <Title level={2} className="setup-password-title">
                    Create Password
                  </Title>
                  <Text className="setup-password-subtitle">
                    Choose a strong password to secure your healthcare account and protect your personal information
                  </Text>
                </div>

                <Form 
                  initialValues={{ token }} 
                  layout="vertical" 
                  onFinish={onFinish} 
                  className="setup-password-form"
                  size="large"
                  autoComplete="off"
                >
                  <Form.Item name="token" hidden>
                    <Input />
                  </Form.Item>
                  
                  <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[
                      { required: true, message: "Please input your new password!" },
                      { min: 8, message: "Password must be at least 8 characters!" },
                      {
                        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                        message: "Password must contain uppercase, lowercase, number and special character!"
                      }
                    ]}
                    hasFeedback
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder="Enter a strong password"
                      className="custom-input"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please confirm your password!" },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('newPassword') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined className="input-icon" />}
                      placeholder="Confirm your password"
                      className="custom-input"
                    />
                  </Form.Item>

                  <div className="password-requirements">
                    <Text type="secondary" className="requirements-title">Password requirements:</Text>
                    <ul className="requirements-list">
                      <li>At least 8 characters long</li>
                      <li>Contains uppercase and lowercase letters</li>
                      <li>Contains at least one number</li>
                      <li>Contains at least one special character</li>
                    </ul>
                  </div>

                  <Form.Item className="form-actions">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="setup-btn"
                      loading={loading}
                      block
                      size="large"
                    >
                      {loading ? "Setting Up Password..." : "Complete Setup"}
                    </Button>
                  </Form.Item>
                </Form>
              </>
            ) : (
              <div className="success-content">
                <div className="success-icon">
                  <CheckCircleOutlined />
                </div>
                <Title level={2} className="success-title">
                  Password Set Successfully!
                </Title>
                <Text className="success-description">
                  Your healthcare account is now secure and ready to use. You can now access all medical services and features.
                </Text>
                <Button 
                  type="primary" 
                  size="large" 
                  className="continue-btn"
                  onClick={() => navigate("/login-page")}
                >
                  Continue to Sign In
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetUpPasswordAfterRegister;
