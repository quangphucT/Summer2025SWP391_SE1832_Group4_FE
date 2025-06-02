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
import BookingAppointment from "./pages/booking-appointment-pages";
import BlogsPages from "./pages/blogs-pages";
import SetUpPasswordAfterRegister from "./pages/authentication-pages/setup-passwordAfterRegister-page";

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
          path: endPoint.BOOKINGAPPOINTMENT,
          element: <BookingAppointment />,
        },
        {
          path: endPoint.BLOGSPAGE,
          element: <BlogsPages />,
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
          path: endPoint.PROTOCOLMANAGEMENT,
          element: <ProtocolManagement />,
        },
      ],
    },
  ]);
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
