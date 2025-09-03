import { useState, useEffect, useRef } from 'react';
import axios from '@/api/axios';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isLoadingUser, setIsLoadingUser] = useState(true);

    // 🔑 무한루프 방지용 ref
    const isSyncingRef = useRef(false);

    const loadUser = () => {
        console.log('[useAuth] 🔄 loadUser() 호출됨');
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
        if (isSyncingRef.current) return; // 🔒 이미 동기화 중이면 바로 return
        isSyncingRef.current = true;

        console.log('[useAuth] 🌐 서버에서 유저 정보 동기화 시작');

        try {
            const response = await axios.get('/api/user/info');
            const userInfo = response.data;

            if (userInfo?.userId) {
                console.log('[useAuth] ✅ 서버 응답 성공:', userInfo);
                setUser(userInfo);

                const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
                storage.setItem('userInfo', JSON.stringify(userInfo));
                console.log(`[useAuth] 💾 서버 응답 저장 완료 → ${storage === localStorage ? 'localStorage' : 'sessionStorage'}`);
            } else {
                console.log('[useAuth] ⚠️ 서버 응답에 userId 없음 → setUser(null)');
                setUser(null);
            }
        } catch (err) {
            console.error('[useAuth] ❌ 서버 요청 실패:', err);
            setUser(null);
        } finally {
            isSyncingRef.current = false; // 🔓 동기화 완료
        }
    };

    useEffect(() => {
        console.log('[useAuth] 🚀 useEffect → 초기 loadUser() 실행');
        loadUser();

        window.addEventListener('storage', loadUser);
        return () => {
            console.log('[useAuth] 🧹 storage 이벤트 제거');
            window.removeEventListener('storage', loadUser);
        };
    }, []);

    const isLoggedIn = !!user?.userId;
    return { user, isLoggedIn, isLoadingUser, loadUser, syncUserFromServer, logout };
};