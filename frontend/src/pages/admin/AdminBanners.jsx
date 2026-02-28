import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../App';
import { Link } from 'react-router-dom';

const AdminBanners = () => {
  const { settings, fetchSettings } = useContext(GlobalContext);
  const [uploadingTop, setUploadingTop] = useState(false);
  const [uploadingLow, setUploadingLow] = useState(false);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // --- TOP BANNER UPLOAD (Fixed Link) ---
  const uploadTopBanner = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('images', file);
    setUploadingTop(true);
    try {
      // FIX: Use relative path /api/upload
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = data[0]; 
      const updatedBanners = [...(settings.banners || []), imageUrl];
      await axios.put('/api/settings', { banners: updatedBanners }, config);
      toast.success('Top Banner Added');
      fetchSettings();
      setUploadingTop(false);
    } catch (error) { toast.error('Error uploading'); setUploadingTop(false); }
  };

  const deleteTopBanner = async (index) => {
    if(!window.confirm("Delete Top Banner?")) return;
    try {
      const updatedBanners = settings.banners.filter((_, i) => i !== index);
      await axios.put('/api/settings', { banners: updatedBanners }, config);
      toast.success('Deleted');
      fetchSettings();
    } catch (err) { toast.error('Error deleting'); }
  };

  // --- LOWER BANNER UPLOAD (Fixed Link) ---
  const uploadLowerBanner = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('images', file);
    setUploadingLow(true);
    try {
      // FIX: Use relative path /api/upload
      const { data } = await axios.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const imageUrl = data[0];
      const updatedLower = [...(settings.lowerBanners || []), imageUrl];
      await axios.put('/api/settings', { lowerBanners: updatedLower }, config);
      toast.success('Lower Banner Added');
      fetchSettings();
      setUploadingLow(false);
    } catch (error) { toast.error('Error uploading'); setUploadingLow(false); }
  };

  const deleteLowerBanner = async (index) => {
    if(!window.confirm("Delete Lower Banner?")) return;
    try {
      const updatedLower = settings.lowerBanners.filter((_, i) => i !== index);
      await axios.put('/api/settings', { lowerBanners: updatedLower }, config);
      toast.success('Deleted');
      fetchSettings();
    } catch (err) { toast.error('Error deleting'); }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-primary text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-yellow-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
          <Link to="/admin/banners" className="hover:text-yellow-400 font-bold text-yellow-400">Banners</Link>
          <Link to="/admin/logo" className="hover:text-yellow-400">Logo</Link>
          <Link to="/admin/settings" className="hover:text-yellow-400">Settings</Link>
        </nav>
      </div>

      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">Manage Banners</h2>
        
        {/* TOP SLIDER */}
        <div className="bg-white p-6 rounded shadow mb-10 border-t-4 border-blue-600">
            <h3 className="font-bold text-xl mb-4 text-blue-800">1. Top Hero Slider (Auto-Slide)</h3>
            <input type="file" onChange={uploadTopBanner} className="border p-2 w-full rounded mb-4" />
            {uploadingTop && <p className="text-blue-500">Uploading...</p>}
            <div className="grid grid-cols-2 gap-4">
                {settings.banners && settings.banners.map((banner, index) => (
                    <div key={index} className="relative border p-2 rounded">
                        <img src={banner} alt="Top" className="w-full h-32 object-cover rounded" />
                        <button onClick={() => deleteTopBanner(index)} className="absolute top-2 right-2 bg-red-600 text-white px-2 rounded">X</button>
                    </div>
                ))}
            </div>
        </div>

        {/* LOWER BANNER */}
        <div className="bg-white p-6 rounded shadow mb-10 border-t-4 border-green-600">
            <h3 className="font-bold text-xl mb-4 text-green-800">2. Lower Section Banner (Above Mission)</h3>
            <input type="file" onChange={uploadLowerBanner} className="border p-2 w-full rounded mb-4" />
            {uploadingLow && <p className="text-green-500">Uploading...</p>}
            <div className="grid grid-cols-1 gap-4">
                {settings.lowerBanners && settings.lowerBanners.map((banner, index) => (
                    <div key={index} className="relative border p-2 rounded">
                        <img src={banner} alt="Lower" className="w-full h-48 object-cover rounded" />
                        <button onClick={() => deleteLowerBanner(index)} className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded">Delete</button>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
export default AdminBanners;