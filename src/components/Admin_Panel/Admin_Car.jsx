import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const CarDashboard = () => {
  const [cars, setCars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentCar, setCurrentCar] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    carBrand: '',
    carModel: '',
    carLicensePlate: '',
    capacity: 4,
    baseRate: 0,
    driverRate: 0,
    categoryId: '',
    carImg: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/all/viewCars`);
      setCars(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch cars. Please try again later.');
      console.error('Error fetching cars:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: e.target.files[0] });
    } else if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAddNew = () => {
    setFormData({
      carBrand: '',
      carModel: '',
      carLicensePlate: '',
      capacity: 4,
      baseRate: 0,
      driverRate: 0,
      categoryId: '',
      carImg: null
    });
    setIsEditing(false);
    setShowForm(true);
  };

  const handleEdit = (car) => {
    setFormData({
      carBrand: car.carBrand,
      carModel: car.carModel,
      carLicensePlate: car.carLicensePlate,
      capacity: car.capacity,
      baseRate: car.baseRate || 0,
      driverRate: car.driverRate || 0,
      categoryId: car.categoryId || '',
    });
    setCurrentCar(car);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      if (isEditing) {
        const updateData = {
          carBrand: formData.carBrand,
          carModel: formData.carModel,
          carLicensePlate: formData.carLicensePlate,
          capacity: formData.capacity,
          baseRate: formData.baseRate,
          driverRate: formData.driverRate,
          categoryId: formData.categoryId,
          carImgUrl: currentCar.carImgUrl,
          available: currentCar.available,
          assignedDriverId: currentCar.assignedDriverId
        };
        
        const response = await axios.put(
          `${API_BASE_URL}/auth/cars/updateCar/${currentCar.carId}`, 
          updateData
        );
        setCars(cars.map(car => car.carId === currentCar.carId ? response.data : car));
      } else {
        const formDataObj = new FormData();
        formDataObj.append('carBrand', formData.carBrand);
        formDataObj.append('carModel', formData.carModel);
        formDataObj.append('carLicensePlate', formData.carLicensePlate);
        formDataObj.append('capacity', formData.capacity);
        formDataObj.append('carImg', formData.carImg);
        
        const response = await axios.post(
          `${API_BASE_URL}/auth/cars/createCar`, 
          formDataObj
        );
        setCars([...cars, response.data]);
      }
      setShowForm(false);
      setFormData({
        carBrand: '',
        carModel: '',
        carLicensePlate: '',
        capacity: 4,
        baseRate: 0,
        driverRate: 0,
        categoryId: '',
        carImg: null
      });
      setIsEditing(false);
    } catch (err) {
      setError(isEditing ? 'Failed to update car.' : 'Failed to create car.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      setLoading(true);
      try {
        await axios.delete(`${API_BASE_URL}/auth/cars/${carId}`);
        setCars(cars.filter(car => car.carId !== carId));
        setError(null);
      } catch (err) {
        setError('Failed to delete car.');
        console.error('Error deleting car:', err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      carBrand: '',
      carModel: '',
      carLicensePlate: '',
      capacity: 4,
      baseRate: 0,
      driverRate: 0,
      categoryId: '',
      carImg: null
    });
    setIsEditing(false);
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Car Management</h1>
          <button
            onClick={handleAddNew}
            className="bg-lime-500 text-white px-4 py-2 rounded-lg hover:bg-lime-700 disabled:bg-lime-400"
            disabled={loading}
          >
            Add New Car
          </button>
        </header>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {isEditing ? 'Update Car' : 'Add New Car'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Brand</label>
                  <input
                    type="text"
                    name="carBrand"
                    value={formData.carBrand}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Car Model</label>
                  <input
                    type="text"
                    name="carModel"
                    value={formData.carModel}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">License Plate</label>
                  <input
                    type="text"
                    name="carLicensePlate"
                    value={formData.carLicensePlate}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    required
                    min="1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Base Rate</label>
                  <input
                    type="number"
                    name="baseRate"
                    value={formData.baseRate}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Driver Rate</label>
                  <input
                    type="number"
                    name="driverRate"
                    value={formData.driverRate}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category ID</label>
                  <input
                    type="text"
                    name="categoryId"
                    value={formData.categoryId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-500"
                  />
                </div>
                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Car Image</label>
                    <input
                      type="file"
                      name="carImg"
                      onChange={handleInputChange}
                      className="w-full py-2"
                      accept="image/*"
                      required={!isEditing}
                    />
                  </div>
                )}
              </div>
              <div className="mt-8 flex justify-end gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-700 disabled:bg-lime-400"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isEditing ? 'Update Car' : 'Add Car'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-white text-lime-500 border border-lime-500 rounded-lg hover:bg-lime-50 disabled:bg-gray-200"
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {!showForm && (
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Brand
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Model
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      License Plate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Capacity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {cars.length > 0 ? (
                    cars.map((car) => (
                      <tr key={car.carId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <img
                            src={car.carImgUrl}
                            alt={`${car.carBrand} ${car.carModel}`}
                            className="h-16 w-auto object-contain rounded-lg"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-lime-100 flex items-center justify-center text-lime-600 font-semibold">
                              {car.carBrand.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{car.carBrand}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {car.carModel}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {car.carLicensePlate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {car.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              car.available
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {car.available ? "Available" : "Assigned"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEdit(car)}
                            className="text-lime-500 hover:text-lime-800 mr-4 disabled:text-gray-400"
                            disabled={loading}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(car.carId)}
                            className="text-red-600 hover:text-red-800 disabled:text-gray-400"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                        {loading ? "Loading..." : "No cars available"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CarDashboard;