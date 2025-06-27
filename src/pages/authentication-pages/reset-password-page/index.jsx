import { useState } from "react";
import { Form, Input, Button, Typography, Card, Space, Divider } from "antd";
import { LockOutlined, CheckCircleOutlined, ReloadOutlined, MedicineBoxOutlined, SafetyOutlined } from "@ant-design/icons";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../../apis/authenticationApi/resetPasswordApi";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const token = urlParams.get('token');

  
  const onFinish = async(values) => {
    setLoading(true);
    try {
      await resetPassword(values);
      setSubmitted(true);
      toast.success("Password has been reset successfully!");
      setTimeout(() => {
        navigate("/login-page");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error while resetting password!");
    }
    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-background-overlay"></div>
      
      <div className="reset-password-content">
        {/* Left Side - Branding & Info */}
        <div className="reset-password-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <MedicineBoxOutlined />
            </div>
            <Title level={1} className="brand-title">
              Reset Your
            </Title>
            <Title level={2} className="brand-subtitle">
              Password
            </Title>
            <Text className="brand-description">
              Create a new secure password for your healthcare account. Your security and privacy are our top priorities in protecting your medical information.
            </Text>
            
            <div className="reset-features">
              <div className="reset-item">
              
                <div className="reset-content">
                  <span className="reset-title">Secure Reset</span>
                  <span className="reset-desc">Token-based verification</span>
                </div>
              </div>
              <div className="reset-item">
                <SafetyOutlined className="reset-icon" />
                <div className="reset-content">
                  <span className="reset-title">Data Protection</span>
                  <span className="reset-desc">HIPAA compliant security</span>
                </div>
              </div>
              <div className="reset-item">
                <CheckCircleOutlined className="reset-icon" />
                <div className="reset-content">
                  <span className="reset-title">Instant Access</span>
                  <span className="reset-desc">Immediate account recovery</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Reset Form */}
        <div className="reset-password-form-section">
          <Card className="reset-password-card">
            {!submitted ? (
              <>
                <div className="reset-password-header">
                  <div className="header-icon">
                    <ReloadOutlined />
                  </div>
                  <Title level={2} className="reset-password-title">
                    Reset Password
                  </Title>
                  <Text className="reset-password-subtitle">
                    Create a new strong password to secure your healthcare account and protect your personal medical information
                  </Text>
                </div>

                <Form 
                  initialValues={{ token }} 
                  layout="vertical" 
                  onFinish={onFinish} 
                  className="reset-password-form"
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
                      placeholder="Enter your new password"
                      className="custom-input"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    hasFeedback
                    rules={[
                      { required: true, message: "Please confirm your new password!" },
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
                      placeholder="Confirm your new password"
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
                      className="reset-btn"
                      loading={loading}
                      block
                      size="large"
                    >
                      {loading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                  </Form.Item>
                </Form>

                <Divider className="reset-password-divider">
                  <Text type="secondary">Remember your password?</Text>
                </Divider>

                <div className="reset-password-links">
                  <Button 
                    type="link" 
                    onClick={() => navigate("/login-page")}
                    className="back-to-login"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </>
            ) : (
              <div className="success-content">
                <div className="success-icon">
                  <CheckCircleOutlined />
                </div>
                <Title level={2} className="success-title">
                  Password Reset Successfully!
                </Title>
                <Text className="success-description">
                  Your password has been updated successfully. You can now sign in with your new password to access your healthcare account.
                </Text>
                <Text className="redirect-info">
                  Redirecting to sign in page in a few seconds...
                </Text>
                <Button 
                  type="primary" 
                  size="large" 
                  className="continue-btn"
                  onClick={() => navigate("/login-page")}
                >
                  Sign In Now
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
