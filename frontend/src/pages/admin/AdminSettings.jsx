import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../App';

const AdminSettings = () => {
  const { settings, fetchSettings } = useContext(GlobalContext);
  const [form, setForm] = useState({});
  
  // States for adding new link
  const [newLinkTitle, setNewLinkTitle] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => { setForm(settings); }, [settings]);

  const handleSave = async () => {
    try {
      // Remove banners from here to prevent overwrite, just update text fields
      const { banners, lowerBanners, ...settingsToUpdate } = form; 
      await axios.put('http://localhost:5000/api/settings', settingsToUpdate, config);
      toast.success('Settings Updated Successfully');
      fetchSettings();
    } catch (err) { toast.error('Error updating settings'); }
  };

  const addLink = (e) => {
    e.preventDefault(); // Stop form submission
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
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-primary text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
          <Link to="/admin" className="hover:text-yellow-400">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-yellow-400">Products</Link>
          <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
          <Link to="/admin/banners" className="hover:text-yellow-400">Banners</Link>
          <Link to="/admin/logo" className="hover:text-yellow-400">Logo</Link>
          <Link to="/admin/settings" className="hover:text-yellow-400 font-bold text-yellow-400">Settings</Link>
        </nav>
      </div>

      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-8">Website Settings</h2>
        {/* Added onSubmit preventDefault to stop Enter key issues */}
        <form className="bg-white p-8 rounded shadow max-w-3xl" onSubmit={(e) => e.preventDefault()}>
          
          <div className="mb-4">
            <label className="block font-bold mb-1">Website Name</label>
            <input className="w-full border p-2 rounded" value={form.websiteName || ''} onChange={e => setForm({...form, websiteName: e.target.value})} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
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
            <input className="w-full border p-2 rounded" value={form.address || ''} onChange={e => setForm({...form, address: e.target.value})} placeholder="e.g. Multan Road, Lahore"/>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-1">WhatsApp Number</label>
            <input className="w-full border p-2 rounded" value={form.whatsapp || ''} onChange={e => setForm({...form, whatsapp: e.target.value})} />
          </div>

          <div className="mb-6">
            <label className="block font-bold mb-1">About Us Text</label>
            <textarea className="w-full border p-2 rounded" rows="3" value={form.aboutUsText || ''} onChange={e => setForm({...form, aboutUsText: e.target.value})} />
          </div>

          {/* QUICK LINKS MANAGER */}
          <div className="mb-6 border-t pt-4">
            <h3 className="font-bold text-lg mb-2">Manage Footer Quick Links</h3>
            <div className="flex gap-2 mb-2">
                <input placeholder="Link Title (e.g. Refund Policy)" className="border p-2 flex-1 rounded" value={newLinkTitle} onChange={e => setNewLinkTitle(e.target.value)} />
                <input placeholder="Link URL (e.g. /refund)" className="border p-2 flex-1 rounded" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} />
                {/* Added type="button" to prevent Enter key triggering this */}
                <button type="button" onClick={addLink} className="bg-green-600 text-white px-4 rounded hover:bg-green-700">Add</button>
            </div>
            <ul className="bg-gray-50 p-4 rounded">
                {form.quickLinks && form.quickLinks.map((link, index) => (
                    <li key={index} className="flex justify-between items-center border-b py-2 last:border-0">
                        <span><strong>{link.title}</strong> - {link.url}</span>
                        <button type="button" onClick={() => removeLink(index)} className="text-red-500 text-sm hover:underline">Remove</button>
                    </li>
                ))}
                {(!form.quickLinks || form.quickLinks.length === 0) && <p className="text-gray-500">No links added.</p>}
            </ul>
          </div>

          {/* Added type="button" here too */}
          <button type="button" onClick={handleSave} className="bg-primary text-white px-8 py-3 rounded font-bold hover:bg-green-800 w-full">Save Changes</button>
        </form>
      </div>
    </div>
  );
};
export default AdminSettings;