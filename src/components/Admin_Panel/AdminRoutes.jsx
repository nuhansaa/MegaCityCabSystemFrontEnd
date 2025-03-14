import React from 'react';
import { Routes,Route } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import AdminLayout from './AdminLayout';
import Admin_Driver from "./Admin_Driver";
import Admin_Car from "./Admin_Car";
import Admin_Customer from "./Admin_Customer";
import Admin_Booking from "./Admin_Booking";


const AdminRoutes = () => {
  return (
    <div >
        <Routes>

         <Route path='/' element={<AdminLayout/>} >
         <Route index element={<AdminDashboard/>} />
         <Route path='dashboard' element={<AdminDashboard/>} />
         <Route path='driver' element={<Admin_Driver/>} />
         <Route path='car' element={<Admin_Car/>} />
         <Route path='customer' element={<Admin_Customer/>} />
         <Route path='booking' element={<Admin_Booking/>} />
         </Route>

        </Routes>

    </div>
  );
}

export default AdminRoutes;