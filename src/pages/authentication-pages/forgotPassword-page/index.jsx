import { Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useState } from 'react';
import PopUpNotiThroughEmail from '../../../components/atoms/PopUpNotiThroughEmail';
import { forgotPassword } from '../../../apis/authenticationApi/forgotPasswordApi';

const ForgotPasswordPage = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);

  const onFinish = async(values) => {
      console.log("values:", values)
    try {
       await forgotPassword(values)
      message.success('Password reset instructions sent to your email.');
       setIsModalVisible(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error while handling")
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffcf5] px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-[#c62828] mb-2 text-center">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email to receive password reset instructions.
        </p>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please enter your email!' },
              { type: 'email', message: 'Invalid email address!' },
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item>
            <button
              type="submit"
              className="w-full bg-[#c62828] text-white py-2 rounded-md hover:bg-red-700 transition cursor-pointer"
            >
              Send Reset Link
            </button>
          </Form.Item>
        </Form>

        <div className="text-center mt-4 text-sm">
          <Link to="/login-page" className="text-[#c62828] hover:underline">
            Back to Login
          </Link>
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
