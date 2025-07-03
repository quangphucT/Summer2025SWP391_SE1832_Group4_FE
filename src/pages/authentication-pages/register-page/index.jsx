import { Link } from "react-router-dom";
import "./index.scss";
import { Col, Form, Input, Row, Button, Card, Typography, Space, Divider } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, IdcardOutlined, UserAddOutlined, MedicineBoxOutlined, SafetyOutlined, HeartOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { register } from "../../../apis/authenticationApi/registerApi";
import { useState } from "react";
import PopUpNotiThroughEmail from "../../../components/atoms/PopUpNotiThroughEmail";

const { Title, Text } = Typography;

const Register = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const valuesWithDefaultId = { roleId: 5, ...values };
      console.log("Register values:", valuesWithDefaultId);
      await register(valuesWithDefaultId);
      setIsModalVisible(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error while handling the request"
      );
    }
    setLoading(false);
  };

  return (
    <div className="register-container">
      <div className="register-background-overlay"></div>
      
      <div className="register-content">
        {/* Left Side - Branding & Info */}
        <div className="register-branding">
          <div className="brand-content">
            <div className="brand-icon">
              <MedicineBoxOutlined />
            </div>
            <Title level={1} className="brand-title">
              Join Our
            </Title>
            <Title level={2} className="brand-subtitle">
              Healthcare Community
            </Title>
            <Text className="brand-description">
              Create your account to access comprehensive HIV treatment support, expert consultations, and personalized care management
            </Text>
            
            <div className="benefits-list">
              <div className="benefit-item">
                <SafetyOutlined className="benefit-icon" />
                <div className="benefit-content">
                  <span className="benefit-title">Secure & Private</span>
                  <span className="benefit-desc">HIPAA compliant platform</span>
                </div>
              </div>
              <div className="benefit-item">
                <HeartOutlined className="benefit-icon" />
                <div className="benefit-content">
                  <span className="benefit-title">Expert Care</span>
                  <span className="benefit-desc">Licensed medical professionals</span>
                </div>
              </div>
              <div className="benefit-item">
                <MedicineBoxOutlined className="benefit-icon" />
                <div className="benefit-content">
                  <span className="benefit-title">Comprehensive Support</span>
                  <span className="benefit-desc">Treatment & consultation services</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Register Form */}
        <div className="register-form-section">
          <Card className="register-card">
            <div className="register-header">
              <div className="header-icon">
                <UserAddOutlined />
              </div>
              <Title level={2} className="register-title">
                Create Account
              </Title>
              <Text className="register-subtitle">
                Join thousands of patients receiving quality healthcare
              </Text>
            </div>

            <Form 
              layout="vertical" 
              className="register-form" 
              onFinish={onFinish}
              size="large"
              autoComplete="off"
            >
              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Username"
                    name="username"
                    hasFeedback
                    rules={[
                      { required: true, message: "Please enter your username!" },
                      {
                        pattern: /^[a-zA-Z0-9_]{3,20}$/,
                        message: "Username must be 3-20 characters and no spaces!",
                      },
                    ]}
                  >
                    <Input 
                      prefix={<UserOutlined className="input-icon" />} 
                      placeholder="Enter your username"
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Full Name"
                    name="fullName"
                    hasFeedback
                    rules={[
                      { required: true, message: "Please enter your full name!" },
                      {
                        pattern: /^[a-zA-Z\s]{2,50}$/,
                        message: "Full name must only contain letters and spaces!",
                      },
                    ]}
                  >
                    <Input 
                      prefix={<IdcardOutlined className="input-icon" />} 
                      placeholder="Enter your full name"
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={[16, 0]}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Email Address"
                    name="email"
                    hasFeedback
                    rules={[
                      { required: true, message: "Please enter your email!" },
                      { type: "email", message: "Invalid email format!" },
                    ]}
                  >
                    <Input 
                      prefix={<MailOutlined className="input-icon" />} 
                      placeholder="Enter your email address"
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Phone Number"
                    name="phoneNumber"
                    hasFeedback
                    rules={[
                      { required: true, message: "Please enter your phone number!" },
                      {
                        pattern: /^(0|\+84)[0-9]{9,10}$/,
                        message: "Invalid phone number format!",
                      },
                    ]}
                  >
                    <Input 
                      prefix={<PhoneOutlined className="input-icon" />} 
                      placeholder="Enter your phone number"
                      className="custom-input"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="register-actions">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="register-btn"
                  loading={loading}
                  block
                  size="large"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
              </Form.Item>
            </Form>

            <Divider className="register-divider">
              <Text type="secondary">Already a member?</Text>
            </Divider>

            <div className="register-links">
              <Space className="login-section">
                <Text type="secondary">Already have an account?</Text>
                <Link to="/login-page" className="login-link">
                  Sign In
                </Link>
              </Space>
              <Link to="/forgotpassword-page" className="forgot-link">
                Need help with password?
              </Link>
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

export default Register;
