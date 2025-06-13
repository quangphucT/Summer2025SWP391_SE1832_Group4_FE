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
import { useDispatch } from "react-redux";
import { removeInformation } from "../../../redux/feature/userSlice";
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
  const items = [
    getItem(
      "Dashboard statistics",
      "dashboard-statistics",
      <PieChartOutlined />
    ),
    getItem("Protocal management", "protocal-management", <DesktopOutlined />),
    getItem("Customer management", "customer-management", <DesktopOutlined />),
    getItem("Account management", "account-management", <UserOutlined />),
    getItem("Doctor management", "doctor-management", <UserOutlined />),

      getItem("Blog management", "blog-management", <UserOutlined />),
    getItem("Experience management", "experience-management", <MedicineBoxOutlined />),
    getItem("Certificate management", "certificate-management", <MedicineBoxOutlined />),

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
