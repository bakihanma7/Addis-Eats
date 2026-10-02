import { Navigate } from 'react-router-dom';
import { useAdminAuth } from './useAdminAuth.js';

export function RequireAdmin({ children }) {
  const { admin } = useAdminAuth();

  if (!admin) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
}

export default RequireAdmin;
