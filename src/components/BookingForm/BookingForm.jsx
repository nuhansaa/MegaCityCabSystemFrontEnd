import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadScript, Autocomplete, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
  CarIcon,
  CalendarIcon,
  MapPinIcon,
  CheckIcon,
} from 'lucide-react';
import toast from 'react-hot-toast';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const GOOGLE_MAPS_API_KEY = "AIzaSyAe8qybKlyLJc7fAC3s-0NwUApOPYRILCs";
const libraries = ["places"];

const COLOMBO_BOUNDS = {
  north: 6.98,
  south: 6.85,
  east: 79.92,
  west: 79.82,
};

const getDistance = (coords1, coords2) => {
  const R = 6371;
  const dLat = (coords2[0] - coords1[0]) * Math.PI / 180;
  const dLon = (coords2[1] - coords1[1]) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1[0] * Math.PI / 180) * Math.cos(coords2[0] * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const getSriLankanTime = () => {
  const now = new Date();
  const offset = 5.5 * 60;
  return new Date(now.getTime() + offset * 60 * 1000);
};

const getSriLankanTimeFormatted = () => {
  const sriLankanTime = getSriLankanTime();
  const hours = sriLankanTime.getUTCHours().toString().padStart(2, "0");
  const minutes = sriLankanTime.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const preselectedCar = location.state?.vehicle || null;
  const preservedBookingData = location.state?.bookingData || null;

  const [bookingData, setBookingData] = useState({
    customerId: localStorage.getItem('userId') || '',
    carId: preselectedCar?.id || '',
    pickupDate: preservedBookingData?.pickupDate || getSriLankanTime(),
    pickupTime: preservedBookingData?.pickupTime || {
      hours: getSriLankanTimeFormatted().split(":")[0],
      minutes: getSriLankanTimeFormatted().split(":")[1],
    },
    pickupLocation: preservedBookingData?.pickupLocation || 'Colombo City Center',
    dropLocation: preservedBookingData?.dropLocation || 'Bandaranaike Airport',
    driverRequired: preservedBookingData?.driverRequired || false,
    pickupCoords: [6.9271, 79.8612], // Default Colombo City Center
    dropCoords: [7.1806, 79.8846],   // Default Bandaranaike Airport
  });
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(preselectedCar);
  const [step, setStep] = useState(preselectedCar ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fare, setFare] = useState({
    baseFare: 1500, // 5 USD * 300
    distanceFare: 0,
    tax: 750, // 2.5 USD * 300
    total: 0,
    distance: 0,
  });
  const [directions, setDirections] = useState(null);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const mapRef = useRef(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (bookingData.pickupCoords && bookingData.dropCoords && window.google?.maps) {
      const distance = getDistance(bookingData.pickupCoords, bookingData.dropCoords);
      setFare((prev) => ({
        ...prev,
        distance,
        distanceFare: distance * 1.5 * 300, // 1.5 USD per km * 300 = 450 LKR per km
        total: prev.baseFare + distance * 1.5 * 300 + prev.tax + (bookingData.driverRequired ? 9000 : 0),
      }));

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: { lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] },
          destination: { lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] },
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error(`Directions request failed due to ${status}`);
            setError("Failed to load route. Please try again.");
          }
        }
      );
    }
  }, [bookingData.pickupCoords, bookingData.dropCoords, bookingData.driverRequired]);

  const onPlaceChanged = (type) => {
    const autocomplete = type === "pickup" ? pickupAutocomplete : dropoffAutocomplete;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        const coords = [place.geometry.location.lat(), place.geometry.location.lng()];
        if (type === "pickup") {
          setBookingData((prev) => ({
            ...prev,
            pickupLocation: place.formatted_address || place.name,
            pickupCoords: coords,
          }));
        } else {
          setBookingData((prev) => ({
            ...prev,
            dropLocation: place.formatted_address || place.name,
            dropCoords: coords,
          }));
        }
      } else {
        setError("Please select a valid location from the suggestions.");
      }
    }
  };

  const handleSubmit = async () => {
    if (!bookingData.pickupDate || !bookingData.pickupTime.hours || !bookingData.pickupTime.minutes) {
      setError("Please select both a pickup date and time.");
      return;
    }

    setLoading(true);
    setError('');

    const pickupDateTime = new Date(bookingData.pickupDate);
    pickupDateTime.setUTCHours(parseInt(bookingData.pickupTime.hours), parseInt(bookingData.pickupTime.minutes));

    const bookingPayload = {
      customerId: bookingData.customerId,
      carId: bookingData.carId,
      pickupDate: pickupDateTime.toISOString().slice(0, 10),
      pickupTime: `${bookingData.pickupTime.hours}:${bookingData.pickupTime.minutes}`,
      pickupLocation: bookingData.pickupLocation,
      dropLocation: bookingData.dropLocation,
      totalAmount: fare.total,
      driverRequired: bookingData.driverRequired,
      distance: fare.distance,
      status: 'PENDING',
    };

    try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        throw new Error("No authentication token found. Please log in again.");
      }

      const response = await fetch('http://localhost:8080/auth/bookings/createbooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Authentication failed. Please log in again.");
        } else {
          const errorText = await response.text();
          throw new Error(errorText || "Booking failed");
        }
      }

      setIsConfirmed(true);
      setStep(3);
      toast.success("Booking Successful! Your ride has been confirmed.");
    } catch (error) {
      setError(`Booking failed: ${error.message}`);
      console.error("Booking error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVehicle = () => {
    navigate('/cabs', {
      state: {
        bookingData: bookingData,
        fromBooking: true,
      },
    });
  };

  const renderBookingDetails = () => (
    <div className="mb-12">
      <h3 className="text-2xl font-bold text-lime-400 mb-6">Complete Your Booking</h3>
      {error && (
        <div className="mb-4 p-3 bg-red-900/50 text-red-200 rounded-lg">{error}</div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg mb-6 border border-lime-500/30">
            <h4 className="font-bold text-lg mb-4 text-lime-400">Trip Details</h4>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Location</label>
                <Autocomplete
                  onLoad={(autocomplete) => setPickupAutocomplete(autocomplete)}
                  onPlaceChanged={() => onPlaceChanged("pickup")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-lime-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter pickup location"
                  />
                </Autocomplete>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Drop-off Location</label>
                <Autocomplete
                  onLoad={(autocomplete) => setDropoffAutocomplete(autocomplete)}
                  onPlaceChanged={() => onPlaceChanged("dropoff")}
                  options={{
                    bounds: COLOMBO_BOUNDS,
                    strictBounds: false,
                    types: ["geocode"],
                    componentRestrictions: { country: "lk" },
                  }}
                >
                  <input
                    type="text"
                    value={bookingData.dropLocation}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, dropLocation: e.target.value }))}
                    className="w-full p-3 bg-gray-700 border border-lime-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    placeholder="Enter drop-off location"
                  />
                </Autocomplete>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Date (Sri Lanka Time)</label>
                  <DatePicker
                    selected={bookingData.pickupDate}
                    onChange={(date) => setBookingData((prev) => ({ ...prev, pickupDate: date }))}
                    dateFormat="yyyy-MM-dd"
                    minDate={getSriLankanTime()}
                    className="w-full p-3 bg-gray-700 border border-lime-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pickup Time (Sri Lanka Time)</label>
                  <div className="flex space-x-2">
                    <select
                      value={bookingData.pickupTime.hours}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          pickupTime: { ...prev.pickupTime, hours: e.target.value },
                        }))
                      }
                      className="w-full p-3 bg-gray-700 border border-lime-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      {Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0")).map((hour) => (
                        <option key={hour} value={hour}>{hour}</option>
                      ))}
                    </select>
                    <select
                      value={bookingData.pickupTime.minutes}
                      onChange={(e) =>
                        setBookingData((prev) => ({
                          ...prev,
                          pickupTime: { ...prev.pickupTime, minutes: e.target.value },
                        }))
                      }
                      className="w-full p-3 bg-gray-700 border border-lime-500/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                    >
                      {Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0")).map((minute) => (
                        <option key={minute} value={minute}>{minute}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="driverRequired"
                  checked={bookingData.driverRequired}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, driverRequired: e.target.checked }))}
                  className="h-5 w-5 text-lime-500 focus:ring-lime-500 border-gray-500 rounded"
                />
                <label htmlFor="driverRequired" className="ml-2 text-sm text-gray-300">
                  I need a driver (additional LKR 500 fee)
                </label>
              </div>
            </div>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-lime-500/30">
            <h4 className="font-bold text-lg mb-4 text-lime-400">Route Preview</h4>
            <GoogleMap
              mapContainerClassName="h-72 w-full rounded-lg shadow-md"
              center={{ lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] }}
              zoom={10}
              onLoad={(map) => (mapRef.current = map)}
              options={{
                styles: [
                  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                ],
              }}
            >
              {directions && <DirectionsRenderer directions={directions} options={{ 
                polylineOptions: { 
                  strokeColor: "#a3e635", 
                  strokeWeight: 5 
                } 
              }} />}
            </GoogleMap>
          </div>
        </div>
        <div>
          <div className="bg-gray-800 p-6 rounded-xl shadow-lg sticky top-6 border border-lime-500/30">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-lg text-lime-400">Booking Summary</h4>
              <button
                onClick={handleChangeVehicle}
                className="text-sm text-lime-500 hover:text-lime-600 font-medium"
              >
                Change Vehicle
              </button>
            </div>
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <div className="bg-lime-500 p-2 rounded">
                  <CarIcon className="h-5 w-5 text-gray-900" />
                </div>
                <span className="ml-2 font-medium text-gray-300">
                  {selectedCar?.brand} {selectedCar?.model}
                </span>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <div className="text-sm text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>Car Type:</span>
                    <span className="font-medium">{selectedCar?.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Seats:</span>
                    <span className="font-medium">{selectedCar?.seats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Distance:</span>
                    <span className="font-medium">{fare.distance.toFixed(2)} km</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-4 mt-6">
              <h5 className="font-medium text-gray-300 mb-3">Fare Breakdown</h5>
              <div className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>LKR {fare.baseFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Distance Fare ({fare.distance.toFixed(2)} km)</span>
                  <span>LKR {fare.distanceFare.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>LKR {fare.tax.toFixed(2)}</span>
                </div>
                {bookingData.driverRequired && (
                  <div className="flex justify-between">
                    <span>Driver Fee</span>
                    <span>LKR 9000.00</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-700">
                  <span>Total</span>
                  <span className="text-lime-500">LKR {fare.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full px-4 py-3 bg-lime-500 text-gray-900 font-bold rounded-lg transition shadow-lg ${
                  loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-lime-600'
                }`}
              >
                {loading ? 'Processing...' : 'Confirm Booking'}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              By confirming, you agree to our terms of service and cancellation policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-24 h-24 bg-lime-500 rounded-full mb-6">
        <CheckIcon className="h-12 w-12 text-gray-900" />
      </div>
      <h3 className="text-3xl font-bold text-lime-400 mb-4">Booking Confirmed!</h3>
      <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
        Your booking has been successfully processed. A confirmation has been sent to your email.
      </p>
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-lg mx-auto mb-8 border border-lime-500/30">
        <h4 className="font-bold text-lg mb-4 text-lime-400">Booking Details</h4>
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Vehicle</p>
            <p className="font-medium">{selectedCar?.brand} {selectedCar?.model}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium">
              {bookingData.pickupDate.toLocaleDateString("en-US", { timeZone: "Asia/Colombo" })} {bookingData.pickupTime.hours}:{bookingData.pickupTime.minutes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pickup</p>
            <p className="font-medium">{bookingData.pickupLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Drop-off</p>
            <p className="font-medium">{bookingData.dropLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Driver</p>
            <p className="font-medium">{bookingData.driverRequired ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Distance</p>
            <p className="font-medium">{fare.distance.toFixed(2)} km</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="font-medium text-lime-500">LKR {fare.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-4">
        <button
          className="px-6 py-3 bg-gray-800 text-lime-400 font-medium rounded-lg hover:bg-gray-700 transition shadow-lg border border-lime-500/30"
          onClick={() => navigate('/bookings')}
        >
          View My Bookings
        </button>
        <button
          className="px-6 py-3 bg-lime-500 text-gray-900 font-medium rounded-lg hover:bg-lime-600 transition shadow-lg"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1:
        return renderVehicleSelection();
      case 2:
        return renderBookingDetails();
      case 3:
        return renderConfirmation();
      default:
        return renderVehicleSelection();
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={GOOGLE_MAPS_API_KEY}
      libraries={libraries}
      loadingElement={<div className="text-center py-10 text-lime-400">Loading Google Maps...</div>}
      onError={() => setError("Failed to load Google Maps. Please check your network or disable ad blockers.")}
    >
      <div className="min-h-screen bg-gray-900 text-lime-400">
        <Navbar />
        
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <p className="text-lime-300 text-lg">Colombo's Premier Cab Service</p>
            <div className="h-1 w-24 bg-lime-400 my-4"></div>
            <h2 className="text-2xl">Complete Your Booking</h2>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8 pb-20">
          <div className="max-w-5xl mx-auto">{renderStep()}</div>
        </div>
        <Footer />
      </div>
    </LoadScript>
  );
};

export default Booking;