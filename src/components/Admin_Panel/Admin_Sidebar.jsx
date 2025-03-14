import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Car,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../util/AuthContex";

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState("dashboard");
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
      path: "/admin/dashboard",
    },
    {
      id: "drivers",
      icon: <Users size={20} />,
      label: "Drivers",
      path: "/admin/driver",
    },
    {
      id: "customers",
      icon: <Users size={20} />,
      label: "Customers",
      path: "/admin/customer",
    },
    {
      id: "cabs",
      icon: <Car size={20} />,
      label: "Cabs",
      path: "/admin/car",
    },
    {
      id: "bookings",
      icon: <BarChart3 size={20} />,
      label: "Bookings",
      path: "/admin/booking",
    },
    
  ];

  const handleItemClick = (id) => {
    setActiveItem(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const initials = user?.username
    ? user.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div
      className={`${collapsed ? "w-20" : "w-64"} h-screen bg-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out`}
    >
      {/* Header / Logo */}
      <div className="flex items-center justify-between p-5 border-b border-gray-800">
        {!collapsed && (
          <h1 className="text-xl font-semibold text-lime-400">
            Admin<span className="text-white">Panel</span>
          </h1>
        )}
        {collapsed && (
          <div className="w-full flex justify-center">
            <span className="text-xl font-bold text-lime-400">A</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-lime-400"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeItem === item.id
                    ? "bg-gray-800 text-lime-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-lime-400"
                }`}
                onClick={() => handleItemClick(item.id)}
              >
                <span className="mr-3">{item.icon}</span>
                {!collapsed && <span className="text-sm">{item.label}</span>}
                {activeItem === item.id && !collapsed && (
                  <span className="ml-auto w-2 h-2 bg-lime-400 rounded-full"></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div
        className={`p-4 border-t border-gray-800 flex ${
          collapsed ? "justify-center" : "items-center"
        }`}
      >
        {!collapsed ? (
          <>
            <div className="h-10 w-10 rounded-full bg-lime-400 flex items-center justify-center text-gray-900 font-bold">
              {initials}
            </div>
            <div className="ml-3 flex items-center justify-between flex-1">
              <div>
                <p className="text-sm font-medium text-white">
                  {user?.username || "Administrator"}
                </p>
                <p className="text-xs text-gray-400">Administrator</p>
              </div>
              <a href="/AuthLogin">
              <button
                onClick={handleLogout}
                className="p-1 rounded-md hover:bg-gray-800 text-gray-400 hover:text-lime-400"
              >
                <LogOut size={18} />
              </button>
              </a>
            </div>
          </>
        ) : (
          <div className="h-10 w-10 rounded-full bg-lime-400 flex items-center justify-center text-gray-900 font-bold">
            {initials}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;