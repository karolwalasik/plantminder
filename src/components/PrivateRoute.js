import { Navigate } from 'react-router-dom';
import { useUser } from './UserContext';

function PrivateRoute({ children }) {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default PrivateRoute;