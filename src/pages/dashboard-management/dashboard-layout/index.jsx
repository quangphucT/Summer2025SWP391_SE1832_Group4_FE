import { useState } from "react";
import {

  LogoutOutlined,
  MedicineBoxOutlined,
  UserOutlined,
  TeamOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  SettingOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Typography } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";
import "./index.scss";
const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
function getItem(label, key, icon, children, isGroup = false) {
  return {
    key,
    icon,
    children,
    label: isGroup ? (
      <span style={{ cursor: "default" }}>{label}</span>
    ) : (
      <Link to={`/dashboard/${key}`}>{label}</Link>
    ),
  };
}

const DashboardLayout = () => {
 

  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleLogout = () => {
    dispatch(removeInformation());
    sessionStorage.clear();
    navigate("/login-page");
  };

 const baseItems  = [
  getItem("Dashboard Overview", "dashboard-statistics", <DashboardOutlined />),

  getItem("Doctor Management", "doctor-management", <SettingOutlined />, [
    getItem("Doctor Account Creation", "doctor-create-account", <UserOutlined />),
  getItem("Doctor List Management", "doctor-list-management", <UserOutlined />),
  ], true),
  getItem("Management", "management", <SettingOutlined />, [
    getItem("Protocol Management", "protocal-management", <FileTextOutlined />),
    getItem("Customer Management", "customer-management", <TeamOutlined />),
    getItem("Account Management", "account-management", <UserOutlined />),
    getItem("Doctor Management", "doctor-management", <UserOutlined />),
    getItem("ARV Standard Management", "arvstandard-management", <MedicineBoxOutlined />),
    getItem("Schedule Activity Management", "schedule-activity-management", <UserOutlined />),
  ], true),

  getItem("Content Management", "content", <FileTextOutlined />, [
    getItem("Blog Management", "blog-management", <FileTextOutlined />),
    getItem("Experience Management", "experience-management", <MedicineBoxOutlined />),
    getItem("Certificate Management", "certificate-management", <MedicineBoxOutlined />),
  ], true),

  getItem("Appointment System", "appointments", <CalendarOutlined />, [
    getItem("Confirm Appointments", "appointment-management", <CalendarOutlined />),
    getItem("Today's Appointments", "today-appointment-management", <CalendarOutlined />),
  ], true),

  getItem("Checked-In Appointments", "checked-in-appointment-today", <CheckCircleOutlined />),
  
  {
    key: "logout",
    icon: <LogoutOutlined />,
    label: (
      <div onClick={handleLogout} style={{ color: "rgba(255, 255, 255, 0.8)" }}>
        <span>Logout</span>
      </div>
    ),
  },
];

   const items = baseItems.filter(Boolean);

  const [collapsed, setCollapsed] = useState(false);



  return (
    <Layout className={`management-dashboard-layout ${collapsed ? 'collapsed' : ''}`} style={{ minHeight: "100vh" }}>
      <Sider
        className="management-sidebar"
        width={300}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="management-logo-section">
          <div className="management-logo">
            <DashboardOutlined />
          </div>
          <Title level={4} className="management-title">
            HIV Treatment
          </Title>
          <Text className="management-subtitle">
            Management System
          </Text>
        </div>
        
        <Menu
          className="management-menu"
          theme="dark"
          defaultSelectedKeys={["dashboard-statistics"]}
          mode="inline"
          items={items}
        />
      </Sider>
      
      <Layout>
        <Header className="management-header">
          <div className="management-header-left">
            <div className="management-breadcrumb">
              <Text type="secondary">Dashboard</Text>
              <Text className="current-page"> / Management</Text>
            </div>
          </div>
          
          <div className="management-header-right">
            <div className="management-user-info">
             
              <Avatar 
                className="management-avatar"
                size={40}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
              />
            </div>
          </div>
        </Header>
        
        <Content className="management-content">
          <div className="management-content-wrapper">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};
export default DashboardLayout;
