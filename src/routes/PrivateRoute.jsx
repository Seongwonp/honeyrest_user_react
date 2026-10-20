import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// 비로그인이면 /login 으로. 원래 경로는 state.redirectTo 로 넘겨 로그인 후 돌아온다
function PrivateRoute({ children }) {
    const { isLoggedIn, isLoadingUser } = useAuth();
    const location = useLocation();

    if (isLoadingUser) {
        return null; // 또는 로딩 스피너
    }

    return isLoggedIn
        ? children
        : <Navigate to="/login" replace state={{ redirectTo: `${location.pathname}${location.search}` }} />;
}

export default PrivateRoute;
