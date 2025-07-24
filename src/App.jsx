import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Layout from "./components/layout";
import HomePage from "./pages/home-page";
import DashboardLayout from "./pages/dashboard-management/dashboard-layout";
import CustomerManagement from "./pages/dashboard-management/manager/customer-management";
import ProtocolManagement from "./pages/dashboard-management/manager/protocal-management";
import DashboardStatistics from "./pages/dashboard-management/admin/dashboard-statistics";
import Login from "./pages/authentication-pages/login-page";
import Register from "./pages/authentication-pages/register-page";
import ForgotPasswordPage from "./pages/authentication-pages/forgotPassword-page";
import endPoint from "./routers/router";
import BlogsPages from "./pages/blogs-pages";
import SetUpPasswordAfterRegister from "./pages/authentication-pages/setup-passwordAfterRegister-page";
import HivTreatmentPage from "./pages/hiv_treatment-page";
import ProfilePage from "./pages/menu-profile/profile-page";
import AppointmentMenuPage from "./pages/menu-profile/appointmentMenu-page";
import TransactionMenuPage from "./pages/menu-profile/transactionMenu-page";
import MedicalRecordMenuPage from "./pages/menu-profile/medicalRecordMenu-page";
import ResetPassword from "./pages/authentication-pages/reset-password-page";
import AccountManagement from "./pages/dashboard-management/admin/account-management/account-management";
import ExperienceManagement from "./pages/dashboard-management/doctor/experience-management";
import CertificateManagement from "./pages/dashboard-management/doctor/certificate-management";
import BlogManagement from "./pages/dashboard-management/manager/blog-management/blog-management";
import DoctorManagement from "./pages/dashboard-management/doctor/doctor-management";
import BlogDetailPage from "./pages/blogs-pages/BlogDetailPage";
import DoctorDetail from "./pages/home-page/DoctorDetail";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ScheduleAConsultation from "./pages/schedule-consultation-page";
import AppointmentManagement from "./pages/dashboard-management/staff/appointment-management";
import AppointmentTodayManagement from "./pages/dashboard-management/staff/appointmentToday";

import ArvManagement from "./pages/dashboard-management/admin/arvstandard-management/arvstandard-management";
import TestingHIVPage from "./pages/service-pages/testing-hiv-page";
import DashboardDoctorTestingLayout from "./pages/dashboard-doctor/dashboard-doctor-testing/layout-dashboard";
import DashboardDoctorConsultantLayout from "./pages/dashboard-doctor/dashboard-doctor-consultant/layout-dashboard";
import DoctorCreationManagement from "./pages/dashboard-management/admin/doctor-createAccount-management";
import DoctorListManagement from "./pages/dashboard-management/admin/doctor-list-management";
import BookingTreatmentHIV from "./pages/service-pages/hiv-treatment-page";
import SchedulePostTestConsultation from "./pages/schedule-consultationPost-page";
import DashboardDoctorTherapyLayout from "./pages/dashboard-doctor/dashboard-doctor-therapy/layout-dashboard";
import ScheduleActivityManagement from "./pages/dashboard-management/staff/schedule-activity-management/schedule-activity-management";
import MedicalRecordSchedule from "./pages/menu-profile/medicalRecordMenu-page/schedule";
import { useSelector } from "react-redux";

// Component wrapper phân quyền
const WithRole = ({ component, allowedRoles }) => {
  const user = useSelector((state) => state.user);
  if (!user?.accountID) return <Navigate to="/login-page" replace />;
  if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  const Component = component;
  return <Component />;
};

