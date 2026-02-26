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
            <div key={item.cartId} className="flex gap-4 border-b py-4 items-center bg-white p-4 rounded shadow-sm mb-2">
              <img src={item.images[0]} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-500 text-sm">Price: Rs. {item.isOnSale ? item.salePrice : item.price}</p>
                <div className="text-sm text-gray-600 mt-1 flex gap-3">
                    <span>Qty: <b>{item.qty}</b></span>
                    {item.color && <span>Color: <b>{item.color}</b></span>}
                    {item.size && <span>Size: <b className="text-blue-600">{item.size}</b></span>}
                </div>
              </div>
              <button onClick={() => removeFromCart(item.cartId)} className="text-red-500 hover:text-red-700 font-bold">Remove</button>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-6 rounded h-fit shadow">
          <h3 className="text-xl font-bold mb-4">Summary</h3>
          <div className="flex justify-between mb-2"><span>Subtotal</span><span>Rs. {total}</span></div>
          <div className="flex justify-between mb-4 font-bold text-lg border-t pt-2"><span>Total</span><span>Rs. {total}</span></div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-green-800 transition">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};
export default Cart;