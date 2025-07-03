import { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Select, 
  Card, 
  Typography, 
  Row, 
  Col, 
  Space,
  Divider,
  Avatar
} from "antd";
import { 
  UserOutlined, 
  MailOutlined, 
  PhoneOutlined, 
  TeamOutlined,
  MedicineBoxOutlined 
} from "@ant-design/icons";
import { toast } from "react-toastify";
import {  getAllRolesApi } from "../../../../apis/doctorApi/getAllRoleApi";
import { createAccountAutoSetPasswordApi } from "../../../../apis/authenticationApi/createAccountAutoSetPasswordApi";


const { Title, Text } = Typography;
const { Option } = Select;

const DoctorCreationManagement = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  // Fetch roles on component mount
  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await getAllRolesApi();
      setRoles(response?.data?.data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
      // Set default roles if API fails
      setRoles([
        { roleId: 1, roleName: "Admin", description: "System Administrator" },
        { roleId: 2, roleName: "Manager", description: "Healthcare Facility Manager" },
        { roleId: 3, roleName: "Doctor", description: "Medical Doctor" },
        { roleId: 4, roleName: "Staff", description: "Healthcare Staff" }
      ]);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await createAccountAutoSetPasswordApi(values);
      toast.success("Doctor account created successfully!");
      form.resetFields();
      console.log("Registration successful:", response);
    } catch (error) {
      toast.error(
        error?.response?.data?.message?.error || "Error creating doctor account"
      );
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
          marginTop: '-97px'
        }}
      >
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <Avatar
            size={80}
            style={{
              backgroundColor: "#1976d2",
              marginBottom: "16px"
            }}
            icon={<MedicineBoxOutlined />}
          />
          <Title level={2} style={{ color: "#1976d2", margin: 0 }}>
            👨‍⚕️ Doctor Account Registration
          </Title>
          <Text type="secondary" style={{ fontSize: "16px" }}>
            Create a new doctor account in the HIV Treatment Management System
          </Text>
        </div>

        <Divider />

        {/* Registration Form */}
        <Form
          form={form}
          name="doctorRegistration"
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
      
        >
          <Row gutter={[24, 0]}>
            {/* Username Field */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#1976d2" }}>
                    <UserOutlined style={{ marginRight: "8px" }} />
                    Username
                  </span>
                }
                name="username"
                rules={[
                  { required: true, message: "Please enter username!" },
                  { min: 3, message: "Username must be at least 3 characters!" },
                  { max: 50, message: "Username cannot exceed 50 characters!" },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: "Username can only contain letters, numbers and underscores!" }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#1976d2" }} />}
                  placeholder="Enter unique username"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            {/* Email Field */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#1976d2" }}>
                    <MailOutlined style={{ marginRight: "8px" }} />
                    Email Address
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: "Please enter email address!" },
                  { type: "email", message: "Please enter a valid email address!" }
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: "#1976d2" }} />}
                  placeholder="doctor@example.com"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            {/* Full Name Field */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#1976d2" }}>
                    <UserOutlined style={{ marginRight: "8px" }} />
                    Full Name
                  </span>
                }
                name="fullName"
                rules={[
                  { required: true, message: "Please enter full name!" },
                  { min: 2, message: "Full name must be at least 2 characters!" },
                  { max: 100, message: "Full name cannot exceed 100 characters!" }
                ]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: "#1976d2" }} />}
                  placeholder="Dr. John Smith"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            {/* Phone Number Field */}
            <Col xs={24} md={12}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#1976d2" }}>
                    <PhoneOutlined style={{ marginRight: "8px" }} />
                    Phone Number
                  </span>
                }
                name="phoneNumber"
                rules={[
                  { required: true, message: "Please enter phone number!" },
                  { pattern: /^[0-9+\-\s()]+$/, message: "Please enter a valid phone number!" },
                  { min: 10, message: "Phone number must be at least 10 digits!" }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: "#1976d2" }} />}
                  placeholder="+1 (555) 123-4567"
                  style={{ borderRadius: "8px" }}
                />
              </Form.Item>
            </Col>

            {/* Role Selection */}
            <Col xs={24}>
              <Form.Item
                label={
                  <span style={{ fontWeight: "600", color: "#1976d2" }}>
                    <TeamOutlined style={{ marginRight: "8px" }} />
                    Role Assignment
                  </span>
                }
                name="roleId"
                rules={[
                  { required: true, message: "Please select a role!" }
                ]}
              >
                <Select
                  placeholder="Select user role"
                  style={{ borderRadius: "8px" }}
                  optionLabelProp="label"
                >
                  {roles.map((role) => (
                    <Option 
                      key={role.roleId} 
                      value={role.roleId}
                      label={role.roleName}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontWeight: "600" }}>{role.roleName}</span>
                        <span style={{ color: "#666", fontSize: "12px" }}>
                          - {role.description}
                        </span>
                      </div>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Submit Button */}
          <Form.Item style={{ textAlign: "center", marginTop: "32px" }}>
            <Space size="large">
              <Button
                type="default"
                size="large"
                style={{
                  borderRadius: "8px",
                  minWidth: "120px",
                  fontWeight: "600"
                }}
                onClick={() => form.resetFields()}
              >
                Reset Form
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  backgroundColor: "#1976d2",
                  borderColor: "#1976d2",
                  borderRadius: "8px",
                  minWidth: "160px",
                  fontWeight: "600",
                  boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)"
                }}
              >
                {loading ? "Creating Account..." : "Create Doctor Account"}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DoctorCreationManagement
