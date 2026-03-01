import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { FaShoppingCart, FaUser, FaSearch, FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
  const { user, cart, settings, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-[100]">
      {/* Top Bar - Hidden on extra small mobile */}
      <div className="bg-primary text-white text-[10px] md:text-xs py-2 px-4">
        <div className="custom-container flex justify-between items-center">
          <span className="truncate">Buy to Empower Her</span>
          <span className="hidden sm:inline">{settings.contactPhone}</span>
        </div>
      </div>

      {/* Main Header */}
      <div className="custom-container py-3 px-4 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden text-xl text-primary">
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
          <Link to="/" className="flex items-center">
            {settings.logo ? (
              <img src={settings.logo} alt="Logo" className="h-10 md:h-14 w-auto object-contain" />
            ) : (
              <span className="text-xl md:text-2xl font-serif font-bold text-primary truncate">Toheed's Couture</span>
            )}
          </Link>
        </div>

        {/* Center: Search Bar (Hidden on Mobile, shown in menu) */}
        <div className="hidden lg:flex flex-1 max-w-md items-center border border-gray-300 rounded-full overflow-hidden">
          <input type="text" placeholder="I'm shopping for..." className="px-4 py-2 w-full outline-none text-sm" />
          <button className="bg-primary text-white px-5 py-2 hover:bg-green-800"><FaSearch /></button>
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3 md:gap-6 text-gray-700">
          {user ? (
            <div className="relative group hidden sm:block">
              <span className="cursor-pointer flex items-center gap-1 font-semibold text-sm capitalize"><FaUser /> {user.name.split(' ')[0]}</span>
              <div className="absolute right-0 top-full bg-white shadow-xl p-2 rounded border hidden group-hover:block w-32">
                {user.isAdmin && <Link to="/admin" className="block p-2 hover:bg-gray-100 text-sm text-primary font-bold">Admin</Link>}
                <button onClick={logout} className="block w-full text-left p-2 hover:bg-gray-100 text-sm text-red-500">Logout</button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-1 text-sm font-semibold"><FaUser className="text-lg" /></Link>
          )}
          
          <Link to="/cart" className="flex items-center relative">
            <FaShoppingCart className="text-2xl text-primary" />
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
                {cart.reduce((acc, item) => acc + item.qty, 0)}
            </span>
          </Link>
        </div>
      </div>

      {/* Navigation - Responsive Menu */}
      <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block bg-primary text-white overflow-hidden transition-all duration-300`}>
        <div className="custom-container flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-8 py-2 lg:py-3 px-4 text-sm font-medium uppercase tracking-wider">
          {/* Mobile Only Search */}
          <div className="lg:hidden flex mb-4 border border-white/30 rounded-lg overflow-hidden">
            <input type="text" placeholder="Search..." className="bg-white/10 px-3 py-2 w-full outline-none text-white placeholder:text-white/50" />
            <button className="px-4"><FaSearch /></button>
          </div>
          
          <Link to="/" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400 border-b lg:border-0 border-white/10">Home</Link>
          <Link to="/?cat=stitch" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400 border-b lg:border-0 border-white/10">Stitch</Link>
          <Link to="/?cat=unstitch" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400 border-b lg:border-0 border-white/10">Unstitch</Link>
          <Link to="/?cat=bridal" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400 border-b lg:border-0 border-white/10">Bridal</Link>
          <Link to="/?cat=perfumes" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400 border-b lg:border-0 border-white/10">Perfumes</Link>
          <Link to="/?cat=handbags" onClick={()=>setIsMenuOpen(false)} className="py-2 hover:text-yellow-400">Handbags</Link>
          
          {user?.isAdmin && <Link to="/admin" className="lg:hidden py-2 text-yellow-400 font-bold uppercase">Admin Panel</Link>}
          {user && <button onClick={logout} className="lg:hidden py-2 text-left text-red-300">Logout</button>}
        </div>
      </nav>
    </header>
  );
};

export default Header;