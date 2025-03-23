import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../util/AuthContex';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8080/auth/login', formData);
      const { token, userId, role } = response.data;

      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);

      login(token);

      switch (role) {
        case 'ROLE_ADMIN':
          navigate('/admin');
          break;
        case 'ROLE_CUSTOMER':
          navigate('/');
          break;
        case 'ROLE_DRIVER':
          navigate('/DriverProfile');
          break;
        default:
          setError('Invalid user role');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setError('Invalid email or password');
            break;
          case 404:
            setError('User not found');
            break;
          case 403:
            setError('Account is locked. Please contact support');
            break;
          default:
            setError('Login failed. Please try again later');
        }
      } else if (error.request) {
        setError('Cannot connect to server. Please check your internet connection');
      } else {
        setError('An unexpected error occurred. Please try again');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="AuthLogin">
    <div className="relative min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        <img src="/src/assets/Background_Images/YellowCabs_WithCityLandscape.jpg" alt="Taxi street scene" className="absolute w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gray-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent" />
      </div>

      <div className="absolute top-8 left-8">
        <h1 className="text-2xl font-bold">
          <span className="text-white">MEGACITY</span>
          <span className="text-lime-400"> CABS</span>
        </h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative w-full max-w-md mx-auto px-8 py-12 bg-gray-800/40 backdrop-blur-lg rounded-2xl border border-gray-700/50 shadow-xl">
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">Login to Your Account</h2>
            <p className="text-gray-400">Access your MegaCity Cabs account</p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white font-medium">Email Address</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required disabled={isLoading} className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent" placeholder="your@email.com" />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-white font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input id="password" name="password" type="password" value={formData.password} onChange={handleChange} required disabled={isLoading} className="w-full pl-10 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-400/50 focus:border-transparent" placeholder="••••••••" />
              </div>
            </div>

            <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className={`group w-full flex justify-center items-center py-3 px-4 bg-lime-400 text-gray-900 font-semibold rounded-xl hover:bg-lime-300 transition-all duration-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)] ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}>
              {isLoading ? 'Logging in...' : 'Log In'}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </form>

          <div className="text-center">
            <p className="text-gray-400">Don't have an account? <Link to="/AuthSignUp" className="text-lime-400 font-medium hover:text-lime-300">Sign up</Link></p>
          </div>

          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white transition-colors duration-300">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to home
          </Link>
        </div>
      </motion.div>
    </div>
    </div>
  );
};

export default LoginPage;
