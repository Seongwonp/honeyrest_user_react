import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from '@/api/axios';
import { AuthContext, AUTH_CHANGE_EVENT } from './authContextValue';
import { getUser, setSession, updateUser, clearSession } from '@/auth/authStorage';

// 앱 전체 인증 상태. 다른 탭은 'storage', 같은 탭의 React 밖 변경은 AUTH_CHANGE_EVENT 로 동기화
export function AuthProvider({ children }) {
    // 첫 렌더부터 저장소 값을 써서 로그인 상태가 깜빡이지 않게
    const [user, setUser] = useState(getUser);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    const isSyncingRef = useRef(false);

    const loadUser = useCallback(() => {
        setIsLoadingUser(true);
        setUser(getUser());
        setIsLoadingUser(false);
    }, []);

    const login = useCallback(({ token, user: nextUser, autoLogin }) => {
        setSession({ token, user: nextUser, autoLogin });
        setUser(getUser());
    }, []);

    const logout = useCallback(() => {
        clearSession();
        setUser(null);
    }, []);

    const syncUserFromServer = useCallback(async () => {
        if (isSyncingRef.current) return;
        isSyncingRef.current = true;

        try {
            const response = await axios.get('/api/user/info');
            const userInfo = response.data;

            if (userInfo?.userId) {
                updateUser(userInfo);
                setUser(getUser());
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('[AuthProvider] ❌ 서버 요청 실패:', err);
            setUser(null);
        } finally {
            isSyncingRef.current = false;
        }
    }, []);

    useEffect(() => {
        window.addEventListener('storage', loadUser);
        window.addEventListener(AUTH_CHANGE_EVENT, loadUser);
        return () => {
            window.removeEventListener('storage', loadUser);
            window.removeEventListener(AUTH_CHANGE_EVENT, loadUser);
        };
    }, [loadUser]);

    const value = useMemo(() => ({
        user,
        isLoggedIn: !!user?.userId,
        isLoadingUser,
        loadUser,
        login,
        syncUserFromServer,
        logout,
    }), [user, isLoadingUser, loadUser, login, syncUserFromServer, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
