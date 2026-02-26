import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../App';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Note: Make sure backend URL is correct (localhost or render link)
      // Hum relative path use kar rahe hain agar proxy set hai, warna full domain use karein
      const baseUrl = 'https://toheedcouture.com'; // Ya aapka Render Link
      
      const { data } = await axios.post(`${baseUrl}/api/users/login`, { email, password });
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success(`Welcome back, ${data.name}!`);
      
      if(data.isAdmin) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error('Invalid Email or Password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-[80vh] bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-xl w-96 border border-gray-200">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-serif font-bold text-primary">Sign In</h2>
            <p className="text-gray-500 text-sm mt-2">Welcome to Toheed's Couture</p>
        </div>
        
        <form onSubmit={handleLogin}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">Email Address</label>
                <input 
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-primary transition" 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={e=>setEmail(e.target.value)} 
                    required
                />
            </div>
            
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                <input 
                    className="w-full border border-gray-300 p-3 rounded focus:outline-none focus:border-primary transition" 
                    type="password" 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={e=>setPassword(e.target.value)} 
                    required
                />
            </div>

            <button 
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded font-bold hover:bg-green-800 transition shadow-lg disabled:bg-gray-400"
            >
                {loading ? 'Signing In...' : 'Sign In'}
            </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          &copy; 2026 Toheed's Couture. Secure Login.
        </div>
      </div>
    </div>
  );
};

export default Login;