import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 py-12 px-6 font-sans shadow-inner">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
            About Us
          </h4>
          <p className="text-base leading-relaxed text-gray-600">
            We are dedicated to raising awareness, offering support, and sharing trusted information about HIV and AIDS to help build a healthier community.
          </p>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
            Resources
          </h4>
          <ul className="text-base space-y-3">
            <li>
              <Link
                to="/prevention"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Prevention
              </Link>
            </li>
            <li>
              <Link
                to="/treatment"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Treatment
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Support
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold mb-4 border-b-2 border-gray-300 pb-2">
            Stay Connected
          </h4>
          <p className="text-base text-gray-600 mb-2">
            <strong>Email:</strong> support@hivawareness.org
          </p>
          <p className="text-base text-gray-600">
            <strong>Phone:</strong> +84 123 456 789
          </p>
        </div>
      </div>

      <div className="mt-12 text-center text-sm text-gray-500 select-none">
        © {new Date().getFullYear()} HIV Awareness. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
