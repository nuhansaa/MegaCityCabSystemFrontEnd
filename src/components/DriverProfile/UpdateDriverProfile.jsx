import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateDriverProfile = () => {
  const navigate = useNavigate();
  const { driverId } = useParams(); // Get driverId from URL

  // Simulated driver data (replace with actual data fetched from backend if needed)
  const [driver, setDriver] = useState({
    driverName: "John Doe",
    driverLicenseNo: "DL123456",
    driverPhoneNum: "+1 (555) 123-4567",
    email: "johndoe@example.com",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate a successful update (replace with actual API call in a real app)
    try {
      setTimeout(() => {
        alert("Profile updated successfully!");
        navigate("/driverDashboard"); // Redirect back to profile page with a smooth transition
      }, 500); // Slight delay for a better UX feel
    } catch (err) {
      setError("Failed to update profile. Please try again.");
      console.error("Error updating driver profile:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-lime-400 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-lime-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-700 transform transition-all duration-300 hover:shadow-lime-500/20">
        <h2 className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-lime-400 to-lime-500 bg-clip-text text-transparent">
          Update Profile
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-lime-400 mb-2">Full Name</label>
            <input
              type="text"
              name="driverName"
              value={driver.driverName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-300 shadow-inner hover:shadow-lime-500/30"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-lime-400 mb-2">License Number</label>
            <input
              type="text"
              name="driverLicenseNo"
              value={driver.driverLicenseNo}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-300 shadow-inner hover:shadow-lime-500/30"
              placeholder="Enter your license number"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-lime-400 mb-2">Phone Number</label>
            <input
              type="text"
              name="driverPhoneNum"
              value={driver.driverPhoneNum}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-300 shadow-inner hover:shadow-lime-500/30"
              placeholder="Enter your phone number"
              required
            />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-lime-400 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={driver.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent transition-all duration-300 shadow-inner hover:shadow-lime-500/30"
              placeholder="Enter your email"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-lime-500 to-lime-600 text-gray-900 py-3 rounded-xl font-semibold text-lg hover:from-lime-600 hover:to-lime-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-lime-500/40"
          >
            Update Profile
          </button>
          {error && <p className="text-lime-400 text-sm text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

// CSS Animation for Background Blobs
const styles = `
  @keyframes blob {
    0% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
    100% { transform: translate(0, 0) scale(1); }
  }
  .animate-blob {
    animation: blob 15s infinite;
  }
  .animation-delay-2000 {
    animation-delay: 2s;
  }
  .animation-delay-4000 {
    animation-delay: 4s;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

export default UpdateDriverProfile;