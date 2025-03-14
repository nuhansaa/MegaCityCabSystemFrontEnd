import React, { useState } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { motion } from "framer-motion"; // Import Framer Motion for animations
import { User, Lock, Phone, Mail, ArrowRight, ChevronLeft, Shield, MapPin } from "lucide-react"; // Import Lucide icons
import loginPageImg from "../../assets/Background_Images/YellowCabs_WithCityLandscape.jpg";

// Custom Modern Car Logo component (unchanged)
const ModernCarLogo = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-8 h-8"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <path d="M3,12 C3,12 3,14 3,15" />
    <path d="M21,12 C21,12 21,14 21,15" />
    <path
      d="M4,10 C7,9 17,9 20,10 L19,14 C16,13 8,13 5,14 L4,10z"
      strokeLinejoin="round"
    />
    <path d="M7,10 C9,7.5 15,7.5 17,10" strokeLinecap="round" />
    <circle cx="7.5" cy="14" r="2" />
    <circle cx="16.5" cy="14" r="2" />
    <path d="M19,11.5 L18.5,13" strokeLinecap="round" />
    <path d="M5,11.5 L5.5,13" strokeLinecap="round" />
    <path d="M9.5,10.5 L14.5,10.5" strokeLinecap="round" strokeWidth="1" />
  </svg>
);

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    nic: "",
    address: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false); // Added state for terms checkbox

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTermsChange = (e) => {
    setTermsAccepted(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const customerData = {
        customerName: formData.fullName,
        customerAddress: formData.address,
        customerNic: formData.nic,
        customerPhone: formData.phone,
        email: formData.email,
        password: formData.password,
      };

      const response = await fetch("http://localhost:8080/auth/customers/createCustomer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (!response.ok) {
        throw new Error("Failed to create customer");
      }

      const result = await response.json();
      console.log("Customer created successfully:", result);

      setFormData({
        fullName: "",
        phone: "",
        email: "",
        password: "",
        nic: "",
        address: "",
      });

      alert("Customer created successfully!");
    } catch (error) {
      console.error("Error creating customer:", error);
      setError("Failed to create customer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center py-12">
      {/* Background with Overlay */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={loginPageImg}
          alt="Taxi street scene"
          className="absolute w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gray-900/50" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[15%] left-[25%] w-64 h-64 bg-lime-400/20 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-lime-400/10 rounded-full filter blur-[150px] animate-pulse delay-700" />
        </div>
      </div>

      {/* Logo at Top Left */}
      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold">
          <span className="text-white">MEGACITY</span>
          <span className="text-lime-400"> CABS</span>
        </h1>
      </div>

      {/* Sign Up Container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md mx-auto px-8 py-10 bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl"
      >
        <div className="space-y-6">
          {/* Sign Up Header */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Create Your Account</h2>
            <p className="text-gray-400">Join MegaCity Cabs for premium rides</p>
          </div>

          {/* Sign Up Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/50 text-red-200 p-2 rounded text-sm text-center">
                {error}
              </div>
            )}

            {/* Full Name Field */}
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-white font-medium">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-white font-medium">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="+94 71 234 5678"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-white font-medium">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* NIC Number Field */}
            <div className="space-y-1">
              <label htmlFor="nic" className="block text-white font-medium">
                NIC Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Shield className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="nic"
                  name="nic"
                  type="text"
                  value={formData.nic}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="123456789V"
                />
              </div>
            </div>

            {/* Address Field */}
            <div className="space-y-1">
              <label htmlFor="address" className="block text-white font-medium">
                Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-white font-medium">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent"
                  placeholder="••••••••"
                  minLength="8"
                />
              </div>
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={handleTermsChange}
                  required
                  className="h-4 w-4 bg-gray-900 border-gray-700 rounded text-lime-400 focus:ring-lime-400"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="text-gray-400">
                  I agree to the{" "}
                  <a href="#" className="text-lime-400 hover:text-lime-300">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-lime-400 hover:text-lime-300">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                disabled={isLoading}
                className="group w-full flex justify-center items-center py-3 px-4 bg-lime-400 text-gray-900 font-semibold rounded-xl hover:bg-lime-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)]"
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-900 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <motion.a
                href="/AuthLogin"
                whileHover={{ scale: 1.05 }}
                className="text-lime-400 font-medium hover:text-lime-300"
              >
                Log in
              </motion.a>
            </p>
          </div>

          {/* Back to Home */}
          <motion.a
            href="/"
            whileHover={{ x: -3 }}
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </motion.a>
        </div>
      </motion.div>
    </div>
  );
};

export default SignUpPage;