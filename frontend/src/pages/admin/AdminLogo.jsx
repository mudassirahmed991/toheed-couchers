import React, { useState, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { GlobalContext } from '../../App';

const AdminLogo = () => {
  const { settings, fetchSettings } = useContext(GlobalContext);
  const [uploading, setUploading] = useState(false);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    
    // CHANGE: Backend ab 'images' maang raha hai (Array)
    formData.append('images', file);
    
    setUploading(true);

    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      // CHANGE: Backend array return karta hai, pehla item uthao
      const logoUrl = data[0];

      // Save Logo URL to Settings
      await axios.put('http://localhost:5000/api/settings', { logo: logoUrl }, config);
      toast.success('Logo Updated Successfully');
      fetchSettings();
      setUploading(false);
    } catch (error) {
      toast.error('Error uploading logo');
      setUploading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-primary text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-yellow-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
          <Link to="/admin/banners" className="hover:text-yellow-400">Banners</Link>
          <Link to="/admin/logo" className="hover:text-yellow-400 font-bold text-yellow-400">Logo</Link>
          <Link to="/admin/settings" className="hover:text-yellow-400">Settings</Link>
        </nav>
      </div>

      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">Manage Website Logo</h2>
        <div className="bg-white p-8 rounded shadow max-w-lg">
            <div className="mb-6 text-center">
                {settings.logo ? (
                    <img src={settings.logo} alt="Current Logo" className="h-32 mx-auto object-contain border p-2" />
                ) : (
                    <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500">No Logo Uploaded</div>
                )}
            </div>
            
            <label className="block mb-2 font-bold">Upload New Logo</label>
            <input 
                type="file" 
                onChange={uploadFileHandler} 
                className="w-full border p-2 rounded"
            />
            {uploading && <p className="text-blue-500 mt-2">Uploading...</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminLogo;