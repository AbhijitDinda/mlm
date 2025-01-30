import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { APP_PATH } from '../routes/paths';

// ----------------------------------------------------------------------

export default function GuestGuard({ children }:{children:React.ReactNode}) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={APP_PATH.dashboard} />;
  }
  return <>{children}</>;
}
