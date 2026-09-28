import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function PrivateRoute({ children }) {
    const { isLoggedIn, isLoadingUser } = useAuth();

    if (isLoadingUser) {
        return null; // 또는 로딩 스피너
    }

    return isLoggedIn ? children : <Navigate to="/error/401" replace />;
}

export default PrivateRoute;