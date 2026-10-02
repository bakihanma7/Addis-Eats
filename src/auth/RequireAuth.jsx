import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth.js';

export function RequireAuth({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/signin" replace state={{ from: location.pathname + location.search }} />;
  }
  return children;
}

export default RequireAuth;
