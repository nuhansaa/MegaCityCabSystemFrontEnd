import React, { useState, useEffect } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit,
  Save,
  X,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  DollarSign,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  MapPin as MapPinIcon,
  Trash as TrashIcon,
  AlertCircle as AlertCircleIcon,
  User as UserIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Save as SaveIcon,
  Car,
  Briefcase,
  Shield,
  CreditCard,
  Navigation,
  Star,
  Car as CarIcon,
  IdCard as IdCardIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../util/AuthContex";

const DriverProfile = () => {
  const { user, logout } = useAuth();

  const [driver, setDriver] = useState({
    driverId: "",
    driverName: "",
    email: "",
    driverVehicalLicense: "",
    driverPhone: "",
    hasOwnCar: false,
    carId: "",
    available: true,
    role: "DRIVER",
    carDetails: null
  });

  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDriver, setEditedDriver] = useState({ ...driver });
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const API_BASE_URL = "http://localhost:8080/auth/driver";
  const CARS_API_URL = "http://localhost:8080/auth/cars";
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setIsLoading(true);
        const driverId = user?.userId;

        if (!driverId || !token) {
          throw new Error("No driver ID or token found. Please log in again.");
        }

        // Fetch driver data
        const driverResponse = await axios.get(`${API_BASE_URL}/getdriver/${driverId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const driverData = driverResponse.data;
        
        // Fetch car details only if driver has a car
        if (driverData.hasOwnCar && driverData.carId) {
          try {
            const carResponse = await axios.get(`${CARS_API_URL}/${driverData.carId}`, {
              headers: {
                "Authorization": `Bearer ${token}`,
              },
            });
            driverData.carDetails = carResponse.data;
          } catch (carError) {
            console.error("Error fetching car details:", carError);
            driverData.carDetails = null;
          }
        } else {
          driverData.carDetails = null;
        }

        setDriver(driverData);
        setEditedDriver(driverData);
        await fetchBookings(driverId);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching driver data:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout();
        } else {
          setError(err.response?.data?.message || err.message || "Failed to load profile data.");
        }
        setIsLoading(false);
      }
    };

    if (user && token) {
      fetchDriverData();
    } else {
      setError("Please log in to view your profile.");
      setIsLoading(false);
    }
  }, [user, token, logout]);

  const fetchBookings = async (driverId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${driverId}/bookings`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const allBookings = response.data || [];
        const bookingsWithNames = allBookings.map(booking => ({
          ...booking,
          passengerName: booking.passengerName || "Unknown"
        }));
        setBookings(bookingsWithNames);
        
        const activeBooking = bookingsWithNames.find(
          booking => booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS'
        );
        setCurrentBooking(activeBooking || null);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.message || "Failed to load bookings.");
      setBookings([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDriver({ ...editedDriver, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updatedriver/${driver.driverId}`,
        editedDriver,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setDriver(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const toggleAvailability = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/${driver.driverId}/availability`,
        { availability: !driver.available }, // Changed from "available" to "availability"
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
  
      setDriver(prev => ({
        ...prev,
        available: response.data.available
      }));
    } catch (err) {
      console.error("Error updating availability:", err);
      setError(err.response?.data?.message || "Failed to update availability.");
    }
  };

  const openConfirmDialog = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowConfirmDialog(true);
  };

  const closeConfirmDialog = () => {
    setShowConfirmDialog(false);
    setSelectedBookingId(null);
  };

  const handleAcceptBooking = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/bookings/${selectedBookingId}/accept`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchBookings(driver.driverId);
        closeConfirmDialog();
      }
    } catch (err) {
      console.error("Error accepting booking:", err);
      setError(err.response?.data?.message || "Failed to accept booking.");
    }
  };

  const handleStartTrip = async (bookingId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/start`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchBookings(driver.driverId);
      }
    } catch (err) {
      console.error("Error starting trip:", err);
      setError(err.response?.data?.message || "Failed to start trip.");
    }
  };

  const handleCompleteTrip = async (bookingId) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/bookings/${bookingId}/complete`,
        {},
        {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchBookings(driver.driverId);
      }
    } catch (err) {
      console.error("Error completing trip:", err);
      setError(err.response?.data?.message || "Failed to complete trip.");
    }
  };

  const getFullName = () => {
    return driver.driverName || user?.username || "Driver";
  };

  const getInitial = () => {
    if (driver.driverName && driver.driverName.length > 0) {
      return driver.driverName.charAt(0).toUpperCase();
    }
    return user?.username
      ? user.username.charAt(0).toUpperCase()
      : driver.email
      ? driver.email.charAt(0).toUpperCase()
      : "D";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const formatTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFare = (fare) => {
    if (!fare) return "";
    return `$${fare.toFixed(2)}`;
  };

  const renderStars = (rating) => {
    if (!rating) return null;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={16} className="text-yellow-400 fill-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" size={16} className="text-yellow-400 fill-yellow-400" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} className="text-gray-400" />);
    }
    
    return stars;
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen text-lime-400">Loading profile...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-white">MEGACITY</span>
            <span className="text-lime-400"> CABS</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-300">{getFullName()}</span>
            <div className="w-10 h-10 rounded-full bg-lime-400 text-gray-900 flex items-center justify-center font-bold">
              {getInitial()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar Navigation */}
          <div className="md:w-1/4">
            <div className="bg-gray-800/50 rounded-lg p-4">
              <nav>
                <ul className="space-y-2">
                  <li>
                    <button
                      className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${
                        activeTab === "profile" ? "bg-lime-400 text-gray-900" : "hover:bg-gray-700 text-lime-400"
                      }`}
                      onClick={() => setActiveTab("profile")}
                    >
                      <UserIcon size={20} />
                      <span>Profile</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${
                        activeTab === "bookings" ? "bg-lime-400 text-gray-900" : "hover:bg-gray-700 text-lime-400"
                      }`}
                      onClick={() => setActiveTab("bookings")}
                    >
                      <CalendarIcon size={20} />
                      <span>My Bookings</span>
                    </button>
                  </li>
                  <li>
                    <button
                      className={`w-full text-left p-3 rounded-md flex items-center gap-3 ${
                        activeTab === "car" ? "bg-lime-400 text-gray-900" : "hover:bg-gray-700 text-lime-400"
                      }`}
                      onClick={() => setActiveTab("car")}
                    >
                      <CarIcon size={20} />
                      <span>Vehicle Details</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {/* Profile or Bookings Content */}
          <div className="md:w-3/4 bg-gray-800/50 rounded-lg p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-500/20 text-red-300 rounded-md flex items-center">
                <AlertTriangle size={20} className="mr-2" />
                {error}
              </div>
            )}

            {/* Current Booking Banner */}
            {currentBooking && (
              <div className="mb-6 bg-lime-400/20 border border-lime-400 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-lime-400">Current Trip</h3>
                    <div className="flex items-center text-white">
                      <Navigation size={16} className="mr-2" />
                      <span>{currentBooking.pickupLocation} → {currentBooking.destination}</span>
                    </div>
                    <div className="text-gray-300 text-sm mt-1">
                      Customer: {currentBooking.passengerName || "Unknown"} • {formatDate(currentBooking.pickupDate)} at {formatTime(currentBooking.pickupTime)}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {currentBooking.status === 'ACCEPTED' && (
                      <button 
                        className="px-3 py-1 bg-lime-400 text-gray-900 rounded-md font-medium"
                        onClick={() => handleStartTrip(currentBooking.bookingId)}
                      >
                        Start Trip
                      </button>
                    )}
                    {currentBooking.status === 'IN_PROGRESS' && (
                      <button 
                        className="px-3 py-1 bg-lime-400 text-gray-900 rounded-md font-medium"
                        onClick={() => handleCompleteTrip(currentBooking.bookingId)}
                      >
                        Complete Trip
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="px-4 py-5 sm:p-6">
                {!isEditing ? (
                  <div>
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-lime-400 text-gray-900 flex items-center justify-center font-bold text-2xl mr-4">
                        {getInitial()}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-lime-400">{driver.driverName}</h2>
                        {/* <div className="flex items-center">
                          {renderStars(driver.rating || 0)}
                          <span className="ml-2 text-gray-300">({(driver.rating || 0).toFixed(1)})</span>
                        </div> */}
                        <div className={`inline-flex px-2 py-0.5 rounded-full text-xs mt-1 ${
                          driver.available ? 'bg-green-100 text-green-800' : 'bg-gray-600 text-gray-300'
                        }`}>
                          {driver.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                        </div>
                      </div>
                    </div>

                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <MailIcon size={16} className="mr-2 text-lime-400" />
                          Email Address
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{driver.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <PhoneIcon size={16} className="mr-2 text-lime-400" />
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{driver.driverPhone}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <Shield size={16} className="mr-2 text-lime-400" />
                          Vehicle License
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{driver.driverVehicalLicense}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <CarIcon size={16} className="mr-2 text-lime-400" />
                          Vehicle Owned
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{driver.hasOwnCar ? "Yes" : "No"}</dd>
                      </div>
                    </dl>
                    <div className="mt-6 flex gap-3">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-lime-400 text-gray-900 rounded-md font-medium flex items-center"
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Profile
                      </button>
                      <button
                        type="button"
                        onClick={toggleAvailability}
                        className={`px-4 py-2 rounded-md font-medium flex items-center ${
                          driver.available 
                            ? 'bg-lime-600 text-white' 
                            : 'bg-gray-600 text-gray-300'
                        }`}
                      >
                        {driver.available ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="driverName" className="block text-sm font-medium text-gray-400">
                          Full Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="driverName"
                            id="driverName"
                            value={editedDriver.driverName || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-400">
                          Email address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MailIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="email"
                            name="email"
                            id="email"
                            value={editedDriver.email || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full pl-10 p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="driverPhone" className="block text-sm font-medium text-gray-400">
                          Phone number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="driverPhone"
                            id="driverPhone"
                            value={editedDriver.driverPhone || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full pl-10 p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="driverVehicalLicense" className="block text-sm font-medium text-gray-400">
                          Vehicle License
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="driverVehicalLicense"
                            id="driverVehicalLicense"
                            value={editedDriver.driverVehicalLicense || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3 flex items-center">
                        <input
                          type="checkbox"
                          name="hasOwnCar"
                          checked={editedDriver.hasOwnCar || false}
                          onChange={(e) => setEditedDriver({...editedDriver, hasOwnCar: e.target.checked})}
                          className="h-4 w-4 text-lime-400 focus:ring-lime-400 border-gray-500 rounded"
                        />
                        <label htmlFor="hasOwnCar" className="ml-2 block text-sm text-gray-400">
                          I have my own car
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedDriver({ ...driver });
                        }}
                        className="px-4 py-2 bg-gray-600 rounded-md text-white"
                      >
                        <X size={18} className="mr-2" />
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveProfile}
                        className="px-4 py-2 bg-lime-400 text-gray-900 rounded-md font-medium flex items-center"
                      >
                        <SaveIcon size={18} className="mr-2" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "car" && (
              <div className="px-4 py-5 sm:p-6">
                {driver.hasOwnCar ? (
                  driver.carDetails ? (
                    <div>
                      <div className="flex items-center mb-6">
                        {driver.carDetails.carImgUrl ? (
                          <img 
                            src={driver.carDetails.carImgUrl} 
                            alt="Car" 
                            className="w-16 h-16 object-cover rounded-md mr-4"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-full bg-gray-700 text-lime-400 flex items-center justify-center mr-4">
                            <Car size={32} />
                          </div>
                        )}
                        <div>
                          <h2 className="text-2xl font-bold text-lime-400">
                            {driver.carDetails.carModel || "Vehicle Details"}
                          </h2>
                          <div className="text-gray-300">
                            {driver.carDetails.carLicensePlate || "No license plate"}
                          </div>
                        </div>
                      </div>

                      <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-400 flex items-center">
                            <CarIcon size={16} className="mr-2 text-lime-400" />
                            Car Model
                          </dt>
                          <dd className="mt-1 text-lg text-lime-400">
                            {driver.carDetails.carModel || "N/A"}
                          </dd>
                        </div>
                        <div className="sm:col-span-1">
                          <dt className="text-sm font-medium text-gray-400 flex items-center">
                            <IdCardIcon size={16} className="mr-2 text-lime-400" />
                            License Plate
                          </dt>
                          <dd className="mt-1 text-lg text-lime-400">
                            {driver.carDetails.carLicensePlate || "N/A"}
                          </dd>
                        </div>
                        {driver.carDetails.capacity && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-400 flex items-center">
                              <Briefcase size={16} className="mr-2 text-lime-400" />
                              Capacity
                            </dt>
                            <dd className="mt-1 text-lg text-lime-400">
                              {driver.carDetails.capacity} passengers
                            </dd>
                          </div>
                        )}
                        {driver.carDetails.baseRate && (
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-400 flex items-center">
                              <DollarSign size={16} className="mr-2 text-lime-400" />
                              Base Rate
                            </dt>
                            <dd className="mt-1 text-lg text-lime-400">
                              ${driver.carDetails.baseRate.toFixed(2)}
                            </dd>
                          </div>
                        )}
                      </dl>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CarIcon size={48} className="mx-auto text-gray-500 mb-4" />
                      <h3 className="text-lg font-medium text-gray-400">Vehicle details not available</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        We couldn't load your vehicle details.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <CarIcon size={48} className="mx-auto text-gray-500 mb-4" />
                    <h3 className="text-lg font-medium text-gray-400">No vehicle registered</h3>
                    <p className="mt-1 text-sm text-gray-500">You haven't registered a vehicle yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "bookings" && (
              <div className="px-4 py-5 sm:p-6">
                <div className="overflow-hidden">
                  {bookings.length > 0 ? (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.bookingId}
                          className="bg-gray-700/50 rounded-lg p-6"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <div className={`inline-flex px-3 py-1 rounded-full text-sm mb-4 ${
                                booking.status === 'COMPLETED' ? 'bg-lime-400 text-gray-900' : 
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                                booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-600 text-lime-400'
                              }`}>
                                {booking.status === 'COMPLETED' ? (
                                  <CheckCircle size={14} className="mr-1" />
                                ) : booking.status === 'PENDING' ? (
                                  <Clock size={14} className="mr-1" />
                                ) : booking.status === 'CANCELLED' ? (
                                  <AlertTriangle size={14} className="mr-1" />
                                ) : (
                                  <Clock size={14} className="mr-1" />
                                )}
                                {booking.status}
                              </div>
                              <div className="flex items-center mb-2">
                                <CalendarIcon size={16} className="mr-2 text-lime-400" />
                                <span className="text-white mr-4">{formatDate(booking.pickupDate)}</span>
                                <ClockIcon size={16} className="mr-2 text-lime-400" />
                                <span className="text-white">{formatTime(booking.pickupTime)}</span>
                              </div>
                              <div className="flex items-center mb-2 text-lime-400">
                                <div className="w-2 h-2 rounded-full bg-lime-400 mr-2"></div>
                                <span>{booking.pickupLocation}</span>
                              </div>
                              <div className="flex items-center mb-4 text-lime-400">
                                <MapPinIcon size={16} className="mr-2" />
                                <span>{booking.destination}</span>
                              </div>
                              <div className="text-gray-300 text-sm">
                                Customer: {booking.passengerName || "Unknown"} • {booking.passengerCount} passengers
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="text-2xl font-bold text-lime-400 mb-2">{formatFare(booking.totalAmount)}</div>
                              {booking.status === 'PENDING' && (
                                <button 
                                  className="px-3 py-1 bg-lime-400 text-gray-900 rounded-md font-medium"
                                  onClick={() => openConfirmDialog(booking.bookingId)}
                                >
                                  Accept Booking
                                </button>
                              )}
                              {(booking.status === 'ACCEPTED' || booking.status === 'IN_PROGRESS') && (
                                <div className="flex gap-2">
                                  <button 
                                    className="px-3 py-1 bg-blue-600 text-white rounded-md font-medium"
                                    onClick={() => booking.status === 'ACCEPTED' ? 
                                      handleStartTrip(booking.bookingId) : 
                                      handleCompleteTrip(booking.bookingId)}
                                  >
                                    {booking.status === 'ACCEPTED' ? 'Start Trip' : 'Complete Trip'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gray-700/50 rounded-lg p-6 text-center">
                      <p className="text-gray-300">No bookings found.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Booking Dialog */}
        {showConfirmDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertCircleIcon className="text-lime-400 mr-2" size={24} />
                <h3 className="text-xl font-bold text-white">Confirm Booking</h3>
              </div>
              <p className="mb-6 text-gray-300">Are you sure you want to accept this booking?</p>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-gray-700 rounded-md text-white"
                  onClick={closeConfirmDialog}
                >
                  Decline
                </button>
                <button 
                  className="px-4 py-2 bg-lime-400 text-gray-900 rounded-md font-medium"
                  onClick={handleAcceptBooking}
                >
                  Accept Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DriverProfile;