import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * 로그인 전용 라우트: 비로그인 상태면 로그인 페이지로 보낸다.
 * - 원래 가려던 경로를 state.redirectTo 로 넘겨, 로그인 성공 후 Login 이 그 경로로 되돌려 보낸다.
 */
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
