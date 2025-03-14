import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, MapPin, Phone, Mail, Edit, CheckCircle, TrendingUp, ShoppingBag } from "lucide-react";

const DriverDashboard = () => {
  const navigate = useNavigate();

  // Sample driver data 
  const driver = {
    name: "Devin",
    joinDate: "March 12, 2025",
    location: "36/A Viskam Rd, Galle",
    phone: "076345343",
    email: "devin@gmail.com",
    totalOrders: 24,
    wishlistItems: 12,
    reviews: 8,
    rewardPoints: 350,
  };

  // Sample recent activities 
  const recentActivities = [
    {
      icon: <CheckCircle size={24} className="text-lime-400" />,
      title: "Order #12345 Completed",
      description: "Your order has been delivered successfully 2 days ago.",
    },
    {
      icon: <TrendingUp size={24} className="text-lime-400" />,
      title: "Account Upgraded",
      description: "You've been upgraded to Premium membership 1 week ago.",
    },
    {
      icon: <ShoppingBag size={24} className="text-lime-400" />,
      title: "Order #12344 Placed",
      description: "You placed an order for 3 items 2 weeks ago.",
    },
  ];

  const handleEditProfile = () => {
    navigate("/UpdateDriverProfile");
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md py-4 px-6 flex justify-between items-center border-b border-gray-700">
        <h1 className="text-2xl font-bold text-lime-400">Driver Dashboard</h1>
        <div className="flex items-center gap-3">
          <Bell size={24} className="text-lime-400 cursor-pointer hover:text-lime-300" />
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
              <User size={24} className="text-lime-400" />
            </div>
            <span className="text-lime-400 font-medium">{driver.name}</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex flex-col md:flex-row gap-6 p-6">
        {/* Left Section: Driver Profile */}
        <div className="bg-gray-800 rounded-xl shadow-md p-6 md:w-1/3 border border-gray-700">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <User size={48} className="text-lime-400" />
            </div>
            <h2 className="text-2xl font-bold text-lime-400">{driver.name}</h2>
            <p className="text-gray-400 text-sm">Member since {driver.joinDate}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <MapPin size={20} className="text-lime-400" />
              <span className="text-gray-300">{driver.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone size={20} className="text-lime-400" />
              <span className="text-gray-300">{driver.phone}</span>
            </div>
            <div className="flex items-center gap-3">
              <Mail size={20} className="text-lime-400" />
              <span className="text-gray-300">{driver.email}</span>
            </div>
          </div>

          <button
            onClick={handleEditProfile}
            className="mt-6 w-full bg-lime-600 text-white py-3 rounded-lg font-semibold hover:bg-lime-700 transition-all duration-300 flex items-center justify-center gap-2"
          >
            <Edit size={20} />
            Edit Profile
          </button>
        </div>

        {/* Right Section: Recent Activity & Summary */}
        <div className="flex-grow space-y-6">
          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-lime-400 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-700 rounded-lg">
                  <div className="flex-shrink-0">{activity.icon}</div>
                  <div>
                    <h4 className="text-lime-300 font-semibold">{activity.title}</h4>
                    <p className="text-gray-300 text-sm">{activity.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Account Summary */}
          <div className="bg-gray-800 rounded-xl shadow-md p-6 border border-gray-700">
            <h3 className="text-xl font-bold text-lime-400 mb-6">Account Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300">
                <h4 className="text-gray-300 text-sm font-medium">Total Orders</h4>
                <p className="text-2xl font-bold text-lime-400">{driver.totalOrders}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300">
                <h4 className="text-gray-300 text-sm font-medium">Wishlist Items</h4>
                <p className="text-2xl font-bold text-lime-400">{driver.wishlistItems}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300">
                <h4 className="text-gray-300 text-sm font-medium">Reviews</h4>
                <p className="text-2xl font-bold text-lime-400">{driver.reviews}</p>
              </div>
              <div className="text-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all duration-300">
                <h4 className="text-gray-300 text-sm font-medium">Reward Points</h4>
                <p className="text-2xl font-bold text-lime-400">{driver.rewardPoints}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverDashboard;