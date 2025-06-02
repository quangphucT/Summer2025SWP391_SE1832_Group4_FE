import { Button, Form, Input, Typography } from 'antd'
import './index.scss'
import { Link } from 'react-router-dom'

const { Title, Text } = Typography

const Login = () => {
  const onFinish = (values) => {
    console.log('Success:', values)
  }
  
  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2} className="login-title">HIV Support Portal</Title>
        <Text className="login-subtitle">Together we fight, together we care ❤️</Text>

        <Form layout="vertical" onFinish={onFinish} className="login-form">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <button  className="login-btn">
              Login
            </button>
          </Form.Item>
        </Form>

        <div className="login-links">
          <Link to="/forgotpassword-page">Forgot password?</Link>
          <Link to="/register-page">Create an account</Link>
        </div>
      </div>
    </div>
  )
}

export default Login
