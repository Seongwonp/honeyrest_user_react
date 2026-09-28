import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import axios from '@/api/axios';
import { AuthContext, AUTH_CHANGE_EVENT } from './authContextValue';

// 저장소(sessionStorage 우선 → localStorage)에서 사용자 정보를 읽어 온다.
// 값이 없거나 형식이 올바르지 않으면 null
const readStoredUser = () => {
    try {
        const rawLocal = localStorage.getItem('userInfo');
        const rawSession = sessionStorage.getItem('userInfo');

        const isValid = (v) => v && v !== 'undefined' && v !== 'null' && v.trim() !== '';
        const raw = isValid(rawSession)
            ? rawSession
            : isValid(rawLocal)
                ? rawLocal
                : null;

        if (!raw) return null;

        const parsed = JSON.parse(raw);
        return parsed?.userId ? parsed : null;
    } catch {
        return null;
    }
};

/**
 * 앱 전체에서 하나만 존재하는 인증 상태 Provider
 * - 이전에는 useAuth() 를 호출하는 컴포넌트마다 상태가 따로 생겨, 같은 탭에서 로그인/로그아웃해도
 *   다른 컴포넌트가 리마운트되기 전까지 갱신되지 않았다.
 * - 이제 모든 useAuth() 호출이 이 Provider 의 값을 공유한다. (API 는 기존 useAuth() 와 동일)
 * - 다른 탭의 변경은 'storage' 이벤트, 같은 탭의 React 밖 변경(axios 인터셉터 등)은
 *   AUTH_CHANGE_EVENT 로 동기화한다.
 */
export function AuthProvider({ children }) {
    // 첫 렌더에서 바로 저장소를 읽어 로그인 상태가 깜빡이지 않도록 지연 초기화
    const [user, setUser] = useState(readStoredUser);
    const [isLoadingUser, setIsLoadingUser] = useState(false);

    // 서버 동기화 중복 호출 방지용 ref
    const isSyncingRef = useRef(false);

    // 아래 함수들은 setState·ref·storage 만 사용하므로 useCallback 으로 참조를 고정
    // (사용하는 쪽 useEffect 의존성에 넣어도 재실행되지 않음)
    const loadUser = useCallback(() => {
        setIsLoadingUser(true);
        setUser(readStoredUser());
        setIsLoadingUser(false);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('accessToken');
        setUser(null);
    }, []);

    const syncUserFromServer = useCallback(async () => {
        if (isSyncingRef.current) return; // 이미 동기화 중이면 바로 return
        isSyncingRef.current = true;

        try {
            const response = await axios.get('/api/user/info');
            const userInfo = response.data;

            if (userInfo?.userId) {
                setUser(userInfo);

                const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
                storage.setItem('userInfo', JSON.stringify(userInfo));
            } else {
                setUser(null);
            }
        } catch (err) {
            console.error('[AuthProvider] ❌ 서버 요청 실패:', err);
            setUser(null);
        } finally {
            isSyncingRef.current = false; // 동기화 완료
        }
    }, []);

    // 다른 탭(storage) / 같은 탭 React 밖(AUTH_CHANGE_EVENT) 변경 동기화
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
        syncUserFromServer,
        logout,
    }), [user, isLoadingUser, loadUser, syncUserFromServer, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
