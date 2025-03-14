import React from 'react';
import { BarChart, LineChart, User, ShoppingCart, DollarSign, Activity } from 'lucide-react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  // Dummy data for charts and statistics
  const revenueData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 7000 },
    { name: 'May', value: 6000 },
    { name: 'Jun', value: 8000 },
  ];

  const userStats = [
    { title: 'Total Users', value: '12,345', icon: <User className="text-lime-400" />, change: '+12%' },
    { title: 'New Orders', value: '234', icon: <ShoppingCart className="text-lime-400" />, change: '+5%' },
    { title: 'Revenue', value: '$38,294', icon: <DollarSign className="text-lime-400" />, change: '+18%' },
    { title: 'Conversion', value: '6.8%', icon: <Activity className="text-lime-400" />, change: '+2%' },
  ];

  // Chart data and options
  const barChartData = {
    labels: revenueData.map(item => item.name),
    datasets: [{
      label: 'Revenue ($)',
      data: revenueData.map(item => item.value),
      backgroundColor: 'rgba(132, 204, 22, 0.6)', // lime-400 with opacity
      borderColor: 'rgb(132, 204, 22)',
      borderWidth: 1,
    }]
  };

  const lineChartData = {
    labels: revenueData.map(item => item.name),
    datasets: [{
      label: 'User Activity',
      data: [1200, 1900, 3000, 5000, 2300, 3400], // Sample activity data
      borderColor: 'rgb(132, 204, 22)',
      backgroundColor: 'rgba(132, 204, 22, 0.2)',
      tension: 0.4,
      fill: true,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#e5e7eb' // gray-200
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#9ca3af' }, // gray-400
        grid: { color: '#374151' } // gray-700
      },
      y: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <p className="text-gray-400 mt-1">Welcome back, Admin! Here's what's happening today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {userStats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700 hover:border-lime-400 transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-400 font-medium">{stat.title}</h3>
                {stat.icon}
              </div>
              <div className="flex items-end justify-between">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className={`text-sm rounded-full px-2 py-1 ${stat.change.startsWith('+') ? 'bg-lime-900 text-lime-400' : 'bg-red-900 text-red-400'}`}>
                  {stat.change}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-lime-400">Revenue Overview</h3>
            <div className="h-64">
              <Bar data={barChartData} options={chartOptions} />
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
            <h3 className="text-lg font-semibold mb-4 text-lime-400">User Activity</h3>
            <div className="h-64">
              <Line data={lineChartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;