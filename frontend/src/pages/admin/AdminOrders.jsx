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
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  // --- SMART IMAGE FIXER FUNCTION ---
  const getImageUrl = (item) => {
    // 1. Image dhoondo (ya item.image ho, ya item.images array ka pehla hissa)
    let img = item.image || (item.images && item.images.length > 0 ? item.images[0] : null);
    
    // 2. Agar koi image nahi hai, to Placeholder dikhao
    if (!img) return 'https://via.placeholder.com/50';

    // 3. Agar image ka link "http" se shuru hota hai (Naya Order), to waisa hi return karo
    if (img.startsWith('http')) return img;

    // 4. Agar image ka link adha hai (Purana Order), to uske peeche localhost lagao
    // Backslash (\) ko Forward slash (/) mein badalna zaroori hai
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
                 <th className="p-4 text-sm font-semibold w-72">Ordered Items (Qty)</th>
                 <th className="p-4 text-sm font-semibold">Phone</th>
                 <th className="p-4 text-sm font-semibold">Address</th>
                 <th className="p-4 text-sm font-semibold">Total</th>
                 <th className="p-4 text-sm font-semibold">Status</th>
                 <th className="p-4 text-sm font-semibold">Action</th>
               </tr>
             </thead>
             <tbody className="text-gray-700">
               {orders.map(o => (
                 <tr key={o._id} className="border-b hover:bg-gray-50 transition align-top">
                   <td className="p-4 text-xs font-mono text-gray-500">{o._id.substring(0, 10)}...</td>
                   <td className="p-4 font-medium">{o.customerDetails.name}</td>
                   
                   {/* PRODUCT NAME & IMAGE */}
                   <td className="p-4 text-sm">
                     {o.orderItems.map((item, index) => (
                       <div key={index} className="flex items-center gap-3 mb-2 border-b pb-2 last:border-0">
                         
                         {/* Using Smart Image Fixer */}
                         <img 
                           src={getImageUrl(item)} 
                           alt={item.name} 
                           className="w-12 h-12 object-cover rounded border border-gray-300"
                           onError={(e) => { e.target.src = 'https://via.placeholder.com/50?text=No+Img'; }} // Fallback if still fails
                         />
                         
                         <div>
                            <p className="font-bold text-gray-800 leading-tight">{item.name}</p>
                            <p className="text-xs text-gray-500 mt-1">
                                Qty: <span className="font-bold text-black">{item.qty}</span> 
                                {item.color && <span> | Color: {item.color}</span>}
                            </p>
                         </div>
                       </div>
                     ))}
                   </td>

                   <td className="p-4 text-sm">{o.customerDetails.phone}</td>
                   <td className="p-4 text-sm max-w-xs truncate" title={o.customerDetails.address}>
                     {o.customerDetails.address}
                   </td>

                   <td className="p-4 font-bold text-green-700">Rs. {o.totalPrice}</td>
                   
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
                   
                   <td className="p-4">
                     <select 
                       onChange={(e) => updateStatus(o._id, e.target.value)} 
                       value={o.status} 
                       className="border border-gray-300 p-2 rounded text-sm focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer w-full bg-white"
                     >
                       <option value="Pending">Pending</option>
                       <option value="Confirmed">Confirmed</option>
                       <option value="Rejected">Rejected</option>
                       <option value="Shipped">Shipped</option>
                       <option value="Delivered">Delivered</option>
                     </select>
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