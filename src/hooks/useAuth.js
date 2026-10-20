import { useContext } from 'react';
import { AuthContext } from '@/context/authContextValue';

// { user, isLoggedIn, isLoadingUser, loadUser, login, syncUserFromServer, logout }
export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth 는 <AuthProvider> 내부에서만 사용할 수 있습니다.');
    }
    return ctx;
};
