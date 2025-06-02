import { useState } from "react";
import { Form, Input, Button, Typography, message } from "antd";
import "./index.scss";

const { Title } = Typography;

const SetUpPasswordAfterRegister = () => {
  const [submitted, setSubmitted] = useState(false);

  const onFinish = (values) => {
    console.log("Submitted:", values);
    setSubmitted(true);
    message.success("Password has been set successfully!");
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
          <Form layout="vertical" onFinish={onFinish} className="space-y-4">
            <Form.Item
              label="Token"
              name="token"
              rules={[{ required: true, message: "Please input your token!" }]}
            >
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
