import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

function PrivateRoute({ children }) {
    const { isLoggedIn, isLoadingUser } = useAuth();

    if (isLoadingUser) {
        console.log('[PrivateRoute] ⏳ 유저 정보 로딩 중...');
        return null; // 또는 로딩 스피너
    }

    console.log('[PrivateRoute] 🔐 로그인 상태:', isLoggedIn);
    return isLoggedIn ? children : <Navigate to="/error/401" replace />;
}

export default PrivateRoute;