import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Cabs = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:8080/all/viewCars')
      .then(response => {
        const transformedData = response.data.map(car => ({
          id: car.carId,
          name: `${car.carBrand} ${car.carModel}`,
          year: new Date().getFullYear(),
          image: car.carImgUrl,
          passengers: car.capacity,
          luggage: 2,
          available: car.available,
          type: car.carModel.toLowerCase().includes('suv') ? 'suv' : 
                car.carModel.toLowerCase().includes('van') ? 'van' : 
                'car'
        }));
        setVehicles(transformedData);
        setFilteredVehicles(transformedData);
      })
      .catch(error => {
        console.error('There was an error fetching the car data!', error);
      });
  }, []);

  useEffect(() => {
    let filtered = vehicles;

    if (availabilityFilter !== 'all') {
      filtered = filtered.filter(vehicle => 
        availabilityFilter === 'available' ? vehicle.available : !vehicle.available
      );
    }

    if (vehicleTypeFilter !== 'all') {
      filtered = filtered.filter(vehicle => vehicle.type === vehicleTypeFilter);
    }

    setFilteredVehicles(filtered);
  }, [availabilityFilter, vehicleTypeFilter, vehicles]);

  const handleBooking = (vehicleId) => {
    const selectedVehicle = vehicles.find(v => v.id === vehicleId);
    navigate('/AuthLogin', { state: { vehicle: selectedVehicle } });
  };

  // SVG Icons
  const CarIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5H6.5C5.84 5 5.29 5.42 5.08 6.01L3 12V20C3 20.55 3.45 21 4 21H5C5.55 21 6 20.55 6 20V19H18V20C18 20.55 18.45 21 19 21H20C20.55 21 21 20.55 21 20V12L18.92 6.01ZM6.5 16C5.67 16 5 15.33 5 14.5S5.67 13 6.5 13C7.33 13 8 13.67 8 14.5S7.33 16 6.5 16ZM17.5 16C16.67 16 16 15.33 16 14.5S16.67 13 17.5 13C18.33 13 19 13.67 19 14.5S18.33 16 17.5 16ZM5 11L6.5 6.5H17.5L19 11H5Z" fill="#A0E337"/>
    </svg>
  );

  const PassengerIcon = () => (
    <svg className="spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 11C17.66 11 18.99 9.66 18.99 8C18.99 6.34 17.66 5 16 5C14.34 5 13 6.34 13 8C13 9.66 14.34 11 16 11ZM8 11C9.66 11 10.99 9.66 10.99 8C10.99 6.34 9.66 5 8 5C6.34 5 5 6.34 5 8C5 9.66 6.34 11 8 11ZM8 13C5.67 13 1 14.17 1 16.5V19H15V16.5C15 14.17 10.33 13 8 13ZM16 13C15.71 13 15.38 13.02 15.03 13.05C16.19 13.89 17 15.02 17 16.5V19H23V16.5C23 14.17 18.33 13 16 13Z" fill="#A0E337"/>
    </svg>
  );

  const LuggageIcon = () => (
    <svg className="spec-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17 6H7C5.9 6 5 6.9 5 8V16C5 17.1 5.9 18 7 18H17C18.1 18 19 17.1 19 16V8C19 6.9 18.1 6 17 6ZM17 16H7V8H17V16Z" fill="#A0E337"/>
      <path d="M9 9H15V15H9V9Z" fill="#A0E337"/>
    </svg>
  );

  const styles = {
    container: {
      width: '100%',
      margin: 0,
      padding: '20px',
      backgroundColor: '#121826',
      color: 'white',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      boxSizing: 'border-box',
    },
    appWrapper: {
      margin: 0,
      padding: 0,
      minHeight: '100vh',
      backgroundColor: '#121826',
    },
    header: {
      textAlign: 'center',
      padding: '40px 0',
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      marginBottom: '15px',
    },
    logoText: {
      color: '#a0e337',
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    tagline: {
      color: '#adbac7',
      fontSize: '1.2rem',
      marginBottom: '30px',
    },
    filters: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      marginBottom: '30px',
    },
    filterSelect: {
      padding: '10px',
      borderRadius: '5px',
      border: '1px solid #a0e337',
      backgroundColor: '#192234',
      color: 'white',
      fontSize: '1rem',
    },
    fleetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
      gap: '20px',
    },
    vehicleCard: {
      borderRadius: '10px',
      overflow: 'hidden',
      backgroundColor: '#192234',
      transition: 'transform 0.3s',
    },
    vehicleImage: {
      height: '200px',
      width: '100%',
      objectFit: 'cover',
    },
    vehicleDetails: {
      padding: '20px',
    },
    vehicleName: {
      fontSize: '1.4rem',
      fontWeight: 'bold',
      marginBottom: '5px',
    },
    vehicleYear: {
      color: '#adbac7',
      marginBottom: '15px',
    },
    vehicleSpecs: {
      display: 'flex',
      gap: '20px',
      marginBottom: '20px',
    },
    spec: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#adbac7',
    },
    bookButton: {
      display: 'block',
      width: '100%',
      padding: '15px',
      backgroundColor: '#a0e337',
      color: '#121826',
      border: 'none',
      borderRadius: '5px',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    bookButtonDisabled: {
      backgroundColor: '#555',
      color: '#999',
      cursor: 'not-allowed',
    },
    statusTag: {
      display: 'inline-block',
      padding: '5px 10px',
      borderRadius: '4px',
      fontSize: '0.8rem',
      fontWeight: 'bold',
      float: 'right',
    },
    available: {
      backgroundColor: '#238636',
    },
    unavailable: {
      backgroundColor: '#da3633',
    },
  };

  return (
    <div style={styles.appWrapper}>
      <Navbar />
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.logo}>
            <CarIcon />
            <span style={styles.logoText}>CABS</span>
          </div>
          <p style={styles.tagline}>Choose from our premium fleet of vehicles</p>
        </header>

        <div style={styles.filters}>
          <select
            style={styles.filterSelect}
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
          >
            <option value="all">All Availability</option>
            <option value="available">Available</option>
            <option value="unavailable">Unavailable</option>
          </select>

          <select
            style={styles.filterSelect}
            value={vehicleTypeFilter}
            onChange={(e) => setVehicleTypeFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="suv">SUV</option>
            <option value="car">Car</option>
            <option value="van">Van</option>
          </select>
        </div>

        <div style={styles.fleetGrid}>
          {filteredVehicles.map((vehicle) => (
            <div key={vehicle.id} style={styles.vehicleCard}>
              <img 
                src={vehicle.image} 
                alt={vehicle.name} 
                style={styles.vehicleImage}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/400x300?text=Vehicle+Image";
                }}
              />
              <div style={styles.vehicleDetails}>
                <div>
                  <span 
                    style={{
                      ...styles.statusTag,
                      ...(vehicle.available ? styles.available : styles.unavailable),
                    }}
                  >
                    {vehicle.available ? 'Available' : 'Unavailable'}
                  </span>
                  <h2 style={styles.vehicleName}>{vehicle.name}</h2>
                  <p style={styles.vehicleYear}>{vehicle.year}</p>
                </div>
                <div style={styles.vehicleSpecs}>
                  <div style={styles.spec}>
                    <PassengerIcon />
                    <span>{vehicle.passengers} Passengers</span>
                  </div>
                  <div style={styles.spec}>
                    <LuggageIcon />
                    <span>{vehicle.luggage} Luggage</span>
                  </div>
                </div>
                {/* <a href='/AuthLogin'> */}
                <button 
                  style={{
                    ...styles.bookButton,
                    ...(vehicle.available ? {} : styles.bookButtonDisabled),
                  }}
                  onClick={() => vehicle.available && handleBooking(vehicle.id)}
                  disabled={!vehicle.available}
                >
                  Book Now
                </button>
                {/* </a> */}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Cabs;