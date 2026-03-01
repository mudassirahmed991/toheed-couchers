import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaTachometerAlt, FaBox, FaClipboardList, FaImages, FaIdCard, FaCog, FaBars } from 'react-icons/fa';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('/api/orders', config).then(res => setOrders(res.data));
    axios.get('/api/products').then(res => setProducts(res.data));
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* MOBILE TOGGLE BUTTON */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-5 left-5 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl"
      >
        <FaBars />
      </button>

      {/* SIDEBAR - Responsive */}
      <div className={`w-64 bg-primary text-white fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6">
          <h2 className="text-xl font-bold border-b border-white/20 pb-4">Admin Console</h2>
        </div>
        <nav className="flex flex-col gap-1 px-4">
          <AdminLink to="/admin" icon={<FaTachometerAlt />} label="Dashboard" active />
          <AdminLink to="/admin/products" icon={<FaBox />} label="Products" />
          <AdminLink to="/admin/orders" icon={<FaClipboardList />} label="Orders" />
          <AdminLink to="/admin/banners" icon={<FaImages />} label="Banners" />
          <AdminLink to="/admin/logo" icon={<FaIdCard />} label="Logo" />
          <AdminLink to="/admin/settings" icon={<FaCog />} label="Settings" />
        </nav>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 lg:ml-64 p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Business Overview</h1>
        
        {/* RESPONSIVE STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6 mb-10">
          <StatCard title="Orders" val={orders.length} color="blue" />
          <StatCard title="Revenue" val={`Rs. ${totalRevenue}`} color="green" />
          <StatCard title="Products" val={products.length} color="yellow" />
        </div>
      </div>
    </div>
  );
};

const AdminLink = ({ to, icon, label, active }) => (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-lg transition hover:bg-white/10 ${active ? 'bg-white/10 text-yellow-400' : ''}`}>
        {icon} <span>{label}</span>
    </Link>
);

const StatCard = ({ title, val, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-${color}-500 flex flex-col`}>
        <h3 className="text-gray-500 font-medium text-sm uppercase tracking-wider">{title}</h3>
        <p className="text-2xl md:text-3xl font-bold mt-2">{val}</p>
    </div>
);

export default AdminDashboard;