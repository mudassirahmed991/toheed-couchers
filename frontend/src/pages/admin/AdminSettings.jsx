import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../App';
import { FaBars } from 'react-icons/fa';

const AdminSettings = () => {
  const { settings, fetchSettings } = useContext(GlobalContext);
  const [form, setForm] = useState({});
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async () => {
    try {
      const { banners, lowerBanners, ...settingsToUpdate } = form; 
      await axios.put('/api/settings', settingsToUpdate, config);
      toast.success('Settings Updated');
      fetchSettings();
    } catch (err) { toast.error('Error updating'); }
  };

  const addLink = (e) => {
    e.preventDefault();
    if (!newLinkTitle || !newLinkUrl) return toast.error("Enter Title and URL");
    const updatedLinks = [...(form.quickLinks || []), { title: newLinkTitle, url: newLinkUrl }];
    setForm({ ...form, quickLinks: updatedLinks });
    setNewLinkTitle('');
    setNewLinkUrl('');
  };

  const removeLink = (index) => {
    const updatedLinks = form.quickLinks.filter((_, i) => i !== index);
    setForm({ ...form, quickLinks: updatedLinks });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* MOBILE TOGGLE */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed bottom-5 left-5 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl"><FaBars /></button>

      {/* SIDEBAR */}
      <div className={`w-64 bg-primary text-white fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6"><h2 className="text-xl font-bold border-b border-white/20 pb-4">Admin Console</h2></div>
        <nav className="flex flex-col gap-1 px-4">
            <Link to="/admin" className="p-3 rounded-lg hover:bg-white/10">Dashboard</Link>
            <Link to="/admin/products" className="p-3 rounded-lg hover:bg-white/10">Products</Link>
            <Link to="/admin/orders" className="p-3 rounded-lg hover:bg-white/10">Orders</Link>
            <Link to="/admin/banners" className="p-3 rounded-lg hover:bg-white/10">Banners</Link>
            <Link to="/admin/logo" className="p-3 rounded-lg hover:bg-white/10">Logo</Link>
            <Link to="/admin/settings" className="p-3 rounded-lg bg-white/10 text-yellow-400 font-bold">Settings</Link>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 p-4 md:p-10">
        <h2 className="text-3xl font-bold mb-8">Website Settings</h2>
        <form className="bg-white p-4 md:p-8 rounded shadow max-w-3xl" onSubmit={(e) => e.preventDefault()}>
          <div className="mb-4">
            <label className="block font-bold mb-1">Website Name</label>
            <input className="w-full border p-2 rounded" value={form.websiteName || ''} onChange={e => setForm({...form, websiteName: e.target.value})} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
                <label className="block font-bold mb-1">Contact Phone</label>
                <input className="w-full border p-2 rounded" value={form.contactPhone || ''} onChange={e => setForm({...form, contactPhone: e.target.value})} />
            </div>
            <div>
                <label className="block font-bold mb-1">Contact Email</label>
                <input className="w-full border p-2 rounded" value={form.contactEmail || ''} onChange={e => setForm({...form, contactEmail: e.target.value})} />
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1">Office Address</label>
            <input className="w-full border p-2 rounded" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1">WhatsApp Number</label>
            <input className="w-full border p-2 rounded" value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} />
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-1">About Us Text</label>
            <textarea className="w-full border p-2 rounded" rows="3" value={form.aboutUsText || ''} onChange={e => setForm({...form, aboutUsText: e.target.value})} />
          </div>

          <div className="mb-6 border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Footer Quick Links</h3>
            <div className="flex flex-col md:flex-row gap-2 mb-2">
                <input placeholder="Title" className="border p-2 flex-1 rounded" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} />
                <input placeholder="URL" className="border p-2 flex-1 rounded" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} />
                <button type="button" onClick={addLink} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
            </div>
            <ul className="bg-gray-50 p-4 rounded">
                {form.quickLinks && form.quickLinks.map((link, index) => (
                    <li key={index} className="flex justify-between items-center border-b py-2 last:border-0">
                        <span className="text-sm"><strong>{link.title}</strong> - {link.url}</span>
                        <button type="button" onClick={() => removeLink(index)} className="text-red-500 text-sm">Remove</button>
                    </li>
                ))}
            </ul>
          </div>

          <button type="button" onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded font-bold hover:bg-green-800 w-full">Save Changes</button>
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;