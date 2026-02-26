import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('userInfo')).token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('https://toheedcouture.com/api/orders', config).then(res => setOrders(res.data));
    axios.get('https://toheedcouture.com/api/products').then(res => setProducts(res.data));
  }, []);

  const totalRevenue = orders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-primary text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-yellow-400 font-bold text-yellow-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
          <Link to="/admin/banners" className="hover:text-yellow-400">Banners</Link>
          <Link to="/admin/logo" className="hover:text-yellow-400">Logo</Link> {/* NEW BUTTON */}
          <Link to="/admin/settings" className="hover:text-yellow-400">Settings</Link>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-3 gap-6 mb-10">
           <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
             <h3 className="text-gray-500">Orders</h3><p className="text-3xl font-bold">{orders.length}</p>
           </div>
           <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
             <h3 className="text-gray-500">Revenue</h3><p className="text-3xl font-bold">Rs. {totalRevenue}</p>
           </div>
           <div className="bg-white p-6 rounded shadow border-l-4 border-yellow-500">
             <h3 className="text-gray-500">Products</h3><p className="text-3xl font-bold">{products.length}</p>
           </div>
        </div>
      </div>
    </div>
  );
};
export default AdminDashboard;