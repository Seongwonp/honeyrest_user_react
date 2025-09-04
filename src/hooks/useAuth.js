import { useState, useEffect, useRef } from 'react';
import axios from '@/api/axios';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    //무한루프 방지용 ref
    const isSyncingRef = useRef(false);

    const loadUser = () => {
        setIsLoadingUser(true);

        try {
            const rawLocal = localStorage.getItem('userInfo');
            const rawSession = sessionStorage.getItem('userInfo');

            const isValid = (v) => v && v !== 'undefined' && v !== 'null' && v.trim() !== '';
            const raw = isValid(rawSession)
                ? rawSession
                : isValid(rawLocal)
                    ? rawLocal
                    : null;

            if (!raw) {
                setUser(null);
                setIsLoadingUser(false);
                return;
            }

            const parsed = JSON.parse(raw);
            if (parsed?.userId) {
                setUser(parsed);
            } else {
                setUser(null);
            }
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoadingUser(false);
        }
    };

    const logout = () => {
        console.log('[useAuth] 🚪 로그아웃 시작');
        localStorage.removeItem('userInfo');
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('userInfo');
        sessionStorage.removeItem('accessToken');
        setUser(null);
    };

    const syncUserFromServer = async () => {
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
                console.log('[useAuth] ⚠️ 서버 응답에 userId 없음 → setUser(null)');
                setUser(null);
            }
        } catch (err) {
            console.error('[useAuth] ❌ 서버 요청 실패:', err);
            setUser(null);
        } finally {
            isSyncingRef.current = false; // 동기화 완료
        }
    };

    useEffect(() => {
        loadUser();

        window.addEventListener('storage', loadUser);
        return () => {
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    const isLoggedIn = !!user?.userId;
    return { user, isLoggedIn, isLoadingUser, loadUser, syncUserFromServer, logout };
};