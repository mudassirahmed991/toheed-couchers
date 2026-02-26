import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = JSON.parse(localStorage.getItem('userInfo')).token;
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchOrders = () => axios.get('http://localhost:5000/api/orders', config).then(res => setOrders(res.data));
  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status }, config);
      toast.success(`Order Marked as ${status}`);
      fetchOrders();
    } catch (error) { toast.error("Status update failed"); }
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Are you sure you want to DELETE this order?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/orders/${id}`, config);
      toast.success("Order Deleted");
      fetchOrders();
    } catch (error) { toast.error("Delete failed"); }
  };

  // Smart Image Fixer
  const getImageUrl = (item) => {
    let img = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
    if (!img) return 'https://via.placeholder.com/50';
    if (img.startsWith('http')) return img;
    return `http://localhost:5000/${img.replace(/\\/g, '/')}`;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
       {/* SIDEBAR */}
       <div className="w-64 bg-primary text-white min-h-screen p-5 fixed h-full overflow-y-auto z-50">
        <h2 className="text-2xl font-bold mb-10 border-b border-green-600 pb-4">Admin Panel</h2>
        <nav className="flex flex-col gap-4 text-lg">
          <Link to="/admin" className="hover:text-yellow-400 transition">Dashboard</Link>
          <Link to="/admin/products" className="hover:text-yellow-400 transition">Products</Link>
          <Link to="/admin/orders" className="hover:text-yellow-400 font-bold text-yellow-400 transition">Orders</Link>
          <Link to="/admin/banners" className="hover:text-yellow-400 transition">Banners</Link>
          <Link to="/admin/logo" className="hover:text-yellow-400 transition">Logo</Link>
          <Link to="/admin/settings" className="hover:text-yellow-400 transition">Settings</Link>
        </nav>
      </div>

       {/* MAIN CONTENT */}
       <div className="flex-1 p-10 ml-64">
         <h2 className="text-3xl font-bold mb-8 text-gray-800">Order Management</h2>
         
         <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
           <table className="w-full text-left border-collapse">
             <thead className="bg-green-700 text-white">
               <tr>
                 <th className="p-4 text-sm font-semibold">Order ID</th>
                 <th className="p-4 text-sm font-semibold">Customer</th>
                 <th className="p-4 text-sm font-semibold w-48">Address</th> {/* ADDED ADDRESS COLUMN */}
                 <th className="p-4 text-sm font-semibold w-72">Ordered Items</th>
                 <th className="p-4 text-sm font-semibold">Total</th>
                 <th className="p-4 text-sm font-semibold">Status</th>
                 <th className="p-4 text-sm font-semibold">Action</th>
                 <th className="p-4 text-sm font-semibold text-center">Delete</th>
               </tr>
             </thead>
             <tbody className="text-gray-700">
               {orders.map(o => (
                 <tr key={o._id} className="border-b hover:bg-gray-50 transition align-top">
                   
                   {/* Order ID */}
                   <td className="p-4 text-xs font-mono text-gray-500">{o._id.substring(0, 8)}...</td>
                   
                   {/* Customer Name & Phone */}
                   <td className="p-4 font-medium">
                       <div className="text-gray-900 font-bold">{o.customerDetails.name}</div>
                       <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                         <i className="fa-solid fa-phone"></i> {o.customerDetails.phone}
                       </div>
                   </td>

                   {/* ADDRESS COLUMN (ADDED) */}
                   <td className="p-4 text-sm text-gray-600 max-w-xs" title={o.customerDetails.address}>
                     {o.customerDetails.address}
                   </td>
                   
                   {/* Ordered Items */}
                   <td className="p-4 text-sm">
                     {o.orderItems.map((item, index) => (
                       <div key={index} className="flex items-center gap-3 mb-2 border-b pb-2 last:border-0">
                         <img src={getImageUrl(item)} alt={item.name} className="w-10 h-10 object-cover rounded border" />
                         <div>
                            <p className="font-bold text-gray-800 leading-tight text-xs">{item.name}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                                Qty: <b>{item.qty}</b> 
                                {item.color && <span> | {item.color}</span>}
                                {item.size && <span className="text-blue-600 font-bold"> | {item.size}</span>}
                            </p>
                         </div>
                       </div>
                     ))}
                   </td>

                   {/* Total Price */}
                   <td className="p-4 font-bold text-green-700">Rs. {o.totalPrice}</td>
                   
                   {/* Status Badge */}
                   <td className="p-4">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold text-white block text-center shadow-sm
                       ${o.status === 'Pending' ? 'bg-yellow-500' : 
                         o.status === 'Confirmed' ? 'bg-blue-500' :
                         o.status === 'Shipped' ? 'bg-purple-500' :
                         o.status === 'Delivered' ? 'bg-green-600' : 'bg-red-500'
                       }`}>
                       {o.status}
                     </span>
                   </td>
                   
                   {/* Action Dropdown */}
                   <td className="p-4">
                     <select onChange={(e) => updateStatus(o._id, e.target.value)} value={o.status} className="border border-gray-300 p-2 rounded text-sm w-full bg-white focus:ring-2 focus:ring-green-500 outline-none">
                       <option value="Pending">Pending</option>
                       <option value="Confirmed">Confirmed</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Delivered">Delivered</option>
                       <option value="Rejected">Rejected</option>
                     </select>
                   </td>

                   {/* Delete Button */}
                   <td className="p-4 text-center align-middle">
                       <button onClick={() => handleDelete(o._id)} className="text-red-500 hover:text-red-700 font-bold text-lg transition transform hover:scale-110" title="Delete Order">
                           X
                       </button>
                   </td>
                 </tr>
               ))}
               {orders.length === 0 && (
                 <tr>
                   <td colSpan="8" className="p-10 text-center text-gray-500 text-lg">No orders found yet.</td>
                 </tr>
               )}
             </tbody>
           </table>
         </div>
       </div>
    </div>
  );
};
export default AdminOrders;