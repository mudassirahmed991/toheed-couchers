import React, { useContext } from 'react';
import { GlobalContext } from '../App';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { settings } = useContext(GlobalContext);

  return (
    <footer className="bg-gray-900 text-white py-12 mt-10">
      <div className="custom-container grid md:grid-cols-3 gap-8 text-center md:text-left">
        
        {/* Column 1: About */}
        <div>
          <h3 className="text-2xl font-serif font-bold mb-4 text-green-400">
            {settings.websiteName || "Toheed'sCouchers"}
          </h3>
          <p className="text-gray-400 leading-relaxed text-sm pr-4">
            {settings.aboutUsText || "Empowering women entrepreneurs of Pakistan by providing a trusted marketplace."}
          </p>
        </div>

        {/* Column 2: Quick Links (Dynamic) */}
        <div>
          <h3 className="text-xl font-bold mb-4">Quick Links</h3>
          <ul className="text-gray-400 space-y-2">
            {settings.quickLinks && settings.quickLinks.length > 0 ? (
                settings.quickLinks.map((link, index) => (
                    <li key={index}>
                        <Link to={link.url} className="hover:text-green-400 transition">{link.title}</Link>
                    </li>
                ))
            ) : (
                <>
                    <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
                    <li><Link to="/cart" className="hover:text-green-400 transition">My Cart</Link></li>
                </>
            )}
          </ul>
        </div>

        {/* Column 3: Contact (Dynamic) */}
        <div>
          <h3 className="text-xl font-bold mb-4">Contact Us</h3>
          <div className="text-gray-400 space-y-2">
            <p className="flex items-start justify-center md:justify-start gap-2">
                <i className="fa-solid fa-location-dot mt-1 text-green-500"></i>
                <span>{settings.address || "Multan Road, Lahore"}</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
                <i className="fa-solid fa-phone text-green-500"></i>
                <span>{settings.contactPhone || "+92 345 9119770"}</span>
            </p>
            <p className="flex items-center justify-center md:justify-start gap-2">
                <i className="fa-solid fa-envelope text-green-500"></i>
                <span>{settings.contactEmail || "info@example.com"}</span>
            </p>
          </div>
        </div>

      </div>
      
      <div className="text-center mt-12 border-t border-gray-800 pt-6 text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} {settings.websiteName}. All Rights Reserved.
      </div>
    </footer>
  );
};
export default Footer;