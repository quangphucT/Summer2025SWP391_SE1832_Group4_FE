
import {
  Layout,
  Menu,
  Card,
  Avatar,
  Typography,
} from "antd";
import {
  DashboardOutlined,

  LogoutOutlined,
} from "@ant-design/icons";
import "./index.scss";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import CheckedInAppointmentToday from "../checkedIn-Customer-List";
import { useDispatch } from "react-redux";
import { removeInformation } from "../../../../redux/feature/userSlice";
import AppointmentListByDoctorTestingAccountId from "../appointment-list";
import { BookAIcon, UserCheck } from "lucide-react";
const DashboardDoctorTestingLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState(
    "recently-checkedInPatients"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    dispatch(removeInformation());
    navigate("/login-page");
  };
  return (
    <Layout className="doctor-testing-layout" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={260} className="testing-sidebar">
        <div className="testing-profile-section">
          <div style={{ textAlign: "center" }}>
            <Avatar
              size={90}
              className="testing-avatar"
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=face"
              style={{
                border: "3px solid rgba(255, 255, 255, 0.3)",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)"
              }}
            />
            <Title level={4} className="testing-title" style={{ color: "white", marginTop: "12px", marginBottom: 0 }}>
              🧪 Doctor Testing
            </Title>
            <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "14px", marginTop: "4px" }}>
              HIV Testing Specialist
            </div>
          </div>
        </div>

        <Menu
          className="testing-menu"
          mode="vertical"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            marginTop: "20px",
          }}
        >
          <Menu.Item
            key="recently-checkedInPatients"
            icon={<DashboardOutlined />}
          >
            Recently Checked-in
          </Menu.Item>

          <Menu.Item 
            key="appointment-list-testing" 
            icon={<UserCheck/>}
          >
            Testing Appointments
          </Menu.Item>
          
          <Menu.Item 
            key="logout" 
            icon={<LogoutOutlined />}
            style={{ marginTop: "20px", color: "rgba(255, 255, 255, 0.7)" }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main content */}
      <Layout>
        {/* Header */}
        <Header className="testing-header">
          <div className="testing-header-title">
            🏥 HIV Testing Workspace
          </div>

          <div className="testing-user-info" style={{ display: "flex", alignItems: "center" }}>
            <span className="testing-username">Dr. Testing Specialist</span>
            <Avatar 
              className="testing-avatar-header"
              src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face" 
              size={40}
            />
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: 0, background: "linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)" }}>
          <Card className="testing-content-card" style={{ margin: 0, height: "calc(100vh - 64px)" }}>
            <div className="testing-content-inner">
              {selectedMenu === "recently-checkedInPatients" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <Title level={3} style={{ color: "#1976d2", margin: 0 }}>
                      📋 Recently Checked-in Patients
                    </Title>
                    <div style={{ color: "#666", marginTop: "4px" }}>
                      Patients ready for HIV testing procedures
                    </div>
                  </div>
                  <CheckedInAppointmentToday />
                </div>
              )}
              
              {selectedMenu === "appointment-list-testing" && (
                <div>
                  <div style={{ marginBottom: "20px" }}>
                    <Title level={3} style={{ color: "#1976d2", margin: 0 }}>
                      🧪 Your Testing Appointments
                    </Title>
                    <div style={{ color: "#666", marginTop: "4px" }}>
                      Manage and track your HIV testing appointments
                    </div>
                  </div>
                  <AppointmentListByDoctorTestingAccountId />
                </div>
              )}

              {selectedMenu === "logout" && handleLogout()}
            </div>
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardDoctorTestingLayout;
