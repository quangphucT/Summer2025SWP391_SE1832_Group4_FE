import { useEffect, useState } from "react";
import { Dropdown, Image, Menu } from "antd";
import "./index.scss";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import endPoint from "../../routers/router";
import { useSelector } from "react-redux";
import { DownOutlined } from "@ant-design/icons";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const isAuthenticated = !!localStorage.getItem("token");
  const urlImageProfile = useSelector((store) => store?.user?.profileImageUrl);
  const fullname = useSelector((store) => store?.user?.fullName);

  const isWhiteBackgroundPage = [
    "/booking-appointment",
    "/services/hiv_treatment",
    "/services/testing_stds",
    "/services/hiv_testing",
    "/blogs-page",
    "/profile-page",
    "/schedule-consultation",
    "/testing-hiv-page",
  ].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    if (!isWhiteBackgroundPage) {
      window.addEventListener("scroll", handleScroll);
    }
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isWhiteBackgroundPage]);

  const serviceMenu = (
    <Menu
      style={{ width: "300px", display: "flex", flexDirection: "column" }}
      items={[
        {
          key: "testing_HIV",
          label: (
            <span onClick={() => navigate("/testing-hiv-page")}>
              HIV Testing – Fast & Confidential
            </span>
          ),
        },
        {
          key: "testing_stds",
          label: <span onClick={() => navigate("")}>HIV Treatment</span>,
        },
      ]}
    />
  );

  const menuItemsHeader = [
    { label: "Home", path: endPoint.HOME },
    { label: "Blogs", path: endPoint.BLOGSPAGE },
    { label: "Consultation", path: endPoint.SCHEDULEACONSULTATION },
  ];

  const handleNavigate = (path) => navigate(path);

  const headerClasses =
    isWhiteBackgroundPage || scrolled
      ? "bg-white text-black shadow-sm"
      : "bg-white/70 backdrop-blur text-black";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-6 py-4 flex items-center justify-between transition-all duration-300 ${headerClasses}`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
       
        <h1 className="text-xl font-extrabold text-indigo-700 hidden md:block">
          LifeLink HIV 
        </h1>
      </div>

      {/* Middle: Menu */}
      <div className="hidden md:flex gap-10 font-medium text-[15px] items-center text-gray-700">
        {menuItemsHeader.map((item) => (
          <span
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`cursor-pointer hover:text-indigo-600 transition-colors duration-200 ${
              location.pathname === item.path ? "text-indigo-600 font-semibold" : ""
            }`}
          >
            {item.label}
          </span>
        ))}

        {isAuthenticated && (
          <Dropdown overlay={serviceMenu} placement="bottom">
            <span className="cursor-pointer hover:text-indigo-600 transition">
              Services <DownOutlined style={{ fontSize: "12px", marginLeft: "4px" }} />
            </span>
          </Dropdown>
        )}
      </div>

      {/* Right: User Info or Login/Register */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div
            onClick={() => navigate("/profile-page")}
            className="flex items-center gap-3 px-3 py-1 rounded-full transition cursor-pointer bg-gray-100 hover:bg-gray-200"
          >
            <p className="text-sm font-medium text-gray-700">{fullname}</p>
            <img
              src={urlImageProfile}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-sm"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-indigo-50 px-4 py-2 rounded-full text-sm font-medium text-indigo-700 cursor-pointer shadow-sm">
            <span onClick={() => navigate("/login-page")} className="hover:text-indigo-600">
              Login
            </span>
            <span>/</span>
            <span onClick={() => navigate("/register-page")} className="hover:text-indigo-600">
              Register
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
