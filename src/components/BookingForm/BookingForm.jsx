import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LoadScript, Autocomplete, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import toast from 'react-hot-toast';

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
  const preselectedCar = location.state?.selectedCar || null;
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
    pickupCoords: [6.9271, 79.8612],
    dropCoords: [7.1806, 79.8846],
  });
  
  const [availableCars, setAvailableCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(preselectedCar);
  const [step, setStep] = useState(preselectedCar ? 2 : 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fare, setFare] = useState({
    baseFare: 2000,
    distanceFare: 0,
    tax: 0,
    total: 0,
    distance: 0,
    ratePerKm: 35,
    driverFee: 0
  });
  const [directions, setDirections] = useState(null);
  const [pickupAutocomplete, setPickupAutocomplete] = useState(null);
  const [dropoffAutocomplete, setDropoffAutocomplete] = useState(null);
  const mapRef = useRef(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchAvailableCars = async () => {
      try {
        const response = await fetch('http://localhost:8080/all/viewCars');
        const data = await response.json();
        const availableCars = data
          .filter((car) => car.available === true)
          .map((car) => ({
            id: car.carId,
            brand: car.carBrand,
            model: car.carModel,
            type: car.carType || 'Car',
            seats: car.capacity,
            image: car.carImgUrl || 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2',
            hourlyRate: car.type === 'Luxury' ? 25 : car.type === 'Van' ? 20 : 15,
          }));
        setAvailableCars(availableCars);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setError('Unable to load available vehicles.');
      }
    };
    if (!preselectedCar) fetchAvailableCars();
  }, [preselectedCar]);

  useEffect(() => {
    if (bookingData.pickupCoords && bookingData.dropCoords && window.google?.maps) {
      const distance = getDistance(bookingData.pickupCoords, bookingData.dropCoords);
      const distanceFare = distance * fare.ratePerKm;
      const driverFee = bookingData.driverRequired ? 750 : 0;
      const subtotal = fare.baseFare + distanceFare + driverFee;
      const tax = subtotal * 0.3;
      
      setFare((prev) => ({
        ...prev,
        distance,
        distanceFare,
        driverFee,
        tax,
        total: subtotal + tax
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
            setError("Failed to load route.");
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
        setError("Please select a valid location.");
      }
    }
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setBookingData((prev) => ({
      ...prev,
      carId: car.id,
    }));
    setStep(2);
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
      if (!token) throw new Error("Please log in again.");

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
        }
        throw new Error("Booking failed");
      }
      
      setIsConfirmed(true);
      setStep(3);
      toast.success("Booking Successful!");
    } catch (error) {
      setError(`Booking failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeVehicle = () => {
    navigate('/ourfleet', {
      state: { bookingData, fromBooking: true },
    });
  };

  const renderVehicleSelection = () => (
    <div className="bg-gray-800 rounded-lg border-2 border-lime-400 overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-bold text-lime-400 flex items-center">
          <span className="mr-2">🚗</span> Choose Your Ride
        </h2>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableCars.map((car) => (
          <div
            key={car.id}
            className={`bg-gray-900 p-4 rounded border-2 ${
              selectedCar?.id === car.id ? 'border-lime-400' : 'border-gray-700'
            } cursor-pointer`}
            onClick={() => handleCarSelect(car)}
          >
            <img
              src={car.image}
              alt={`${car.brand} ${car.model}`}
              className="w-full h-40 object-cover rounded mb-3"
            />
            <div className="text-lime-400 font-bold">{car.brand} {car.model}</div>
            <div className="text-sm text-gray-400 flex space-x-4">
              <span>{car.type}</span>
              <span>{car.seats} seats</span>
            </div>
            <button
              className={`w-full mt-3 py-2 rounded text-sm font-bold ${
                selectedCar?.id === car.id
                  ? 'bg-lime-400 text-gray-900'
                  : 'bg-gray-700 text-lime-400'
              }`}
            >
              {selectedCar?.id === car.id ? 'SELECTED' : 'SELECT'}
            </button>
          </div>
        ))}
      </div>
      {error && <div className="p-6 text-red-400">{error}</div>}
    </div>
  );

  const renderBookingDetails = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-gray-800 rounded-lg border-2 border-lime-400 overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-lime-400 flex items-center">
            <span className="mr-2">🚗</span> Book Your Journey
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
                    <div className="w-3 h-3 bg-lime-400 rounded-full ring-4 ring-lime-400 ring-opacity-30"></div>
                  </div>
                  <input
                    type="text"
                    value={bookingData.dropLocation}
                    onChange={(e) => setBookingData((prev) => ({ ...prev, dropLocation: e.target.value }))}
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
                minDate={getSriLankanTime()}
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
                    onChange={(e) => setBookingData((prev) => ({ 
                      ...prev, 
                      driverRequired: e.target.checked 
                    }))}
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
              <div className="text-lime-400 font-bold">+ LKR 750</div>
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
              {directions && <DirectionsRenderer directions={directions} />}
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
              <span>LKR {fare.baseFare.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Distance ({fare.distance.toFixed(1)} km)</span>
              <span>LKR {fare.distanceFare.toFixed(2)}</span>
            </div>
            {bookingData.driverRequired && (
              <div className="flex justify-between border-b border-gray-700 pb-2">
                <span className="text-gray-400">Tour Guide</span>
                <span>LKR {fare.driverFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-b border-gray-700 pb-2">
              <span className="text-gray-400">Tax (30%)</span>
              <span>LKR {fare.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-3">
              <span className="text-xl font-bold">Total</span>
              <span className="text-xl font-bold text-lime-400">LKR {fare.total.toFixed(2)}</span>
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
              {bookingData.pickupDate.toLocaleDateString("en-US")} {bookingData.pickupTime.hours}:{bookingData.pickupTime.minutes}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Pickup</p>
            <p className="font-medium text-lime-400">{bookingData.pickupLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Drop-off</p>
            <p className="font-medium text-lime-400">{bookingData.dropLocation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Driver</p>
            <p className="font-medium text-lime-400">{bookingData.driverRequired ? 'Yes' : 'No'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Total</p>
            <p className="font-medium text-lime-400">LKR {fare.total.toFixed(2)}</p>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className="px-6 py-3 bg-gray-700 text-lime-400 font-bold rounded hover:bg-gray-600 transition"
          onClick={() => navigate('/bookings')}
        >
          View My Bookings
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
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={libraries}>
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
          {step === 1 && renderVehicleSelection()}
          {step === 2 && renderBookingDetails()}
          {step === 3 && renderConfirmation()}
          {error && <div className="mt-4 p-4 bg-red-900 text-red-400 rounded">{error}</div>}
        </div>
      </div>
    </LoadScript>
  );
};

export default Booking;