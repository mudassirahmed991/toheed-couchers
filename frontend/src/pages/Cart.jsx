import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';

const Cart = () => {
  const { cart, removeFromCart } = useContext(GlobalContext);
  const navigate = useNavigate();
  const total = cart.reduce((acc, item) => acc + item.qty * (item.isOnSale ? item.salePrice : item.price), 0);

  if (cart.length === 0) return <div className="text-center py-20 text-2xl">Your cart is empty <Link to="/" className="text-primary underline">Shop Now</Link></div>;

  return (
    <div className="custom-container py-10">
      <h2 className="text-3xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          {cart.map(item => (
            <div key={item._id} className="flex gap-4 border-b py-4 items-center">
              <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500">Price: Rs. {item.isOnSale ? item.salePrice : item.price}</p>
                <p className="text-gray-500">Qty: {item.qty}</p>
              </div>
              <button onClick={() => removeFromCart(item._id)} className="text-red-500 hover:underline">Remove</button>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-6 rounded h-fit">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs. {total}</span></div>
          <div className="flex justify-between mb-4 font-bold text-lg"><span>Total</span><span>Rs. {total}</span></div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-primary text-white py-3 rounded font-bold">Checkout</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;