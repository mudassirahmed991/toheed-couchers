import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state
  
  const [form, setForm] = useState({
    name: '', price: '', category: '', images: [], stock: '', description: '',
    isOnSale: false, salePrice: 0, saleEndDate: '', colors: [], sizes: []
  });
  
  const [colorInput, setColorInput] = useState('');
  const [sizeName, setSizeName] = useState('');
  const [sizeDim, setSizeDim] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = () => axios.get('/api/products').then(res => setProducts(res.data));
  useEffect(() => { fetchProducts(); }, []);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('images', files[i]); }
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
      setForm({...form, images: [...form.images, ...data]});
      setUploading(false);
    } catch (error) { toast.error('Upload Failed'); setUploading(false); }
  };

  const addColor = (e) => {
    e.preventDefault();
    if(colorInput.trim()) {
        const newColors = colorInput.split(',').map(c => c.trim()).filter(c => c !== '');
        setForm({ ...form, colors: [...form.colors, ...newColors] });
        setColorInput('');
    }
  };

  const addSize = (e) => {
    e.preventDefault();
    if(sizeName.trim()) {
        const newSize = { name: sizeName.trim(), dimensions: sizeDim.trim() };
        setForm({ ...form, sizes: [...form.sizes, newSize] });
        setSizeName('');
        setSizeDim('');
    }
  };

  const removeColor = (i) => setForm({ ...form, colors: form.colors.filter((_, idx) => idx !== i) });
  const removeSize = (i) => setForm({ ...form, sizes: form.sizes.filter((_, idx) => idx !== i) });
  const removeImage = (i) => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) });

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setForm({
      name: product.name, price: product.price, category: product.category,
      images: product.images || [], colors: product.colors || [], sizes: product.sizes || [],
      stock: product.stock, description: product.description || '',
      isOnSale: product.isOnSale || false, salePrice: product.salePrice || 0,
      saleEndDate: product.saleEndDate ? product.saleEndDate.substring(0, 16) : ''
    });
    window.scrollTo(0,0);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: '', price: '', category: '', images: [], colors: [], sizes: [], stock: '', description: '', isOnSale: false, salePrice: 0, saleEndDate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("Upload at least one image!");
    try {
      if (isEditing) {
        await axios.put(`/api/products/${editId}`, form, config);
        toast.success('Product Updated');
        handleCancelEdit();
      } else {
        await axios.post('/api/products', form, config);
        toast.success('Product Added');
        setForm({ name: '', price: '', category: '', images: [], colors: [], sizes: [], stock: '', description: '', isOnSale: false, salePrice: 0, saleEndDate: '' });
      }
      fetchProducts();
    } catch (err) { toast.error('Error saving product'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await axios.delete(`/api/products/${id}`, config);
      fetchProducts();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      {/* MOBILE TOGGLE */}
      <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden fixed bottom-5 left-5 z-[100] bg-primary text-white p-4 rounded-full shadow-2xl"><FaBars /></button>

      {/* SIDEBAR */}
      <div className={`w-64 bg-primary text-white fixed h-full z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-6"><h2 className="text-xl font-bold border-b border-white/20 pb-4">Admin Console</h2></div>
        <nav className="flex flex-col gap-1 px-4">
            <Link to="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">Dashboard</Link>
            <Link to="/admin/products" className="flex items-center gap-3 p-3 rounded-lg bg-white/10 text-yellow-400 font-bold">Products</Link>
            <Link to="/admin/orders" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">Orders</Link>
            <Link to="/admin/banners" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">Banners</Link>
            <Link to="/admin/logo" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">Logo</Link>
            <Link to="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10">Settings</Link>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:ml-64 p-4 md:p-10">
        <h2 className="text-3xl font-bold mb-5">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        
        {/* RESPONSIVE FORM */}
        <form onSubmit={handleSubmit} className="bg-white p-4 md:p-6 shadow-lg rounded mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Product Name" className="border p-2 rounded w-full" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input placeholder="Original Price" className="border p-2 rounded w-full" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input placeholder="Category (Stitch, Perfume)" className="border p-2 rounded w-full" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
            <input placeholder="Stock Quantity" className="border p-2 rounded w-full" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
            <div className="md:col-span-2"><textarea placeholder="Description" className="border p-2 w-full rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>

            {/* SIZES */}
            <div className="md:col-span-2 border p-4 rounded bg-gray-50">
                <label className="block font-bold mb-2">Sizes (Add One by One)</label>
                <div className="flex gap-2 mb-2">
                    <input placeholder="Size (e.g. Small)" className="border p-2 rounded w-1/3" value={sizeName} onChange={e => setSizeName(e.target.value)} />
                    <input placeholder="Details (e.g. Length 38)" className="border p-2 rounded w-2/3" value={sizeDim} onChange={e => setSizeDim(e.target.value)} />
                    <button type="button" onClick={addSize} className="bg-blue-600 text-white px-4 rounded">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {form.sizes.map((s, i) => (
                        <div key={i} className="bg-white border px-3 py-1 rounded shadow-sm flex items-center gap-2">
                            <span className="font-bold text-blue-700">{s.name}</span>
                            <button type="button" onClick={() => removeSize(i)} className="text-red-500 font-bold ml-1">x</button>
                        </div>
                    ))}
                </div>
            </div>

            {/* COLORS */}
            <div className="md:col-span-2 border p-4 rounded bg-gray-50">
                <label className="block font-bold mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                    <input placeholder="e.g. Red, Green" className="border p-2 rounded flex-1" value={colorInput} onChange={e => setColorInput(e.target.value)} />
                    <button type="button" onClick={addColor} className="bg-blue-600 text-white px-4 rounded">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {form.colors.map((c, i) => (<span key={i} className="bg-white border px-3 py-1 rounded-full flex gap-2"><span className="w-4 h-4 rounded-full border" style={{backgroundColor: c.toLowerCase()}}></span>{c} <button type="button" onClick={() => removeColor(i)} className="text-red-500">x</button></span>))}
                </div>
            </div>

            {/* SALE */}
            <div className="md:col-span-2 bg-yellow-50 p-4 border border-yellow-200 rounded">
                <label className="flex items-center gap-2 font-bold mb-2 cursor-pointer">
                    <input type="checkbox" checked={form.isOnSale} onChange={e => setForm({...form, isOnSale: e.target.checked})} /> Enable Sale?
                </label>
                {form.isOnSale && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div><label className="text-sm">Sale Price</label><input type="number" className="border p-2 w-full rounded" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} /></div>
                        <div><label className="text-sm">Sale Ends At</label><input type="datetime-local" className="border p-2 w-full rounded" value={form.saleEndDate} onChange={e => setForm({...form, saleEndDate: e.target.value})} /></div>
                    </div>
                )}
            </div>

            {/* IMAGES */}
            <div className="md:col-span-2">
              <label className="block mb-1 font-bold">Product Images</label>
              <input type="file" multiple onChange={uploadFileHandler} className="border p-2 w-full rounded" />
              {uploading && <p className="text-blue-500">Uploading...</p>}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                 {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20 flex-shrink-0"><img src={img} className="w-full h-full object-cover border rounded" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white w-5 h-5 rounded-full text-xs">X</button></div>
                 ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-800">{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-6 py-2 rounded font-bold">Cancel</button>}
          </div>
        </form>

        {/* RESPONSIVE TABLE */}
        <h3 className="text-xl font-bold mb-4">Product List</h3>
        <div className="overflow-x-auto bg-white rounded shadow">
            <table className="w-full text-left min-w-[700px]">
            <thead><tr className="bg-gray-200 border-b"><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Sizes</th><th className="p-3">Action</th></tr></thead>
            <tbody>
                {products.map(p => (
                <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-3"><img src={p.images[0]} className="w-12 h-12 object-cover rounded" /></td>
                    <td className="p-3 font-semibold">{p.name}</td>
                    <td className="p-3">{p.isOnSale ? <span className="text-red-500 font-bold">{p.salePrice}</span> : p.price}</td>
                    <td className="p-3 text-xs">{p.sizes?.map(s => s.name).join(', ')}</td>
                    <td className="p-3 flex gap-2">
                        <button onClick={() => handleEditClick(p)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm">Edit</button>
                        <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
export default AdminProducts;