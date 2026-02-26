import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FaWhatsapp } from 'react-icons/fa'; // IMPORT ADDED

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';

import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminSettings from './pages/admin/AdminSettings';
import AdminBanners from './pages/admin/AdminBanners';
import AdminLogo from './pages/admin/AdminLogo';

export const GlobalContext = React.createContext();

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || null);
  const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cartItems')) || []);
  const [settings, setSettings] = useState({});

  useEffect(() => { localStorage.setItem('cartItems', JSON.stringify(cart)); }, [cart]);
  
  const fetchSettings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/settings');
      setSettings(data);
    } catch (error) { console.error(error); }
  };

  useEffect(() => { fetchSettings(); }, []);

  const addToCart = (product, qty, color, size) => {
    const cartId = `${product._id}-${color}-${size || 'nosize'}`;
    const existItem = cart.find((x) => x.cartId === cartId);
    if (existItem) {
      setCart(cart.map((x) => x.cartId === cartId ? { ...existItem, qty: existItem.qty + qty } : x));
    } else {
      setCart([...cart, { ...product, qty, color, size, cartId }]);
    }
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((x) => x.cartId !== cartId));
  };

  return (
    <GlobalContext.Provider value={{ user, setUser, cart, setCart, addToCart, removeFromCart, settings, fetchSettings }}>
      <Router>
        <Header />
        <main className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            
            <Route path="/admin" element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/products" element={<PrivateRoute adminOnly><AdminProducts /></PrivateRoute>} />
            <Route path="/admin/orders" element={<PrivateRoute adminOnly><AdminOrders /></PrivateRoute>} />
            <Route path="/admin/settings" element={<PrivateRoute adminOnly><AdminSettings /></PrivateRoute>} />
            <Route path="/admin/banners" element={<PrivateRoute adminOnly><AdminBanners /></PrivateRoute>} />
            <Route path="/admin/logo" element={<PrivateRoute adminOnly><AdminLogo /></PrivateRoute>} />
          </Routes>
        </main>
        <Footer />
        <ToastContainer />
        
        {/* FIXED WHATSAPP BUTTON */}
        {settings.whatsapp && (
          <a 
            href={`https://wa.me/${settings.whatsapp}`} 
            target="_blank" 
            rel="noreferrer" 
            className="fixed bottom-6 right-6 bg-[#25D366] text-white p-3 rounded-full shadow-2xl z-50 hover:bg-[#128C7E] transition-all duration-300 hover:scale-110 flex items-center justify-center"
            style={{ width: '60px', height: '60px' }}
          >
            <FaWhatsapp size={35} />
          </a>
        )}
      </Router>
    </GlobalContext.Provider>
  );
}

export default App;