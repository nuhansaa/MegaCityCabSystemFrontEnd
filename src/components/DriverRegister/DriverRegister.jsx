import React, { useState } from 'react';
import { Car, Mail, Phone, User, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';

const DriverRegister = () => {
  const [formData, setFormData] = useState({
    driverName: '',
    hasOwnCar: false,
    driverVehicalLicense: '',
    carBrand: '',
    carModel: '',
    carLicensePlate: '',
    carImg: null, // Changed from 'null' to null for proper file handling
    capacity: '',
    baseRate: '', // Changed from baseplate to match Car model
    driverRate: '',
    driverPhone: '',
    email: '',
    password: '',
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('driverName', formData.driverName);
    data.append('email', formData.email);
    data.append('driverVehicalLicense', formData.driverVehicalLicense);
    data.append('driverPhone', formData.driverPhone);
    data.append('password', formData.password);
    data.append('hasOwnCar', formData.hasOwnCar);

    if (formData.hasOwnCar) {
      data.append('carBrand', formData.carBrand);
      data.append('carModel', formData.carModel);
      data.append('carLicensePlate', formData.carLicensePlate);
      data.append('capacity', formData.capacity);
      data.append('baseRate', formData.baseRate);
      data.append('driverRate', formData.driverRate);
      if (formData.carImg) {
        data.append('carImg', formData.carImg); // Matches backend expectation
      }
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/driver/createdriver', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setSuccess('Driver registered successfully!');
      setError(null);
      console.log('Response:', response.data);
    } catch (err) {
      setError('Error registering driver: ' + (err.response?.data || err.message));
      setSuccess(null);
      console.error('Error:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'file' ? files[0] : value,
    });
  };

  const nextStep = () => setCurrentStep(2);
  const prevStep = () => setCurrentStep(1);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[20%] w-32 h-32 sm:w-48 sm:h-48 lg:w-64 lg:h-64 bg-lime-400/20 rounded-full filter blur-[60px] sm:blur-[80px] lg:blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 bg-lime-400/10 rounded-full filter blur-[80px] sm:blur-[100px] lg:blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row bg-gray-800/50 backdrop-blur-lg rounded-2xl overflow-hidden border border-gray-700/50">
          <div className="w-full lg:w-1/2 p-6 sm:p-8 lg:p-12">
            <div className="mb-6 sm:mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-lime-400/10 rounded-full text-lime-400 text-sm font-medium mb-3 sm:mb-4">
                <Car className="w-4 h-4 mr-2" />
                Driver Registration
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Join Our Team</h2>
              <p className="text-sm sm:text-base text-gray-400">Enter your details to get started with us</p>
            </div>

            {error && <p className="text-red-400 mb-4">{error}</p>}
            {success && <p className="text-lime-400 mb-4">{success}</p>}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {currentStep === 1 && (
                <>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-lime-400" />
                    </div>
                    <input
                      type="text"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                      placeholder="Full Name"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-lime-400" />
                    </div>
                    <input
                      type="tel"
                      name="driverPhone"
                      value={formData.driverPhone}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                      placeholder="Phone Number"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-lime-400" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Car className="h-5 w-5 text-lime-400" />
                    </div>
                    <input
                      type="text"
                      name="driverVehicalLicense"
                      value={formData.driverVehicalLicense}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                      placeholder="Driver Vehicle License"
                      required
                    />
                  </div>

                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-lime-400" />
                    </div>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                      placeholder="Password"
                      required
                    />
                  </div>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="w-full flex items-center justify-center bg-lime-400 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-lime-300 transition-colors duration-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)] text-sm sm:text-base"
                  >
                    Next <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </>
              )}

              {currentStep === 2 && (
                <>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="hasOwnCar"
                      checked={formData.hasOwnCar}
                      onChange={handleChange}
                      className="w-4 h-4 text-lime-400 bg-gray-800/50 border-gray-700 rounded focus:ring-lime-400"
                    />
                    <label className="ml-2 text-sm text-gray-400">I have my own car</label>
                  </div>

                  {formData.hasOwnCar && (
                    <>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="text"
                          name="carBrand"
                          value={formData.carBrand}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Car Brand"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="text"
                          name="carModel"
                          value={formData.carModel}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Car Model"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="text"
                          name="carLicensePlate"
                          value={formData.carLicensePlate}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Car License Plate"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="file"
                          name="carImg" // Changed to match backend
                          onChange={handleChange}
                          accept="image/*"
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-lime-400 file:text-gray-900 hover:file:bg-lime-300"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="number"
                          name="capacity"
                          value={formData.capacity}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Capacity (Number of Seats)"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="number"
                          name="baseRate" // Changed to match Car model
                          value={formData.baseRate}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Base Rate"
                          required
                        />
                      </div>

                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Car className="h-5 w-5 text-lime-400" />
                        </div>
                        <input
                          type="number"
                          name="driverRate"
                          value={formData.driverRate}
                          onChange={handleChange}
                          className="pl-10 w-full px-4 py-2 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-lime-400 focus:ring-1 focus:ring-lime-400 text-sm sm:text-base"
                          placeholder="Driver Rate (per hour)"
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="w-1/2 flex items-center justify-center bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors duration-300 text-sm sm:text-base"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" /> Previous
                    </button>
                    <button
                      type="submit"
                      className="w-1/2 bg-lime-400 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-lime-300 transition-colors duration-300 hover:drop-shadow-[0_0_12px_rgba(163,230,53,0.8)] text-sm sm:text-base"
                    >
                      Submit
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>

          <div className="hidden lg:block w-1/2 relative">
            <div className="absolute inset-0">
              <img
                src="/src/assets/Driver/driver-hire-min.webp"
                alt="Driver with car"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-transparent to-transparent" />
            </div>
            <div className="relative p-12 text-white">
              <div className="border-l-2 border-lime-400 pl-4 mt-64">
                <div className="text-3xl font-bold">Join Our Fleet</div>
                <div className="text-gray-300 mt-2">Become part of our growing team of professional drivers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRegister;