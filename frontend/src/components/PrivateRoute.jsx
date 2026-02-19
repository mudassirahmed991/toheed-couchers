import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../App';

const PrivateRoute = ({ children, adminOnly }) => {
  const { user } = useContext(GlobalContext);

  if (!user) return <Navigate to="/login" />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" />;

  return children;
};
export default PrivateRoute;