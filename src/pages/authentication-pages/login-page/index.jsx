import { Button, Form, Input, Typography } from 'antd'
import './index.scss'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { toast } from "react-toastify"
import { login } from "../../../apis/authenticationApi/loginApi";
import { useDispatch } from 'react-redux'
import { saveInformation } from '../../../redux/feature/userSlice'


const { Title, Text } = Typography

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const onFinish = async (values) => {
    setIsLoading(true)
    try {
      const response = await login( values)
       toast.success("Login successful!")
       const {token, role} = response.data
        dispatch(saveInformation(response?.data))    
        localStorage.setItem("token", token)
       if(role === "Patient"){
             navigate("/")
             
       }else{
         navigate("/dashboard")
       }
    } catch (error) {
      toast.error( error?.response?.data?.message || "Error while handling logic login!")
    }
    setIsLoading(false)
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