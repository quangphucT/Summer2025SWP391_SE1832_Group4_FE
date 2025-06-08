import { useState } from "react";
import { Form, Input, Button, Typography } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPassword } from "../../../apis/authenticationApi/resetPasswordApi";

const { Title } = Typography;

const ResetPassword = () => {
  const [submitted, setSubmitted] = useState(false);
  const urlParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const token = urlParams.get('token');

  
  const onFinish = async(values) => {
  try {
      await resetPassword(values)
      setSubmitted(true);
    navigate("/login-page")
  } catch (error) {
     toast.error(error?.response?.data?.message || "Error while fetching!")
  }
  };

  return (
    <div className="setup-password-container">
      <div className="form-wrapper">
        <Title level={2} style={{ textAlign: "center" }}>
          Set Your Password
        </Title>

        {submitted ? (
          <p className="text-green-600 text-center">
            Password has been set successfully!
          </p>
        ) : (
          <Form initialValues={{ token }}layout="vertical" onFinish={onFinish} className="space-y-4">
           <Form.Item
              name="token" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              label="Update New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button
                htmlType="submit"
                block
                style={{
                  height: '45px',
                  backgroundColor: "#ba1c41",
                  borderColor: "#ba1c41",
                  color: "white",
                }}
                className="hover:!bg-[#a21938] hover:!border-[#a21938] transition duration-200"
              >
               Reset Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
