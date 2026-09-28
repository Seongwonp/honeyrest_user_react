import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * 비로그인 전용 라우트: 진입 시점에 이미 로그인 상태면 403 으로 보낸다.
 * - AuthProvider 공유 상태를 쓰므로, 로그인 페이지에서 로그인에 성공하는 순간 user 가 채워진다.
 *   이때 곧바로 403 으로 튕기지 않도록 "진입 시점"의 로그인 여부만 판단한다.
 *   (로그인 후 이동은 각 페이지가 직접 처리)
 */
function PublicRoute({ children }) {
    const { isLoggedIn, isLoadingUser } = useAuth();
    const [loggedInOnEnter] = useState(isLoggedIn);

    if (isLoadingUser) {
        return null;
    }

    return loggedInOnEnter ? <Navigate to="/error/403" replace /> : children;
}

export default PublicRoute;
