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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      setUser(data);
      toast.success('Login Successful');
      navigate(data.isAdmin ? '/admin' : '/');
    } catch (err) {
      toast.error('Invalid Credentials');
    }
  };

  return (
    <div className="flex justify-center items-center h-[70vh]">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-primary">Login</h2>
        <input className="w-full border p-2 mb-4 rounded" type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-6 rounded" type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-primary text-white py-2 rounded font-bold hover:bg-green-800">Sign In</button>
        <div className="mt-4 text-center text-sm">
          <p>Admin? (admin@example.com / 123456)</p>
        </div>
      </form>
    </div>
  );
};
export default Login;