import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LoadScript,
  Autocomplete,
  GoogleMap,
  Marker,
  Polyline,
} from "@react-google-maps/api";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import toast from "react-hot-toast";
import { useAuth } from "../../util/AuthContex"; // Adjust the import path

const GOOGLE_MAPS_API_KEY = "AIzaSyCepX7Q1pxRlBbIKrpS-3LwcPxflCiE1Zs";
const libraries = ["places"];

const COLOMBO_BOUNDS = {
  north: 6.98,
  south: 6.85,
  east: 79.92,
  west: 79.82,
};

const formatCurrency = (value) => {
  if (typeof value !== "number") return "0.00";
  return value.toFixed(2);
};

const getDistance = (coords1, coords2) => {
  const R = 6371;
  const dLat = (coords2[0] - coords1[0]) * (Math.PI / 180);
  const dLon = (coords2[1] - coords1[1]) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(coords1[0] * (Math.PI / 180)) *
      Math.cos(coords2[0] * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
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
  const { user } = useAuth(); // Use the AuthContext
  const preselectedCar = location.state?.vehicle || null; // Changed from selectedCar to vehicle to match Cabs
  const preservedBookingData = location.state?.bookingData || null;

  const [bookingData, setBookingData] = useState({
    customerId: user?.userId || "",
    carId: preselectedCar?.id || "",
    pickupDate: preservedBookingData?.pickupDate || getSriLankanTime(),
    pickupTime: preservedBookingData?.pickupTime || {
      hours: getSriLankanTimeFormatted().split(":")[0],
      minutes: getSriLankanTimeFormatted().split(":")[1],
    },
    pickupLocation: preservedBookingData?.pickupLocation || "Colombo City Center",
    destination: preservedBookingData?.destination || "Bandaranaike Airport",
    driverRequired: preservedBookingData?.driverRequired || false,
    pickupCoords: [6.9271, 79.8612],
    dropCoords: [7.1806, 79.8846],
    driverAssignmentMessage: "",
  });

  const [selectedCar, setSelectedCar] = useState(preselectedCar);
  const [step, setStep] = useState(2); // Start directly at step 2
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fare, setFare] = useState({
    baseFare: preselectedCar?.baseRate || 1500, // Assume baseRate is passed or default to 1500
    distanceFare: 0,
    tax: 25,
    driverFee: preservedBookingData?.driverRequired ? 500 : 0,
    total: 0,
    distance: 0,
  });
  const [routePath, setRoutePath] = useState([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [bookingResponse, setBookingResponse] = useState(null);
  const mapRef = useRef(null);

  useEffect(() => {
    if (!preselectedCar) {
      setError("No vehicle selected. Please select a vehicle from the fleet.");
      navigate("/Cabs"); // Redirect to Cabs page if no car is selected
    } else {
      setSelectedCar({
        id: preselectedCar.id,
        brand: preselectedCar.name.split(" ")[0], // Extract brand from name
        model: preselectedCar.name.split(" ").slice(1).join(" "), // Extract model
        type: preselectedCar.type === "suv" || preselectedCar.type === "van" ? "car" : "Economy",
        seats: preselectedCar.passengers,
        image: preselectedCar.image || "https://via.placeholder.com/300",
        baseRate: preselectedCar.baseRate || 1500, // Assume baseRate or default
      });
    }
  }, [preselectedCar, navigate]);

  useEffect(() => {
    if (bookingData.pickupCoords && bookingData.dropCoords) {
      const distance = getDistance(bookingData.pickupCoords, bookingData.dropCoords);
      const distanceFareLKR = distance * 35;
      setFare((prev) => ({
        ...prev,
        distance: Number(distance.toFixed(2)),
        distanceFare: Number(distanceFareLKR.toFixed(2)),
        total: Number((prev.baseFare + distanceFareLKR + prev.tax + prev.driverFee).toFixed(2)),
      }));

      if (isMapLoaded && window.google?.maps) {
        fetchRouteWithRoutesAPI();
      }
    }
  }, [bookingData.pickupCoords, bookingData.dropCoords, bookingData.driverRequired, isMapLoaded]);

  const fetchRouteWithRoutesAPI = async () => {
    if (!window.google?.maps) return;

    try {
      const origin = { lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] };
      const destination = { lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] };

      const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
      const requestBody = {
        origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
        destination: { location: { latLng: { latitude: destination.lat, longitude: destination.lng } } },
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_AWARE",
        computeAlternativeRoutes: false,
        routeModifiers: { avoidTolls: false, avoidHighways: false, avoidFerries: false },
        languageCode: "en-US",
        units: "METRIC",
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
          "X-Goog-FieldMask": "routes.polyline,routes.duration,routes.distanceMeters",
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) throw new Error(`Routes API failed: ${response.status}`);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const encodedPolyline = data.routes[0].polyline.encodedPolyline;
        const pathPoints = decodePolyline(encodedPolyline);
        setRoutePath(pathPoints);
      } else {
        throw new Error("No routes returned from the API");
      }
    } catch (error) {
      setError("Failed to load route. Using direct path instead.");
      const startPoint = { lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] };
      const endPoint = { lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] };
      setRoutePath([startPoint, endPoint]);
    }
  };

  const decodePolyline = (encoded) => {
    if (!encoded) return [];
    const poly = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      poly.push({ lat: lat / 1e5, lng: lng / 1e5 });
    }
    return poly;
  };

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
            destination: place.formatted_address || place.name,
            dropCoords: coords,
          }));
        }
      } else {
        setError("Please select a valid location from the suggestions.");
      }
    }
  };

  const checkAuthenticationAndProceed = () => {
    if (!user) {
      navigate("/AuthLogin", {
        state: { from: "booking", bookingData, selectedCar, fare },
      });
      toast.error("Please log in to continue with your booking.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!bookingData.pickupDate || !bookingData.pickupTime.hours || !bookingData.pickupTime.minutes) {
      setError("Please select both a pickup date and time.");
      return;
    }

    if (!checkAuthenticationAndProceed()) return;

    setLoading(true);
    setError("");

    const pickupDateTime = new Date(bookingData.pickupDate);
    pickupDateTime.setUTCHours(
      parseInt(bookingData.pickupTime.hours),
      parseInt(bookingData.pickupTime.minutes)
    );

    const bookingPayload = {
      customerId: user.userId,
      carId: bookingData.carId,
      pickupDate: pickupDateTime.toISOString().slice(0, 10),
      pickupTime: `${bookingData.pickupTime.hours}:${bookingData.pickupTime.minutes}`,
      pickupLocation: bookingData.pickupLocation,
      destination: bookingData.destination,
      totalAmount: fare.total,
      driverRequired: bookingData.driverRequired,
      distance: fare.distance || 0,
      distanceFare: fare.distanceFare || 0,
      tax: fare.tax || 25,
      driverFee: fare.driverFee || 0,
      status: "PENDING",
    };

    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch("http://localhost:8080/auth/bookings/createbooking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Booking failed. Please try again.");
      }

      const responseData = await response.json();
      setBookingResponse(responseData);
      setBookingData((prev) => ({
        ...prev,
        driverAssignmentMessage: responseData.driverAssignmentMessage || "",
      }));
      setIsConfirmed(true);
      setStep(3);
      toast.success(
        "Booking Successful! Your ride has been confirmed." +
          (responseData.driverAssignmentMessage ? "\n" + responseData.driverAssignmentMessage : "")
      );
    } catch (error) {
      setError(`Booking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVehicle = () => {
    navigate("/ourfleet", {
      state: {
        bookingData: bookingData,
        fromBooking: true,
      },
    });
  };

  const renderBookingDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gray-800 rounded-lg border-2 border-lime-400 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-lime-400 flex items-center">
            <span className="mr-2"></span> Book Your Journey
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="uppercase text-xs tracking-wider text-gray-400 mb-2 block">Starting Point</label>
              <Autocomplete
                onLoad={(autocomplete) => setPickupAutocomplete(autocomplete)}
                onPlaceChanged={() => onPlaceChanged("pickup")}
                options={{ bounds: COLOMBO_BOUNDS, componentRestrictions: { country: "lk" } }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <div className="w-3 h-3 bg-lime-400 rounded-full"></div>
                  </div>
                  <input
                    type="text"
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, pickupLocation: e.target.value }))}
                    className="w-full py-3 px-10 bg-gray-900 border-2 border-gray-700 focus:border-lime-400 rounded text-white"
                  />
                </div>
              </Autocomplete>
            </div>
            <div>
              <label className="uppercase text-xs tracking-wider text-gray-400 mb-2 block">Destination</label>
              <Autocomplete
                onLoad={(autocomplete) => setDropoffAutocomplete(autocomplete)}
                onPlaceChanged={() => onPlaceChanged("dropoff")}
                options={{ bounds: COLOMBO_BOUNDS, componentRestrictions: { country: "lk" } }}
              >
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <div className="w-3 h-3 bg-lime-400 rounded-full "></div>
                  </div>
                  <input
                    type="text"
                    value={bookingData.destination}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, destination: e.target.value }))}
                    className="w-full py-3 px-10 bg-gray-900 border-2 border-gray-700 focus:border-lime-400 rounded text-white"
                  />
                </div>
              </Autocomplete>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="uppercase text-xs tracking-wider text-gray-400 mb-2 block">Journey Date</label>
              <DatePicker
                selected={bookingData.pickupDate}
                onChange={(date) => setBookingData((prev) => ({ ...prev, pickupDate: date }))}
                dateFormat="yyyy-MM-dd"
                minDate={new Date()}
                className="w-full py-3 px-4 bg-gray-900 border-2 border-gray-700 focus:border-lime-400 rounded text-white"
              />
            </div>
            <div>
              <label className="uppercase text-xs tracking-wider text-gray-400 mb-2 block">Departure Time</label>
              <div className="grid grid-cols-2 gap-4">
                <select
                  value={bookingData.pickupTime.hours}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      pickupTime: { ...prev.pickupTime, hours: e.target.value },
                    }))
                  }
                  className="w-full py-3 px-4 bg-gray-900 border-2 border-gray-700 focus:border-lime-400 rounded text-white"
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
                  className="w-full py-3 px-4 bg-gray-900 border-2 border-gray-700 focus:border-lime-400 rounded text-white"
                >
                  {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((min) => (
                    <option key={min} value={min}>{min}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-4 rounded border-2 border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <label className="relative inline-flex items-center mr-3 cursor-pointer">
                  <input
                    type="checkbox"
                    id="driverRequired"
                    checked={bookingData.driverRequired}
                    onChange={(e) => {
                      setBookingData((prev) => ({ 
                        ...prev, 
                        driverRequired: e.target.checked 
                      }));
                      setFare((prev) => ({
                        ...prev,
                        driverFee: e.target.checked ? 500 : 0,
                        total: e.target.checked
                          ? prev.baseFare + prev.distanceFare + prev.tax + 500
                          : prev.baseFare + prev.distanceFare + prev.tax,
                      }));
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-8 bg-gray-700 rounded-full peer-checked:bg-lime-400 transition-colors duration-200 ease-in-out"></div>
                  <div className="absolute left-1 top-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-6"></div>
                </label>
                <label 
                  htmlFor="driverRequired" 
                  className="text-lg cursor-pointer select-none"
                >
                  Request a personal driver
                </label>
              </div>
              <div className="text-lime-400 font-bold">+ LKR 500</div>
            </div>
            <p className="mt-2 text-sm text-gray-400">Includes local expertise and assistance</p>
          </div>
          <div className="bg-gray-800 rounded border-2 border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-700 flex justify-between items-center">
              <h3 className="font-bold text-lime-400">Journey Map</h3>
              <span className="text-sm text-gray-400">{fare.distance.toFixed(1)} km total distance</span>
            </div>
            <GoogleMap
              mapContainerClassName="h-52 w-full"
              center={{ lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] }}
              zoom={10}
              onLoad={(map) => (mapRef.current = map)}
            >
              <Marker
                position={{ lat: bookingData.pickupCoords[0], lng: bookingData.pickupCoords[1] }}
                label="A"
              />
              <Marker
                position={{ lat: bookingData.dropCoords[0], lng: bookingData.dropCoords[1] }}
                label="B"
              />
              {routePath.length > 0 && (
                <Polyline
                  path={routePath}
                  options={{ strokeColor: "#4285F4", strokeOpacity: 0.8, strokeWeight: 5, geodesic: true }}
                />
              )}
            </GoogleMap>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 rounded-lg border-2 border-lime-400 overflow-hidden h-fit">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-lime-400">Journey Summary</h2>
        </div>
        <div className="p-6">
          <div className="flex items-center p-4 bg-gray-900 rounded border-2 border-gray-700 mb-6">
            <div className="w-12 h-12 bg-lime-400 rounded-lg flex items-center justify-center text-gray-900 text-xl font-bold mr-4">
              {selectedCar?.type.slice(0, 3).toUpperCase()}
            </div>
            <div>
              <div className="text-lime-400 font-bold">{selectedCar?.brand} {selectedCar?.model}</div>
              <div className="text-sm text-gray-400 flex space-x-4">
                <span>{selectedCar?.seats} seats</span>
                <span>A/C</span>
              </div>
            </div>
          </div>
          <h3 className="text-lg font-bold text-lime-400 mb-4">Pricing Details</h3>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Base Rate</span>
              <span>LKR {formatCurrency(fare.baseFare)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Distance ({formatCurrency(fare.distance)} km)</span>
              <span>LKR {formatCurrency(fare.distanceFare)}</span>
            </div>
            {bookingData.driverRequired && (
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Driver Fee</span>
                <span>LKR {formatCurrency(fare.driverFee)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Tax</span>
              <span>LKR {formatCurrency(fare.tax)}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold text-lime-400">LKR {formatCurrency(fare.total)}</span>
            </div>
          </div>
          <button
            onClick={handleChangeVehicle}
            className="w-full py-2 bg-gray-700 text-lime-400 font-bold rounded text-sm mb-4 hover:bg-gray-600 transition"
          >
            Change Vehicle
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold rounded text-lg transition"
          >
            {loading ? 'Processing...' : 'BOOK NOW'}
          </button>
          <p className="text-center text-gray-500 text-xs mt-4">
            Free cancellation up to 24 hours before departure
          </p>
        </div>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="bg-gray-800 rounded-lg border-2 border-lime-400 p-6 text-center">
      <h2 className="text-2xl font-bold text-lime-400 mb-4">Booking Confirmed!</h2>
      <p className="text-gray-400 mb-6">Your booking has been successfully processed.</p>
      <div className="bg-gray-900 p-4 rounded border-2 border-gray-700 mb-6">
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-400">Vehicle</p>
            <p className="font-medium text-lime-400">{selectedCar?.brand} {selectedCar?.model}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Date & Time</p>
            <p className="font-medium text-lime-400">
              {bookingData.pickupDate.toLocaleDateString("en-US", {
                timeZone: "Asia/Colombo",
              })} {bookingData.pickupTime.hours}:{bookingData.pickupTime.minutes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pickup</p>
            <p className="font-medium text-lime-400">{bookingData.pickupLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Drop-off</p>
            <p className="font-medium text-lime-400">{bookingData.destination}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Driver</p>
            <p className="font-medium text-lime-400">{bookingData.driverRequired ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total</p>
            <p className="font-medium text-lime-400">LKR {formatCurrency(fare.total)}</p>
          </div>
        </div>
      </div>
      {bookingData.driverAssignmentMessage && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          {bookingData.driverAssignmentMessage}
        </div>
      )}
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-3 bg-gray-700 text-lime-400 font-bold rounded hover:bg-gray-600 transition"
          onClick={() => navigate('/customerProfile')}
        >
          View Profile
        </button>
        <button
          className="px-6 py-3 bg-lime-400 text-gray-900 font-bold rounded hover:bg-lime-500 transition"
          onClick={() => navigate('/')}
        >
          Return to Home
        </button>
      </div>
    </div>
  );

  return (
    <LoadScript 
      googleMapsApiKey={GOOGLE_MAPS_API_KEY} 
      libraries={libraries}
      onLoad={() => setIsMapLoaded(true)}
    >
      <div className="bg-gray-900 text-white min-h-screen font-sans">
        <div className="max-w-6xl mx-auto p-4">
          <header className="py-6 mb-8">
            <h1 className="text-center text-4xl font-black tracking-tighter">
              <span className="text-white italic">MEGA</span>
              <span className="text-white italic">CITY</span>
              <span className="text-lime-400 italic"> CABS</span>
            </h1>
            <p className="text-center text-gray-400 mt-2">Premium Sri Lankan Transportation</p>
          </header>
          {step === 2 && renderBookingDetails()}
          {step === 3 && renderConfirmation()}
          {error && <div className="mt-4 p-4 bg-red-900 text-red-400 rounded">{error}</div>}
        </div>
      </div>
    </LoadScript>
  );
};

export default Booking;