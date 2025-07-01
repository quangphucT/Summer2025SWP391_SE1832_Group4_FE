import { createBrowserRouter, RouterProvider } from "react-router-dom";
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


const App = () => {
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
      element: <DashboardDoctorTestingLayout />,
    },

    // dashboard for doctor consultant
    {
      path: endPoint.DASHBOARDLAYOUTDOCTORCONSULTANT,
      element: <DashboardDoctorConsultantLayout />,
    },
    {
      path: endPoint.DASHBOARD,
      element: <DashboardLayout />,
      children: [
        {
          path: endPoint.DASHBOARDSTATISTICS,
          element: <DashboardStatistics />,
        },
        {
          path: endPoint.PROTOCOLMANAGEMENT,
          element: <ProtocolManagement />,
        },
        {
          path: endPoint.CUSTOMERMANAGEMENT,
          element: <CustomerManagement />,
        },

        {
          path: endPoint.DOCTORMANAGEMENT,
          element: <DoctorManagement />,
        },


        {
          path: endPoint.DOCTORCREATEACCOUNTBYSTAFF,
          element: <DoctorCreationManagement />,
        },

         {
          path: endPoint.DOCTORLISTMANAGEMENT,
          element: <DoctorListManagement/>,
        },




        {
          path: endPoint.APPOINTMENTMANAGEMENT,
          element: <AppointmentManagement />,
        },

        {
          path: endPoint.CHECKEDINAPPOINTMENTTODAY,
          element: <AppointmentTodayManagement />,
        },

        {
          path: endPoint.TODAYAPPOINTMENTMANAGEMENT,
          element: <AppointmentTodayManagement />,
        },

        {
          path: endPoint.BLOGMANAGEMENT,
          element: <BlogManagement />,
        },

        {
          path: endPoint.ACCOUNTMANAGEMENT,
          element: <AccountManagement />,
        },

        {
          path: "experience-management/:doctorId",
          element: <ExperienceManagement />,
        },

        {
          path: "certificate-management/:doctorId",
          element: <CertificateManagement />,
        },
        {
          path: endPoint.BLOGMANAGEMENT,
          element: <BlogManagement />,
        },
        {
          path: endPoint.ARVMANAGEMENT,
          element: <ArvManagement />,
        },
      ],
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
