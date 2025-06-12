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

  const isWhiteBackgroundPage =
    [
      "/booking-appointment",
      "/services/hiv_treatment",
      "/services/testing_stds",
      "/services/hiv_testing",
      "/blogs-page",
      "/profile-page",
      "/schedule-consultation",
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
      items={[
        {
          key: "hiv_treatment",
          label: (
            <span onClick={() => navigate("/services/hiv_treatment")}>
              HIV Treatment
            </span>
          ),
        },
        {
          key: "testing_stds",
          label: (
            <span onClick={() => navigate("/services/testing_stds")}>
              STD Testing
            </span>
          ),
        },
        {
          key: "hiv_testing",
          label: (
            <span onClick={() => navigate("/services/hiv_testing")}>
              HIV Testing
            </span>
          ),
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
      ? "bg-white text-black shadow-md"
      : "bg-white/10 text-white backdrop-blur";

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 px-6 py-3 flex items-center justify-between transition-all duration-300 ${headerClasses}`}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
        <Image src={logo} width={45} preview={false} />
        <h1 className="text-[17px] font-semibold bg-gradient-to-r from-[#1e88e5] to-purple-600 bg-clip-text text-transparent hidden md:block">
          HIV TREATMENT
        </h1>
      </div>

      {/* Middle: Menu */}
      <div className="hidden md:flex gap-8 font-semibold text-[16px] items-center">
        {menuItemsHeader.map((item) => (
          <span
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className={`cursor-pointer hover:text-[#1e88e5] transition duration-200 ${
              location.pathname === item.path ? "text-[#1e88e5] underline" : ""
            }`}
          >
            {item.label}
          </span>
        ))}

        {isAuthenticated && (
          <Dropdown overlay={serviceMenu} placement="bottom">
            <span className="cursor-pointer hover:text-[#1e88e5] transition duration-200">
              Services <DownOutlined style={{ fontSize: "12px" }} />
            </span>
          </Dropdown>
        )}
      </div>

      {/* Right: User Info or Login/Register */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div
            onClick={() => navigate("/profile-page")}
            className="flex items-center gap-3 px-3 py-1 rounded-full transition cursor-pointer"
          >
            <p className="text-sm font-medium">{fullname}</p>
            <img
              src={urlImageProfile}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover border border-gray-300 shadow-md"
            />
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-lg text-sm font-semibold cursor-pointer">
            <span onClick={() => navigate("/login-page")} className="hover:text-[#1e88e5]">
              Login
            </span>
            <span>/</span>
            <span onClick={() => navigate("/register-page")} className="hover:text-[#1e88e5]">
              Register
            </span>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
