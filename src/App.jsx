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

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


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
          element: <AppointmentMenuPage/>,
        },

         {
          path: endPoint.TRANSACTION,
          element: <TransactionMenuPage/>,
        },

         {
          path: endPoint.MEDICALRECORD,
          element: <MedicalRecordMenuPage/>,
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
      element: <ResetPassword/>,
    },
      {
      path: endPoint.PASSWORDAFTERREGISTER,
      element: <SetUpPasswordAfterRegister/>,
    },
    {
      path: endPoint.FORGOTPASSWORD,
      element: <ForgotPasswordPage />,
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
          path: endPoint.CUSTOMERMANAGEMENT,
          element: <CustomerManagement />,
        },
        {
          path: endPoint.AccountManagement,
          element: <ProtocolManagement />,
        },
        {
          path: endPoint.ACCOUNTMANAGEMENT,
          element: <AccountManagement />,
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
