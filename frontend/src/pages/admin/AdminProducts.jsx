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
    isOnSale: false, salePrice: 0, saleEndDate: '', colors: [], sizes: []
  });
  
  const [colorInput, setColorInput] = useState('');
  const [sizeName, setSizeName] = useState('');
  const [sizeDim, setSizeDim] = useState('');
  const [uploading, setUploading] = useState(false);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchProducts = () => axios.get('https://toheedcouture.com/api/products').then(res => setProducts(res.data));
  useEffect(() => { fetchProducts(); }, []);

  const uploadFileHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) { formData.append('images', files[i]); }
    setUploading(true);
    try {
      const { data } = await axios.post('https://toheedcouture.com/api/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
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
        // Naya size object banayein
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
        await axios.put(`https://toheedcouture.com/api/products/${editId}`, form, config);
        toast.success('Product Updated');
        handleCancelEdit();
      } else {
        await axios.post('https://toheedcouture.com/api/products', form, config);
        toast.success('Product Added');
        setForm({ name: '', price: '', category: '', images: [], colors: [], sizes: [], stock: '', description: '', isOnSale: false, salePrice: 0, saleEndDate: '' });
      }
      fetchProducts();
    } catch (err) { toast.error('Error saving product'); }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this product?')) {
      await axios.delete(`https://toheedcouture.com/api/products/${id}`, config);
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
            <div className="col-span-2"><textarea placeholder="Description" className="border p-2 w-full rounded" value={form.description} onChange={e => setForm({...form, description: e.target.value})} /></div>

            {/* SIZES MANAGER - Improved UI */}
            <div className="col-span-2 border p-4 rounded bg-gray-50">
                <label className="block font-bold mb-2">Available Sizes (Add One by One)</label>
                <div className="flex gap-2 mb-2">
                    <input placeholder="Size Name (e.g. Small)" className="border p-2 rounded w-1/3" value={sizeName} onChange={e => setSizeName(e.target.value)} />
                    <input placeholder="Details (e.g. Length 38, Chest 19)" className="border p-2 rounded w-2/3" value={sizeDim} onChange={e => setSizeDim(e.target.value)} />
                    <button type="button" onClick={addSize} className="bg-blue-600 text-white px-4 rounded hover:bg-blue-700">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {form.sizes.map((s, i) => (
                        <div key={i} className="bg-white border px-3 py-1 rounded shadow-sm flex items-center gap-2">
                            <span className="font-bold text-blue-700">{s.name}</span>
                            {s.dimensions && <span className="text-gray-500 text-sm">({s.dimensions})</span>}
                            <button type="button" onClick={() => removeSize(i)} className="text-red-500 font-bold ml-1 hover:text-red-700">x</button>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Hint: Add 'Small', click Add. Then add 'Medium', click Add.</p>
            </div>

            {/* Colors & Images */}
            <div className="col-span-2 border p-4 rounded bg-gray-50">
                <label className="block font-bold mb-2">Colors</label>
                <div className="flex gap-2 mb-2">
                    <input placeholder="e.g. Red, Green" className="border p-2 rounded flex-1" value={colorInput} onChange={e => setColorInput(e.target.value)} />
                    <button type="button" onClick={addColor} className="bg-blue-600 text-white px-4 rounded">Add</button>
                </div>
                <div className="flex gap-2 flex-wrap">
                    {form.colors.map((c, i) => (<span key={i} className="bg-white border px-3 py-1 rounded-full flex gap-2"><span className="w-4 h-4 rounded-full border" style={{backgroundColor: c.toLowerCase()}}></span>{c} <button type="button" onClick={() => removeColor(i)} className="text-red-500">x</button></span>))}
                </div>
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-bold">Product Images</label>
              <input type="file" multiple onChange={uploadFileHandler} className="border p-2 w-full rounded" />
              {uploading && <p className="text-blue-500">Uploading...</p>}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                 {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 flex-shrink-0"><img src={img} alt="Preview" className="w-full h-full object-cover border rounded" /><button type="button" onClick={() => removeImage(idx)} className="absolute top-0 right-0 bg-red-600 text-white w-6 h-6 rounded-full text-xs">X</button></div>
                 ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button className="bg-green-600 text-white px-6 py-2 rounded font-bold hover:bg-green-800">{isEditing ? 'Update Product' : 'Add Product'}</button>
            {isEditing && <button type="button" onClick={handleCancelEdit} className="bg-gray-500 text-white px-6 py-2 rounded font-bold">Cancel</button>}
          </div>
        </form>

        {/* RESTORED PRODUCT LIST WITH EDIT/DELETE BUTTONS */}
        <h3 className="text-xl font-bold mb-4">Product List</h3>
        <table className="w-full bg-white shadow rounded overflow-hidden">
          <thead><tr className="bg-gray-200 text-left"><th className="p-3">Image</th><th className="p-3">Name</th><th className="p-3">Price</th><th className="p-3">Sizes</th><th className="p-3">Action</th></tr></thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id} className="border-t hover:bg-gray-50">
                <td className="p-3"><img src={p.images[0]} className="h-12 w-12 object-cover rounded" alt="prod" /></td>
                <td className="p-3 font-semibold">{p.name}</td>
                <td className="p-3">{p.isOnSale ? <span className="text-red-500 font-bold">{p.salePrice}</span> : p.price}</td>
                <td className="p-3 text-xs">{p.sizes?.map(s => s.name).join(', ')}</td>
                
                {/* BUTTONS ARE BACK HERE */}
                <td className="p-3 flex gap-2">
                    <button onClick={() => handleEditClick(p)} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">Edit</button>
                    <button onClick={() => handleDelete(p._id)} className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600">Delete</button>
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