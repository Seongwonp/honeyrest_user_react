import { useContext } from 'react';
import { AuthContext } from '@/context/authContextValue';

/**
 * 인증 상태 훅 — AuthProvider(src/context/AuthContext.jsx) 의 공유 값을 반환한다.
 * 반환값: { user, isLoggedIn, isLoadingUser, loadUser, syncUserFromServer, logout }
 */
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth 는 <AuthProvider> 내부에서만 사용할 수 있습니다.');
    }
    return ctx;
};
