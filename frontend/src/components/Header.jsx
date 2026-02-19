import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { FaShoppingCart, FaUser, FaSearch } from 'react-icons/fa';

const Header = () => {
  const { user, cart, settings, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-md relative z-40">
      {/* Top Bar */}
      <div className="bg-primary text-white text-xs py-2">
        <div className="custom-container flex justify-between">
          <span>Buy to Empower Her</span>
          <span>{settings.contactPhone} | {settings.contactEmail}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="custom-container py-4 flex items-center justify-between">
        {/* LOGO LOGIC */}
        <Link to="/" className="flex items-center">
          {settings.logo ? (
            <img src={settings.logo} alt="Logo" className="h-16 object-contain" />
          ) : (
            <span className="text-3xl font-serif font-bold text-primary">
              {settings.websiteName || "Toheed'sCouchers"}
            </span>
          )}
        </Link>

        {/* Search */}
        <div className="hidden lg:flex items-center border rounded-full overflow-hidden w-1/3">
          <input type="text" placeholder="I'm shopping for..." className="px-4 py-2 w-full outline-none" />
          <button className="bg-primary text-white px-6 py-2"><FaSearch /></button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-6 text-gray-700">
          {user ? (
            <div className="relative group">
              <span className="cursor-pointer flex items-center gap-1 font-semibold"><FaUser /> {user.name}</span>
              <div className="absolute right-0 top-full bg-white shadow-lg p-2 rounded hidden group-hover:block w-32 border z-50">
                {user.isAdmin && <Link to="/admin" className="block p-2 hover:bg-gray-100">Dashboard</Link>}
                <button onClick={logout} className="block w-full text-left p-2 hover:bg-gray-100 text-red-500">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1"><FaUser /> Login</Link>
          )}
          <Link to="/cart" className="flex items-center gap-1 relative">
            <FaShoppingCart className="text-xl" />
            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full px-1">{cart.reduce((acc, item) => acc + item.qty, 0)}</span>
          </Link>
        </div>
      </div>

      {/* Navbar Green (Accessories Removed) */}
      <div className="bg-primary text-white">
        <div className="custom-container flex gap-8 py-3 text-sm font-medium overflow-x-auto">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/?cat=stitch" className="hover:text-gray-300">Stitch</Link>
          <Link to="/?cat=unstitch" className="hover:text-gray-300">Unstitch</Link>
          <Link to="/?cat=bridal" className="hover:text-gray-300">Bridal/Wedding</Link>
          <Link to="/?cat=perfumes" className="hover:text-gray-300">Perfumes</Link>
          <Link to="/?cat=handbags" className="hover:text-gray-300">Handbags</Link>
        </div>
      </div>
    </header>
  );
};

export default Header;