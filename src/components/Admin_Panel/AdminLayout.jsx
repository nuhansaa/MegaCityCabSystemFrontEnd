import React from "react";
import Admin_Sidebar from "./Admin_Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-amber-50">
      <Admin_Sidebar/>
      <div className="flex-1 flex-col flex">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;