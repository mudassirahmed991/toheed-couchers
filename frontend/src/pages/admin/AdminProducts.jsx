import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  
  const [form, setForm] = useState({
    name: '', price: '', category: '', images: [], stock: '', description: '',
    isOnSale: false, salePrice: 0, saleEndDate: '', colors: []
  });
  
  const [colorInput, setColorInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = () => axios.get('http://localhost:5000/api/products').then(res => setProducts(res.data));
  useEffect(() => { fetchProducts(); }, []);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
    }
    setUploading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setForm({...form, images: [...form.images, ...data]});
      setUploading(false);
    } catch (error) { toast.error('Upload Failed'); setUploading(false); }
  };

  // --- NEW LOGIC: COMMA SEPARATOR ---
  const addColor = (e) => {
    e.preventDefault();
    if(colorInput.trim()) {
        // Agar user ne "Red, Green, Blue" likha hai, to usay alag alag kar do
        const newColors = colorInput.split(',').map(c => c.trim()).filter(c => c !== '');
        
        setForm({ ...form, colors: [...form.colors, ...newColors] });
        setColorInput('');
    }
  };

  const handleColorKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); 
      addColor(e); 
    }
  };

  const removeColor = (indexToRemove) => {
    setForm({ ...form, colors: form.colors.filter((_, i) => i !== indexToRemove) });
  };

  const removeImage = (index) => {
    const updatedImages = form.images.filter((_, i) => i !== index);
    setForm({ ...form, images: updatedImages });
  };

  const handleEditClick = (product) => {
    setIsEditing(true);
    setEditId(product._id);
    setForm({
      name: product.name,
      price: product.price,
      category: product.category,
      images: product.images || [],
      colors: product.colors || [],
      stock: product.stock,
      description: product.description || '',
      isOnSale: product.isOnSale || false,
      salePrice: product.salePrice || 0,
      saleEndDate: product.saleEndDate ? product.saleEndDate.substring(0, 16) : ''
    });
    window.scrollTo(0,0);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditId(null);
    setForm({ name: '', price: '', category: '', images: [], colors: [], stock: '', description: '', isOnSale: false, salePrice: 0, saleEndDate: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.images.length === 0) return toast.error("Please upload at least one image!");

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, form, config);
        toast.success('Product Updated');
        handleCancelEdit();
      } else {
        await axios.post('http://localhost:5000/api/products', form, config);
        toast.success('Product Added');
        setForm({ name: '', price: '', category: '', images: [], colors: [], stock: '', description: '', isOnSale: false, salePrice: 0, saleEndDate: '' });
      }
      fetchProducts();
    } catch (err) { toast.error('Error saving product'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      fetchProducts();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-primary text-white min-h-screen p-5">
        <h2 className="text-2xl font-bold mb-10">Admin Panel</h2>
        <nav className="flex flex-col gap-4">
            <Link to="/admin" className="hover:text-yellow-400">Dashboard</Link>
            <Link to="/admin/products" className="hover:text-yellow-400 font-bold text-yellow-400">Products</Link>
            <Link to="/admin/orders" className="hover:text-yellow-400">Orders</Link>
            <Link to="/admin/banners" className="hover:text-yellow-400">Banners</Link>
            <Link to="/admin/logo" className="hover:text-yellow-400">Logo</Link>
            <Link to="/admin/settings" className="hover:text-yellow-400">Settings</Link>
        </nav>
      </div>
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-5">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-lg rounded mb-10">
          <div className="grid grid-cols-2 gap-4">
            <input placeholder="Product Name" className="border p-2 rounded" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input placeholder="Original Price" className="border p-2 rounded" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input placeholder="Category (Stitch, Perfume)" className="border p-2 rounded" value={form.category} onChange={e => setForm({...form, category: e.target.value})} required />
            <input placeholder="Stock Quantity" className="border p-2 rounded" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
            
            <div className="col-span-2">
               <textarea placeholder="Description" className="border p-2 w-full rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            </div>

            {/* Colors Input */}
            <div className="col-span-2 border p-4 rounded bg-gray-50">
                <label className="block font-bold mb-2">Available Colors (Separate by comma or press Enter)</label>
                <div className="flex gap-2 mb-2">
                    <input 
                        placeholder="e.g. Red, Green, Blue" 
                        className="border p-2 rounded flex-1" 
                        value={colorInput} 
                        onChange={e => setColorInput(e.target.value)} 
                        onKeyDown={handleColorKeyDown} 
                    />
                    <button type="button" onClick={addColor} className="bg-blue-600 text-white px-4 rounded">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {/* Fixed Key Issue & Styling */}
                    {form.colors.map((c, i) => (
                        <span key={i} className="bg-white border px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                            <span 
                                className="w-4 h-4 rounded-full border border-gray-300" 
                                style={{ backgroundColor: c.toLowerCase() }}
                            ></span>
                            {c} 
                            <button type="button" onClick={() => removeColor(i)} className="text-red-500 font-bold ml-1">x</button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Sale Section */}
            <div className="col-span-2 bg-yellow-50 p-4 border border-yellow-200 rounded">
                <label className="flex items-center gap-2 font-bold mb-2 cursor-pointer">
                    <input type="checkbox" checked={form.isOnSale} onChange={e => setForm({...form, isOnSale: e.target.checked})} />
                    Enable Sale?
                </label>
                {form.isOnSale && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <label className="text-sm">Sale Price (Rs.)</label>
                            <input type="number" className="border p-2 w-full rounded" value={form.salePrice} onChange={e => setForm({...form, salePrice: e.target.value})} />
                        </div>
                        <div>
                            <label className="text-sm">Sale Ends At</label>
                            <input type="datetime-local" className="border p-2 w-full rounded" value={form.saleEndDate} onChange={e => setForm({...form, saleEndDate: e.target.value})} />
                        </div>
                    </div>
                )}
            </div>

            {/* Images */}
            <div className="col-span-2">
              <label className="block mb-1 font-bold">Product Images</label>
              <input type="file" multiple onChange={uploadFileHandler} className="border p-2 w-full rounded" />
              {uploading && <p className="text-blue-500">Uploading...</p>}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                 {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 flex-shrink-0">
                        <img src={img} alt="Preview" className="w-full h-full object-cover border rounded" />
                        <button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full text-xs">X</button>
                    </div>
                 ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-800">
                {isEditing ? 'Update Product' : 'Add Product'}
            </button>
            {isEditing && (
                <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-6 py-2 rounded font-bold">Cancel</button>
            )}
          </div>
        </form>

        <h3 className="text-xl font-bold mb-4">Product List</h3>
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead><tr className="bg-gray-200 text-left"><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Colors</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3"><img src={p.images[0]} className="h-12 w-12 object-cover rounded" alt="prod" /></td>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3">{p.isOnSale ? <span className="text-red-500 font-bold">{p.salePrice}</span> : p.price}</td>
                <td className="p-3 text-xs">{p.colors?.join(', ')}</td>
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
  );
};
export default AdminProducts;