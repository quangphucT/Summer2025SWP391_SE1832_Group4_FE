

import "./index.scss";
import {
  Layout,
  Menu,

  Avatar,

} from "antd";
import {

  ProjectOutlined,

  LogoutOutlined,

  MedicineBoxOutlined,
  CalendarOutlined,
  HeartOutlined,
} from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CheckedInAppointmentToday from "../checkedIn-Customer-List";
import { useDispatch, useSelector } from "react-redux";
import { removeInformation } from "../../../../redux/feature/userSlice";
import AppointmentListByDoctorAccountId from "../appointment-list";
import PatientMedicalRecord from "../patientMedicalRecord";
import RegisterTherapyForPatient from "../../dashboard-doctor-consultant/register-therapy-forPatient";


const DashboardDoctorTherapyLayout = () => {
  const emailDoctor = useSelector((store) => store?.user?.email);
  const fullNameDoctor = useSelector((store) => store?.user?.fullName);
  const doctorID = useSelector((store) => store?.user?.accountID);
  const fullname = useSelector((store) => store?.user?.fullName);
  const [selectedMenu, setSelectedMenu] = useState(
    "recently-checkedInPatients"
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.clear();
    dispatch(removeInformation());
    navigate("/login-page");
  };
  return (
    <Layout
      className="therapy-dashboard-layout"
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #d7c7e6 0%, #e8d9f2 100%)",
      }}
    >
      {/* Sidebar */}
      <Sider
        width={280}
        className="therapy-sidebar"
        style={{
          background: "linear-gradient(180deg, #8367a0 0%, #a28bb7 100%)",
          boxShadow: "4px 0 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative background elements */}
        <div
          className="therapy-decoration-top"
          style={{
            position: "absolute",
            top: "-50px",
            right: "-50px",
            width: "150px",
            height: "150px",
            background: "rgba(215, 199, 230, 0.08)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />
        <div
          className="therapy-decoration-bottom"
          style={{
            position: "absolute",
            bottom: "-30px",
            left: "-30px",
            width: "100px",
            height: "100px",
            background: "rgba(162, 139, 183, 0.08)",
            borderRadius: "50%",
            zIndex: 1,
          }}
        />

        {/* Profile Section */}
        <div
          className="therapy-profile-section flex flex-col items-center justify-center mt-8 space-y-4 relative z-10 fade-in"
          style={{ padding: "0 20px" }}
        >
          <div
            className="therapy-avatar-container"
            style={{
              position: "relative",
              padding: "4px",
              background: "linear-gradient(45deg, #d7c7e6, #baa4cc)",
              borderRadius: "50%",
              boxShadow: "0 6px 25px rgba(186, 164, 204, 0.3)",
            }}
          >
            <div
              className="therapy-avatar-circle"
              style={{
                width: "120px",
                height: "120px",
                borderRadius: "50%",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "48px",
                color: "#8367a0",
              }}
            >
              <MedicineBoxOutlined />
            </div>
          </div>

          <div className="therapy-doctor-info" style={{ textAlign: "center", marginTop: "16px" }}>
            <div
              className="therapy-doctor-name"
              style={{
                color: "white",
                fontSize: "20px",
                fontWeight: "700",
                marginBottom: "4px",
                textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
             {fullNameDoctor}
            </div>
            <div
              className="therapy-doctor-role"
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "14px",
                fontWeight: "500",
                background: "rgba(215, 199, 230, 0.15)",
                padding: "4px 12px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              Therapy Specialist - Email: {emailDoctor}
            </div>
              <div
              className="therapy-doctor-id"
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: "14px",
                fontWeight: "500",
                padding: "4px 12px",
                borderRadius: "12px",
                backdropFilter: "blur(10px)",
              }}
            >
              DoctorID: {doctorID}
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <Menu
          mode="vertical"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
          style={{
            backgroundColor: "transparent",
            color: "white",
            borderRight: 0,
            marginTop: "40px",
            padding: "0 16px",
          }}
          className="therapy-doctor-menu"
        >
          <Menu.Item
            key="recently-checkedInPatients"
            icon={<CalendarOutlined style={{ fontSize: "18px" }} />}
            style={{
              margin: "8px 0",
              borderRadius: "12px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            Checked-in Patients
          </Menu.Item>

           <Menu.Item
            key="patient-medicalRecord"
            icon={<CalendarOutlined style={{ fontSize: "18px" }} />}
            style={{
              margin: "8px 0",
              borderRadius: "12px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            Patient Medical Record
          </Menu.Item>

          {/* register therapy for patient */}
           <Menu.Item
            key="therapy-for-patient"
            icon={<CalendarOutlined style={{ fontSize: "18px" }} />}
            style={{
              margin: "8px 0",
              borderRadius: "12px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
            Therapy for patient
          </Menu.Item>



         <Menu.Item
            key="appointment-list"
            icon={<ProjectOutlined style={{ fontSize: "18px" }} />}
            style={{
              margin: "8px 0",
              borderRadius: "12px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
              transition: "all 0.3s ease",
            }}
          >
          Your Appointment List 
          </Menu.Item>

          <Menu.Item
            key="logout"
            icon={<LogoutOutlined style={{ fontSize: "18px" }} />}
            style={{
              margin: "8px 0",
              borderRadius: "12px",
              height: "50px",
              display: "flex",
              alignItems: "center",
              fontSize: "15px",
              fontWeight: "500",
              color: "#ff6b6b",
              transition: "all 0.3s ease",
            }}
          >
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content Area */}
      <Layout style={{ background: "transparent" }}>
        {/* Modern Header */}
        <Header
          className="therapy-header"
          style={{
            marginTop: "30px",
            background: "rgba(255,255,255,0.95)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(215, 199, 230, 0.15)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 32px",
            height: 70,
            boxShadow: "0 2px 20px rgba(186, 164, 204, 0.08)",
          }}
        >
          <div
            className="therapy-header-left"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div
              className="therapy-header-icon"
              style={{
                background: "linear-gradient(135deg, #baa4cc 0%, #d7c7e6 100%)",
                padding: "0 12px",
                borderRadius: "12px",
                color: "white",
                fontSize: "20px",
              }}
            >
              <HeartOutlined />
            </div>
            <div
              className="therapy-header-text"
              style={{
                display: "flex",
                gap: "20px",
              }}
            >
              <div
                className="therapy-title"
                style={{
                  color: "#0f4c3a",
                  fontSize: "22px",
                  fontWeight: "700",
                  marginBottom: "2px",
                }}
              >
                Therapy Dashboard
              </div>
              <div
                className="therapy-subtitle"
                style={{
                  color: "#16a085",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                HIV Treatment & Therapy Center
              </div>
            </div>
          </div>

          <div
            className="therapy-header-right"
            style={{
              display: "flex",
              alignItems: "center",
              background: "rgba(186, 164, 204, 0.06)",
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid rgba(186, 164, 204, 0.12)",
            }}
          >
            <div
              className="therapy-user-name"
              style={{
                color: "#8367a0",
                fontSize: "16px",
                fontWeight: "600",
                marginBottom: "2px",
              }}
            >
            {fullname}
            </div>

            <Avatar
              className="therapy-avatar"
              size={44}
              src="https://i.pravatar.cc/100"
              style={{
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(186, 164, 204, 0.15)",
              }}
            />
          </div>
        </Header>

        {/* Content Area */}
        <Content
          className="therapy-content"
          style={{
            margin: "24px",
            background: "rgba(255,255,255,0.95)",
            borderRadius: "20px",
            boxShadow: "0 6px 25px rgba(186, 164, 204, 0.1)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(215, 199, 230, 0.15)",
            overflow: "hidden",
          }}
        >
          <div
            className="therapy-content-inner"
            style={{
              padding: "32px",
              minHeight: "calc(100vh - 160px)",
            }}
          >
            {selectedMenu === "recently-checkedInPatients" && (
              <div className="fade-in">
                <CheckedInAppointmentToday />
              </div>
            )}

            {selectedMenu === "appointment-list" && (
              <div
                className="fade-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "670px",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
               <div className="flex items-center space-x-5">
                 <ProjectOutlined
                  style={{ fontSize: "64px", color: "#667eea" }}
                />
                <h2
                  style={{
                    color: "#1e3c72",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
                 Your Appointment List
                </h2>
               </div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  <AppointmentListByDoctorAccountId/>
                </p>
              </div>
            )}

    

             {selectedMenu === "patient-medicalRecord" && (
              <div
                className="fade-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "670px",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
               <div className="flex items-center space-x-5">
                 <ProjectOutlined
                  style={{ fontSize: "64px", color: "#667eea" }}
                />
                <h2
                  style={{
                    color: "#1e3c72",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
                 Patient Medical Record
                </h2>
               </div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  <PatientMedicalRecord/>
                </p>
              </div>
            )}

           {/* therapy for patient */}
              {selectedMenu === "therapy-for-patient" && (
              <div
                className="fade-in"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "770px",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
               <div className="flex items-center space-x-5">
                 <ProjectOutlined
                  style={{ fontSize: "64px", color: "#667eea" }}
                />
                <h2
                  style={{
                    color: "#1e3c72",
                    fontSize: "24px",
                    fontWeight: "600",
                  }}
                >
               Register Therapy for patient
                </h2>
               </div>
                <p
                  style={{
                    color: "#666",
                    fontSize: "16px",
                    textAlign: "center",
                  }}
                >
                  <RegisterTherapyForPatient/>
                </p>
              </div>
            )}

            {selectedMenu === "logout" && handleLogout()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardDoctorTherapyLayout;
