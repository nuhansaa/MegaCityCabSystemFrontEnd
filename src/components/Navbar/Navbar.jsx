import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
            <Link to="/AuthLogin">
              <button className="bg-transparent border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-gray-900 px-6 py-2 rounded-md font-medium flex items-center space-x-2 active:scale-95 transition-colors duration-200 hover:shadow-[0_0_10px_rgba(132,204,22,0.8)]">
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            </Link>
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
            <Link to="/AuthLogin">
              <button className="w-full bg-transparent border border-lime-400 text-lime-400 hover:bg-lime-400 hover:text-gray-900 px-6 py-2 rounded-md font-medium flex items-center justify-center space-x-2 active:scale-95 transition-colors duration-200 hover:shadow-[0_0_10px_rgba(132,204,22,0.8)]">
                <User className="h-4 w-4" />
                <span>Login</span>
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;