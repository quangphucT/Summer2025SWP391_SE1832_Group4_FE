import { Link } from "react-router-dom";
import "./index.scss";
import { Col, Form, Input, Row, Button } from "antd";
import { toast } from "react-toastify";
import { register } from "../../../apis/authenticationApi/registerApi";
import { useState } from "react";
import PopUpNotiThroughEmail from "../../../components/atoms/PopUpNotiThroughEmail";

const Register = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const valuesWithDefaultId = { roleId: 5, ...values };
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
      <div className="register-box">
        <h2 className="register-title">Register</h2>
        <span className="register-subtitle">Create a new account</span>

        <Form layout="vertical" className="register-form" onFinish={onFinish}>
          <Row gutter={16}>
            <Col span={12}>
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
                <Input placeholder="Enter your username" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                hasFeedback
                rules={[
                  { required: true, message: "Please enter your email!" },
                  { type: "email", message: "Invalid email format!" },
                ]}
              >
                <Input placeholder="Enter your email" />
              </Form.Item>
            </Col>

            <Col span={12}>
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
                <Input placeholder="Enter your full name" />
              </Form.Item>

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
                <Input placeholder="Enter your phone number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-btn"
              loading={loading}
              block
            >
              Create Account
            </Button>
          </Form.Item>
        </Form>

        <div className="register-links">
          <Link to="/login-page">Already have an account?</Link>
          <Link to="/forgotpassword-page">Forgot password</Link>
        </div>

        <PopUpNotiThroughEmail
          isModalVisible={isModalVisible}
          setIsModalVisible={setIsModalVisible}
        />
      </div>
    </div>
  );
};

export default Register;
