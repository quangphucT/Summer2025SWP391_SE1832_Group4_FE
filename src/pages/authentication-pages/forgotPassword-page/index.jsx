import { Form, Input, message } from 'antd';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const onFinish = (values) => {
    console.log('Email submitted:', values.email);
    message.success('Password reset instructions sent to your email.');
    // Gọi API gửi email reset password tại đây
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
    </div>
  );
};

export default ForgotPasswordPage;
