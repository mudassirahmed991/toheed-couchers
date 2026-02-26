import React, { useState, useContext } from 'react';
import { GlobalContext } from '../App';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { cart, setCart } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [details, setDetails] = useState({ name: '', email: '', address: '', phone: '' });

  const total = cart.reduce((acc, item) => acc + item.qty * (item.isOnSale ? item.salePrice : item.price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const orderData = {
        orderItems: cart.map(x => ({ ...x, product: x._id })),
        customerDetails: details,
        totalPrice: total
      };
      await axios.post('https://toheedcouture.com/api/orders', orderData);
      setCart([]);
      localStorage.removeItem('cartItems');
      toast.success('Order Placed Successfully!');
      navigate('/');
    } catch (err) { toast.error('Order Failed'); }
  };

  return (
    <div className="custom-container py-10 max-w-lg">
      <h2 className="text-2xl font-bold mb-5">Checkout</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Full Name" required className="w-full border p-2 rounded" onChange={e => setDetails({...details, name: e.target.value})} />
        <input placeholder="Email" required type="email" className="w-full border p-2 rounded" onChange={e => setDetails({...details, email: e.target.value})} />
        <input placeholder="Address" required className="w-full border p-2 rounded" onChange={e => setDetails({...details, address: e.target.value})} />
        <input placeholder="Phone" required className="w-full border p-2 rounded" onChange={e => setDetails({...details, phone: e.target.value})} />
        <div className="text-xl font-bold py-4">Total: Rs. {total}</div>
        <button className="w-full bg-primary text-white py-3 rounded font-bold">Place Order (COD)</button>
      </form>
    </div>
  );
};
export default Checkout;