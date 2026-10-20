import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// 비로그인 전용 라우트. 로그인 성공 직후 403 으로 튕기지 않게 진입 시점의 로그인 여부만 본다
function PublicRoute({ children }) {
    const { isLoggedIn, isLoadingUser } = useAuth();
    const [loggedInOnEnter] = useState(isLoggedIn);

    if (isLoadingUser) {
        return null;
    }

    return loggedInOnEnter ? <Navigate to="/error/403" replace /> : children;
}

export default PublicRoute;
