import { useState } from "react";
import {
  DesktopOutlined,
  LogoutOutlined,
  PieChartOutlined,
  UserOutlined,
  FileTextOutlined,
  HeartOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Modal, theme, Avatar } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";
import endPoint from "../../../routers/router";

const { Header, Content, Sider } = Layout;

function getItem(label, key, icon, children, onClick) {
  return {
    key,
    icon,
    children,
    label: onClick ? (
      <span onClick={onClick} style={{ cursor: "pointer" }}>
        {label}
      </span>
    ) : (
      <Link to={`${endPoint.DOCTOR}/${key}`}>{label}</Link>
    ),
  };
}

const DoctorLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(removeInformation());
    localStorage.clear();
    navigate("/login-page");
  };

  const items = [
    getItem(
      "Dashboard",
      endPoint.DOCTORDASHBOARD,
      <PieChartOutlined />
    ),
    getItem("Patient Records", endPoint.DOCTORPATIENTRECORDS, <FileTextOutlined />),
    getItem("Appointments", endPoint.DOCTORAPPOINTMENTS, <HeartOutlined />),
    getItem("My Profile", endPoint.DOCTORPROFILE, <UserOutlined />),
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: (
        <div onClick={handleLogout}>
          <span>Logout</span>
        </div>
      ),
    },
  ];

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={280}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div 
          style={{ 
            padding: "24px 16px", 
            textAlign: "center",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)"
          }}
        >
          <Avatar
            size={collapsed ? 40 : 80}
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            style={{ marginBottom: collapsed ? 0 : "12px" }}
          />
          {!collapsed && (
            <div style={{ color: "#fff" }}>
              <div style={{ fontWeight: "bold", fontSize: "16px", marginBottom: "4px" }}>
                Dr. John Smith
              </div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>
                Cardiologist
              </div>
            </div>
          )}
        </div>
        <Menu
          style={{ fontSize: "15px", fontWeight: "400" }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "0 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DoctorLayout; 