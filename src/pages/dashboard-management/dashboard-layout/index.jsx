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
import { Layout, Menu, Avatar, Typography, Button, Row, Col } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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



const DashboardProfileMini = () => {
  const user = useSelector((state) => state.user);
  const avatarUrl = user?.profileImageUrl || "https://ui-avatars.com/api/?name=User";
  const fullName = user?.fullName || "User";
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      background: 'transparent',
      padding: '0 8px',
      boxShadow: 'none',
      borderRadius: 0
    }}>
      <Avatar src={avatarUrl} size={36} />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', lineHeight: 1.1 }}>
        <span style={{ fontWeight: 500, color: '#222', fontSize: 15 }}>{fullName}</span>
        <span style={{ color: '#888', fontSize: 12 }}>{user?.role}</span>
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const user = useSelector((state) => state.user);
  const role = user?.role;
  const dispatch = useDispatch();
  const navigate = useNavigate();
    const handleLogout = () => {
    dispatch(removeInformation());
    sessionStorage.clear();
    navigate("/login-page");
  };

  let items = [];
  if (role === "Admin") {
    items = [
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
        
      ], true),

      getItem("Content Management", "content", <FileTextOutlined />, [
        getItem("Blog Management", "blog-management", <FileTextOutlined />),
      ], true),

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
  } else if (role === "Staff") {
    items = [
      getItem("Appointment System", "appointments", <CalendarOutlined />, [
        getItem("Confirm Appointments", "appointment-management", <CalendarOutlined />),
        getItem("Today's Appointments", "today-appointment-management", <CalendarOutlined />),
      ], true),
      getItem("Checked-In Appointments", "checked-in-appointment-today", <CheckCircleOutlined />),
      getItem("Schedule Activity Management", "schedule-activity-management", <UserOutlined />),
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
  }

   const itemsFiltered = items.filter(Boolean);

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
          items={itemsFiltered}
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
            <DashboardProfileMini />
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