const App = () => {
  // Đã dùng useSelector trong WithRole, không cần ở đây nữa
  const router = createBrowserRouter([
    {
      path: endPoint.LAYOUT,
      element: <Layout />,
      children: [
        {
          path: endPoint.HOME,
          element: <HomePage />,
        },
        {
          path: endPoint.BLOGSPAGE,
          element: <BlogsPages />,
        },
        {
          path: "/blog/:blogId",
          element: <BlogDetailPage />,
        },

        // service system

        {
          path: endPoint.TESTINGHIVPAGE,
          element: <TestingHIVPage />,
        },

        {
          path: endPoint.SCHEDULEACONSULTATION,
          element: <ScheduleAConsultation />,
        },
        // schedule a consultation post
        {
          path: endPoint.SCHEDULEACONSULTATIONPOST,
          element: <SchedulePostTestConsultation />,
        },

        // booking treatment hiv
        {
          path: endPoint.BOOKINGTREATMENTHIV,
          element: <BookingTreatmentHIV />,
        },
        {
          path: endPoint.HIVTREATMENT,
          element: <HivTreatmentPage />,
        },
        {
          path: endPoint.TESTINGSTDS,
          element: <HivTreatmentPage />,
        },
        {
          path: endPoint.HIVTESTING,
          element: <HivTreatmentPage />,
        },
        {
          path: endPoint.PROFILEPAGE,
          element: <ProfilePage />,
        },
        {
          path: endPoint.APPOINTMENT,
          element: <AppointmentMenuPage />,
        },
        {
          path: endPoint.TRANSACTION,
          element: <TransactionMenuPage />,
        },
        {
          path: endPoint.MEDICALRECORD,
          element: <MedicalRecordMenuPage />,
        },
        {
          path: endPoint.MEDICALRECORDSCHEDULE,
          element: <MedicalRecordSchedule />,
        },
      ],
    },
    {
      path: endPoint.LOGIN,
      element: <Login />,
    },
    {
      path: endPoint.REGISTER,
      element: <Register />,
    },
    {
      path: endPoint.RESETPASSWORD,
      element: <ResetPassword />,
    },
    {
      path: endPoint.PASSWORDAFTERREGISTER,
      element: <SetUpPasswordAfterRegister />,
    },
    {
      path: endPoint.FORGOTPASSWORD,
      element: <ForgotPasswordPage />,
    },
    // dashboard for doctor testing
    {
      path: endPoint.DASHBOARDLAYOUTDOCTORTESTING,
      element: <WithRole component={DashboardDoctorTestingLayout} allowedRoles={["Doctor"]} />,
    },

    // dashboard for doctor consultant
    {
      path: endPoint.DASHBOARDLAYOUTDOCTORCONSULTANT,
      element: <WithRole component={DashboardDoctorConsultantLayout} allowedRoles={["Doctor"]} />,
    },
    // dashboard for doctor therapy
    {
      path: endPoint.DASHBOARDLAYOUTDOCTORTHERAPY,
      element: <WithRole component={DashboardDoctorTherapyLayout} allowedRoles={["Doctor"]} />,
    },
    {
      path: endPoint.DASHBOARD,
      element: <WithRole component={DashboardLayout} allowedRoles={["Admin" , "Staff" ]} />,
      children: [
        {
          path: endPoint.DASHBOARDSTATISTICS,
          element: <WithRole component={DashboardStatistics} allowedRoles={["Admin", "Staff"]} />,
        },
        {
          path: endPoint.PROTOCOLMANAGEMENT,
          element: <WithRole component={ProtocolManagement} allowedRoles={["Admin"]} />,
        },
        {
          path: endPoint.CUSTOMERMANAGEMENT,
          element: <WithRole component={CustomerManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: endPoint.DOCTORMANAGEMENT,
          element: <WithRole component={DoctorManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: endPoint.DOCTORCREATEACCOUNTBYSTAFF,
          element: <WithRole component={DoctorCreationManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: endPoint.DOCTORLISTMANAGEMENT,
          element: <WithRole component={DoctorListManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: endPoint.APPOINTMENTMANAGEMENT,
          element: <WithRole component={AppointmentManagement} allowedRoles={["Staff"]} />,
        },

        {
          path: endPoint.CHECKEDINAPPOINTMENTTODAY,
          element: <WithRole component={AppointmentTodayManagement} allowedRoles={["Staff"]} />,
        },

        {
          path: endPoint.TODAYAPPOINTMENTMANAGEMENT,
          element: <WithRole component={AppointmentTodayManagement} allowedRoles={["Staff"]} />,
        },

        {
          path: endPoint.BLOGMANAGEMENT,
          element: <WithRole component={BlogManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: endPoint.ACCOUNTMANAGEMENT,
          element: <WithRole component={AccountManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: "experience-management/:doctorId",
          element: <WithRole component={ExperienceManagement} allowedRoles={["Admin"]} />,
        },

        {
          path: "certificate-management/:doctorId",
          element: <WithRole component={CertificateManagement} allowedRoles={["Admin"]} />,
        },
        {
          path: endPoint.BLOGMANAGEMENT,
          element: <BlogManagement />,
        },
        {
          path: endPoint.ARVMANAGEMENT,
          element: <WithRole component={ArvManagement} allowedRoles={["Admin"]} />,
        },
        {
          path: endPoint.SCHEDULEACTIVITYMANAGEMENT,
          element: <WithRole component={ScheduleActivityManagement} allowedRoles={["Admin", "Staff"]} />,
        },
      ],
    },
    {
      path: "/doctors/:id",
      element: <DoctorDetail />,
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default App;
