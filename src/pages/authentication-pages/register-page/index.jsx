import { Link } from "react-router-dom";
import "./index.scss";
import { Col, Form, Input, Row } from "antd";
import { toast } from "react-toastify";
import { register } from "../../../apis/authenticationApi/registerApi";
import { useState } from "react";
import PopUpNotiThroughEmail from "../../../components/atoms/PopUpNotiThroughEmail";

const Register = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onFinish = async (values) => {
    try {
      const valuesWithDefaultId = { roleId: 5, ...values };
      const response = await register(valuesWithDefaultId);
      toast.success(response.data.message);
      setIsModalVisible(true);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Error while handling the request";
      toast.error(errorMessage);
    }
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
                rules={[
                  { required: true, message: "Please enter your username!" },
                  { type: "username", message: "Invalid username format!" },
                ]}
              >
                <Input placeholder="Enter your username" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
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
                label="Fullname"
                name="fullName"
                rules={[
                  { required: true, message: "Please enter your fullname!" },
                  { type: "fullname", message: "Invalid fullname format!" },
                ]}
              >
                <Input placeholder="Enter your fullname" />
              </Form.Item>

              <Form.Item
                label="PhoneNumber"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter your phoneNumber!" },
                  {
                    type: "phoneNumber",
                    message: "Invalid phoneNumber format!",
                  },
                ]}
              >
                <Input placeholder="Enter your phoneNumber" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <button className="register-btn">Create Account</button>
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
