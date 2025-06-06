import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import "./index.scss";
import { setupPassworApi } from "../../../apis/authenticationApi/setupPasswordApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const { Title } = Typography;

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
       message.success("Password has been set successfully!");
       navigate("/login-page")
     } catch (error) {
      toast.error(error?.response?.data?.message || "Error while handling logic!!")
     }
     setLoading(false)
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
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please input your new password!" },
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item>
              <Button loading={loading}
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
                Set Password
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default SetUpPasswordAfterRegister;
