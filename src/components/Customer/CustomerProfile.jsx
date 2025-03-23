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
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon,
  IdCard as IdCardIcon,
} from "lucide-react";
import axios from "axios";
import { useAuth } from "../../util/AuthContex";

const CustomerProfile = () => {
  const { user, logout } = useAuth();

  const [customer, setCustomer] = useState({
    customerId: "",
    customerName: "",
    customerAddress: "",
    customerNic: "",
    customerPhone: "",
    email: "",
    role: "CUSTOMER",
    joinedDate: "",
  });

  const [bookings, setBookings] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState({ ...customer });
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelBookingId, setCancelBookingId] = useState(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancellationReasonError, setCancellationReasonError] = useState(false);

  const API_BASE_URL = "http://localhost:8080/auth/customers";
  const BOOKINGS_API_URL = "http://localhost:8080/auth/bookings";
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        const customerId = user?.userId;

        if (!customerId || !token) {
          throw new Error("No customer ID or token found. Please log in again.");
        }

        const customerResponse = await axios.get(`${API_BASE_URL}/getCustomer/${customerId}`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          timeout: 5000,
        });

        const customerData = { ...customerResponse.data };
        setCustomer(customerData);
        setEditedCustomer(customerData);

        await fetchBookings();

        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching customer data:", err);
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          logout(); // Log out if token is invalid
        } else {
          setError(
            err.response?.data?.message || err.message || "Failed to load profile data. Please try again."
          );
        }
        setIsLoading(false);
      }
    };

    if (user && token) {
      fetchCustomerData();
    } else {
      setError("Please log in to view your profile.");
      setIsLoading(false);
    }
  }, [user, token, logout]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${BOOKINGS_API_URL}/getallcustomerbookings`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        timeout: 5000,
      });

      if (response.status === 200) {
        setBookings(response.data || []);
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
      const errorMessage =
        err.response?.status === 401
          ? "Unauthorized: Please log in again."
          : err.response?.data?.message || err.message || "Failed to load bookings. Please try again.";
      setError(errorMessage);
      if (err.response?.status === 401) logout();
      setBookings([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };

  const handleSaveProfile = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/updateCustomer/${customer.customerId}`,
        editedCustomer,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      setCustomer(response.data);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    }
  };

  const openCancelDialog = (bookingId) => {
    setCancelBookingId(bookingId);
    setCancellationReason("");
    setCancellationReasonError(false);
    setShowCancelDialog(true);
  };

  const closeCancelDialog = () => {
    setShowCancelDialog(false);
    setCancelBookingId(null);
    setCancellationReason("");
    setCancellationReasonError(false);
  };

  const submitCancellation = async () => {
    if (!cancellationReason.trim()) {
      setCancellationReasonError(true);
      return;
    }

    try {
      const response = await axios.post(
        `${BOOKINGS_API_URL}/${cancelBookingId}/cancel`,
        { reason: cancellationReason },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        await fetchBookings(); // Refresh the bookings list
        closeCancelDialog();
      } else {
        throw new Error("Failed to cancel booking.");
      }
    } catch (err) {
      console.error("Error cancelling booking:", err);
      setError(err.response?.data?.message || "Failed to cancel booking. Please try again.");
    }
  };

  const getFullName = () => {
    return customer.customerName || user?.username || "User";
  };

  const getInitial = () => {
    if (customer.customerName && customer.customerName.length > 0) {
      return customer.customerName.charAt(0).toUpperCase();
    }
    return user?.username
      ? user.username.charAt(0).toUpperCase()
      : customer.email
      ? customer.email.charAt(0).toUpperCase()
      : "U";
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

  const formatFare = (fare, isEstimate = false) => {
    if (!fare) return "";
    return isEstimate ? `Estimated $${fare.toFixed(2)}` : `$${fare.toFixed(2)}`;
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

            {activeTab === "profile" && (
              <div className="px-4 py-5 sm:p-6">
                {!isEditing ? (
                  <div>
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <MailIcon size={16} className="mr-2 text-lime-400" />
                          Email Address
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{customer.email}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <PhoneIcon size={16} className="mr-2 text-lime-400" />
                          Phone Number
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{customer.customerPhone}</dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <MapPinIcon size={16} className="mr-2 text-lime-400" />
                          Home Address
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{customer.customerAddress}</dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-400 flex items-center">
                          <UserIcon size={16} className="mr-2 text-lime-400" />
                          NIC Number
                        </dt>
                        <dd className="mt-1 text-lg text-lime-400">{customer.customerNic}</dd>
                      </div>
                    </dl>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 bg-lime-400 text-gray-900 rounded-md font-medium flex items-center"
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-6">
                        <label htmlFor="customerName" className="block text-sm font-medium text-gray-400">
                          Full Name
                        </label>
                        <div className="mt-1">
                          <input
                            type="text"
                            name="customerName"
                            id="customerName"
                            value={editedCustomer.customerName || ""}
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
                            value={editedCustomer.email || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full pl-10 p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="customerPhone" className="block text-sm font-medium text-gray-400">
                          Phone number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="customerPhone"
                            id="customerPhone"
                            value={editedCustomer.customerPhone || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full pl-10 p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-6">
                        <label htmlFor="customerAddress" className="block text-sm font-medium text-gray-400">
                          Home address
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MapPinIcon size={16} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="customerAddress"
                            id="customerAddress"
                            value={editedCustomer.customerAddress || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full pl-10 p-2.5"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-3">
                        <label htmlFor="customerNic" className="block text-sm font-medium text-gray-400">
                          NIC Number
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="text"
                            name="customerNic"
                            id="customerNic"
                            value={editedCustomer.customerNic || ""}
                            onChange={handleInputChange}
                            className="bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 block w-full p-2.5"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedCustomer({ ...customer });
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
                                Driver: {booking.driverDetails?.driverName || "Not Assigned"} • {booking.carModel}
                              </div>
                            </div>
                            <div className="text-right flex flex-col items-end">
                              <div className="text-2xl font-bold text-lime-400 mb-2">{formatFare(booking.totalAmount, booking.status === 'PENDING')}</div>
                              {booking.status === 'PENDING' && (
                                <button 
                                  className="px-3 py-1 bg-red-600/80 text-white rounded-md text-sm flex items-center"
                                  onClick={() => openCancelDialog(booking.bookingId)}
                                >
                                  <TrashIcon size={16} className="mr-1" />
                                  Cancel
                                </button>
                              )}
                              {booking.status === 'CANCELLED' && booking.refundAmount && (
                                <div className="mt-2 text-sm text-green-600 flex items-center justify-end ml-auto">
                                  <DollarSign size={16} className="mr-1" />
                                  Refund: ${booking.refundAmount.toFixed(2)}
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

        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertCircleIcon className="text-red-500 mr-2" size={24} />
                <h3 className="text-xl font-bold text-white">Confirm Cancellation</h3>
              </div>
              <p className="mb-6 text-gray-300">Are you sure you want to cancel this booking? This action cannot be undone.</p>
              <div className="mb-4">
                <label htmlFor="cancellationReason" className="block text-sm font-medium text-gray-400 mb-1">
                  Please provide a reason for cancellation
                </label>
                <textarea
                  id="cancellationReason"
                  rows="3"
                  className={`w-full bg-gray-600 border border-gray-500 text-white rounded-lg focus:ring-lime-400 focus:border-lime-400 p-2.5 ${
                    cancellationReasonError ? "border-red-500" : "border-gray-500"
                  }`}
                  placeholder="Enter your reason here..."
                  value={cancellationReason}
                  onChange={(e) => {
                    setCancellationReason(e.target.value);
                    if (e.target.value.trim()) setCancellationReasonError(false);
                  }}
                ></textarea>
                {cancellationReasonError && (
                  <p className="mt-1 text-sm text-red-600">Please provide a cancellation reason</p>
                )}
              </div>
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">You will receive a 10% refund of your fare amount.</p>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button 
                  className="px-4 py-2 bg-gray-700 rounded-md text-white"
                  onClick={closeCancelDialog}
                >
                  Keep Booking
                </button>
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded-md"
                  onClick={submitCancellation}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerProfile;