import React, { useState } from "react";
import { Menu, X, User, ChevronDown } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../util/AuthContex"; // Adjust the path as necessary

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout from AuthContext

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Drive", href: "/Drive" },
    { label: "Cabs", href: "/Cabs" },
    { label: "About Us", href: "/AboutUs" },
    { label: "Contact", href: "/Contact" },
  ];

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`text-gray-300 hover:text-lime-400 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
          isActive ? "text-lime-400" : ""
        }`}
      >
        {children}
      </Link>
    );
  };

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate("/"); // Redirect to the home page after logout
  };

  return (
    <nav className="bg-gray-900 shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="text-white italic">MEGA</span>
              <span className="text-white italic">CITY</span>
              <span className="text-lime-400 italic"> CABS</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.href}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/Cabs">
              <button className="bg-lime-400 text-gray-900 hover:bg-lime-300 px-6 py-2 rounded-md font-medium active:scale-95 transition-colors duration-200">
                Book a Ride
              </button>
            </Link>
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-3 focus:outline-none group">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-lime-400 text-gray-900 flex items-center justify-center border-2 border-lime-400 group-hover:border-lime-300 transition-colors shadow-md">
                      {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                    </div>
                    <ChevronDown className="w-4 h-4 text-lime-400 absolute -right-6 top-1/2 -translate-y-1/2" />
                  </div>
                </button>
                <div className="absolute right-0 mt-3 w-56 bg-gray-800 rounded-lg shadow-xl py-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200 border border-gray-700">
                  <div className="px-4 py-3 text-sm font-medium text-lime-400 border-b border-gray-700 capitalize">
                    {user.role?.replace("ROLE_", "").toLowerCase()}
                  </div>
                  {user.role === "ROLE_DRIVER" && (
                    <Link
                      to="/driver-dashboard"
                      className="block px-4 py-2.5 text-sm text-gray-300 hover:text-lime-400 hover:bg-gray-700 transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2.5 text-sm text-lime-400 hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/AuthLogin">
                <button className="bg-transparent border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-gray-900 px-6 py-2 rounded-md font-medium flex items-center space-x-2 active:scale-95 transition-colors duration-200 hover:shadow-[0_0_10px_rgba(132,204,22,0.8)]">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 p-2 rounded-md"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink key={item.label} to={item.href}>
                {item.label}
              </NavLink>
            ))}
            <Link to="/Cabs">
              <button className="w-full bg-lime-400 text-gray-900 hover:bg-lime-300 px-6 py-2 rounded-md font-medium active:scale-95 transition-colors duration-200">
                Book a Ride
              </button>
            </Link>
            {user ? (
              <div className="space-y-2">
                <div className="px-4 py-3 text-sm font-medium text-lime-400 border-b border-gray-700 capitalize">
                  {user.role?.replace("ROLE_", "").toLowerCase()}
                </div>
                {user.role === "ROLE_DRIVER" && (
                  <Link
                    to="/driver-dashboard"
                    className="block px-4 py-2.5 text-sm text-gray-300 hover:text-lime-400 hover:bg-gray-700 transition-colors"
                  >
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2.5 text-sm text-lime-400 hover:bg-gray-700 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link to="/AuthLogin">
                <button className="w-full bg-transparent border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-gray-900 px-6 py-2 rounded-md font-medium flex items-center justify-center space-x-2 active:scale-95 transition-colors duration-200 hover:shadow-[0_0_10px_rgba(132,204,22,0.8)]">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </button>
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;