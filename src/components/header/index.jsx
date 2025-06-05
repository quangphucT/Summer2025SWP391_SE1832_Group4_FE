import { useEffect, useState } from "react";
import { Dropdown, Image, Menu } from "antd";
import "./index.scss";
import logo from "../../assets/images/logo.png";
import { useLocation, useNavigate } from "react-router-dom";
import endPoint from "../../routers/router";
import { UserOutlined } from "@ant-design/icons";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  const isWhiteBackgroundPage = 
  location.pathname === "/booking-appointment" 
  || location.pathname === "/services/hiv_treatment" 
  || location.pathname === "/profile-page"
  || location.pathname === "/services/testing_stds"
  || location.pathname === "/services/hiv_testing";

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
          label: <span onClick={() => navigate("/services/hiv_treatment")}>HIV treatment</span>,
        },
        {
          key: "testing_stds",
          label: <span onClick={() => navigate("/services/testing_stds")}>Testing for STDs</span>,
        },
        {
          key: "hiv_testing",
          label: <span onClick={() => navigate("/services/hiv_testing")}>HIV testing</span>,
        },
      ]}
    />
  );

  const menuItemsHeader = [
    { label: "Home", path: endPoint.HOME },
    { label: "Blogs", path: endPoint.BLOGSPAGE },
    // { label: "Book an appointment", path: endPoint.BOOKINGAPPOINTMENT },
    // Remove Service from here
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  const headerClasses =
    isWhiteBackgroundPage || scrolled
      ? "bg-white text-black shadow-md"
      : "bg-white/15 text-white backdrop-blur";

  return (
    <header
      className={`fixed top-0 w-full z-50 px-7 py-1 flex items-center justify-between transition-all duration-300 ${headerClasses}`}
    >
      {/* Logo */}
      <div className="flex items-center space-x-4 cursor-pointer">
        <Image
          onClick={() => {
            navigate("/");
          }}
          src={logo}
          width={70}
          preview={false}
        />
        <h1 className="text-xl font-extrabold hidden sm:block bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 bg-clip-text text-transparent">
          HIV TREATMENT
        </h1>
      </div>

      {/* Middle */}
      <div className="flex space-x-[30px] font-mono font-bold text-[20px] cursor-pointer">
        {menuItemsHeader.map((item) => (
          <p
            key={item.path}
            onClick={() => handleNavigate(item.path)}
            className="hover:underline"
          >
            {item.label}
          </p>
        ))}

        {/* Service dropdown */}
        <Dropdown overlay={serviceMenu} placement="bottom">
          <p className="hover:underline">Service</p>
        </Dropdown>
      </div>

      {/* Right */}
      <div className="flex space-x-5 items-center">

        <div className="hidden md:flex flex-col text-right">
          <span className="font-medium font-mono">Act Today</span>
          <span className="text-sm font-mono">For a Future without HIV</span>
        </div>

        <UserOutlined className="cursor-pointer" onClick={() => {navigate("/profile-page")}}/>
        <div className="flex space-x-1.5 cursor-pointer bg-[#e1e1e1] text-[#000] py-2 px-1 rounded-[5px]">
          <p
            onClick={() => navigate("/login-page")}
            className="font-mono font-bold hover:underline"
          >
            Login
          </p>
          <span>/</span>
          <p
            onClick={() => navigate("/register-page")}
            className="font-mono font-bold hover:underline"
          >
            Register
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
