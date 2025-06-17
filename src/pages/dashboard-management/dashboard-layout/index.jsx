import { useState } from "react";
import {
  DesktopOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  PieChartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Modal, theme } from "antd";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";
const { Header, Content, Sider } = Layout;
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
    localStorage.clear();
    navigate("/login-page");
  };
   const roleUser = useSelector((store) => store?.user?.role)
 const baseItems  = [
  getItem("Dashboard", "dashboard-statistics", <PieChartOutlined />),
    getItem("Management", "management", <DesktopOutlined />, [
    getItem("Protocol Management", "protocal-management", <DesktopOutlined />),
    getItem("Customer Management", "customer-management", <DesktopOutlined />),
    getItem("Account Management", "account-management", <UserOutlined />),
    getItem("Doctor Management", "doctor-management", <UserOutlined />),
  ], true), // ✅ Không cho click

     getItem("Content", "content", <MedicineBoxOutlined />, [
    getItem("Blog Management", "blog-management", <UserOutlined />),
    getItem("Experience Management", "experience-management", <MedicineBoxOutlined />),
    getItem("Certificate Management", "certificate-management", <MedicineBoxOutlined />),
  ], true), // ✅ Không cho click

    getItem("Appointments", "appointments", <MedicineBoxOutlined />, [
    getItem("Confirm Appointment", "appointment-management", <MedicineBoxOutlined />),
    getItem("Today Appointments", "today-appointment-management", <MedicineBoxOutlined />),
  ], true), // ✅ Không cho click

  getItem("Checked-In Appointment", "checked-in-appointment-today", <MedicineBoxOutlined />),
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

   const items = baseItems.filter(Boolean);

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
        <div className="demo-logo-vertical" />
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
export default DashboardLayout;
