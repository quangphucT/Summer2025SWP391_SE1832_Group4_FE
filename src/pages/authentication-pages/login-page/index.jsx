import { Button, Form, Input, Typography } from 'antd'
import './index.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from "react-toastify"
import { login } from "../../../apis/authenticationApi/loginApi";

const { Title, Text } = Typography

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      const response = await login( {
        email: values.email,
        password: values.password,
      })
      if (response && response.data && response.data.token) {
        localStorage.setItem("token", response.data.token)
        toast.success("Login successful!")
        navigate("/")
      } else {
        toast.error("Incorrect account or password!")
      }
    } catch (error) {
      toast.error("Login failed! Please try again.")
    } finally {
      setIsLoading(false)
    }
  }
  

  return (
    <div className="login-container">
      <div className="login-box">
        <Title level={2} className="login-title">HIV Support Portal</Title>
        <Text className="login-subtitle">Together we fight, together we care ❤️</Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          className="login-form"
          autoComplete="off"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Invalid email!' }
            ]}
          >
            <Input placeholder="Enter your email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password placeholder="Enter your password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-btn"
              loading={isLoading}
              block
            >
              Login
            </Button>
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