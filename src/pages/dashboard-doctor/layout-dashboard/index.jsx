// src/pages/Dashboard.tsx

import {
  Layout,
  Menu,
  Card,
  Avatar,
  Button,
  Input,
  Image,
  Tooltip,
} from "antd";
import {
  DashboardOutlined,
  ProjectOutlined,
  SettingOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

import { useNavigate } from "react-router-dom";

import { useState } from "react";
import CheckedInAppointmentToday from "../checkedIn-Customer-List";

const DashboardDoctorLayout = () => {
  const [selectedMenu, setSelectedMenu] = useState(
    "recently-checkedInPatients"
  );
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider width={230} style={{ backgroundColor: "#2968a7" }}>
        <div className="flex justify-center mt-6">
          <Image
            className="text-center"
            preview={false}
            src={
              "https://flaticons.net/icon.php?slug_category=people&slug_icon=doctor"
            }
            style={{ width: "100px", height: "80px", object: "cover" }}
          />
        </div>

        <Menu
          className="!w-[210px]"
          mode="vertical"
          onClick={(e) => setSelectedMenu(e.key)}
          style={{
            backgroundColor: "#2968a7",
            color: "white",
            borderRight: 0,
            display: "flex",
            flexDirection: "column",
            margin: "0 auto",
            marginTop: "80px",
            fontWeight: "600",
            fontSize: "16px",
          }}
        >
          <Menu.Item
            key="recently-checkedInPatients"
            icon={<DashboardOutlined />}
          >
            <Tooltip title="Recently Checked-in Patients">
              Recently Checked-in Patients
            </Tooltip>
          </Menu.Item>

          <Menu.Item key="tasks" icon={<ProjectOutlined />}>
            Nhiệm vụ
          </Menu.Item>
          <Menu.Item key="projects" icon={<ProjectOutlined />}>
            Dự án
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main content */}
      <Layout style={{ background: "#2968a7", maxHeight: "100%" }}>
        {/* Header */}
        {/* Header */}
        <Header
          style={{
            backgroundColor: "#2968a7",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            height: 60,
          }}
        >
          <div className="text-white text-xl font-semibold uppercase tracking-wide drop-shadow-sm  ">
           Doctor's Appointment Workspace
          </div>

          <div className="flex items-center gap-3">
            <div className="text-white">Hthais Than</div>
            <Avatar src="https://i.pravatar.cc/100" />
          </div>
        </Header>

        {/* Content */}
        <Card style={{ borderTopLeftRadius: "40px", height: "100%" }}>
          <Content style={{ padding: "20px 24px", background: "#f9f9f9" }}>
            {selectedMenu === "recently-checkedInPatients" && (
              <div>
                <CheckedInAppointmentToday />
              </div>
            )}

            {selectedMenu === "home" && navigate("/home")}
          </Content>
        </Card>
      </Layout>
    </Layout>
  );
};

export default DashboardDoctorLayout;
