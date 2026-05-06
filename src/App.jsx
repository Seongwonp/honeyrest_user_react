import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from './ScrollToTop.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/api/axios';

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, syncUserFromServer } = useAuth();
    const hasRefreshed = useRef(false);
    const isLoggedOut = useRef(false);

    // 앱 최초 마운트 시 1회: 토큰 재발급 + 만료 타이머
    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        if (!accessToken || isLoggedOut.current) return;

        if (!hasRefreshed.current) {
            hasRefreshed.current = true;

            api.post('/api/auth/refresh')
                .then(res => {
                    const newAccessToken = res.data;
                    const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
                    storage.setItem('accessToken', newAccessToken);
                    syncUserFromServer();
                })
                .catch(err => {
                    console.error('[GlobalGuard] ❌ 자동 로그인 실패:', err);
                    isLoggedOut.current = true;
                    localStorage.removeItem('accessToken');
                    sessionStorage.removeItem('accessToken');
                    logout();
                    navigate('/login', { replace: true });
                });
        }

        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const timeout = payload.exp * 1000 - Date.now();

            if (timeout > 0) {
                const timer = setTimeout(() => {
                    toast.info('세션이 만료되어 자동 로그아웃되었습니다.');
                    logout();
                    navigate('/login');
                }, timeout);

                return () => clearTimeout(timer);
            }
        } catch (err) {
            console.error('[GlobalGuard] ❌ JWT 파싱 실패:', err);
        }
    }, []);

    // 라우트 이동마다: URL 파라미터 기반 접근 제어
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const userIdFromUrl = searchParams.get('userId');
        if (userIdFromUrl && user?.userId && userIdFromUrl !== String(user.userId)) {
            navigate('/error/403', { replace: true });
        }
    }, [location, user, navigate]);

    return (
        <>
            <ScrollToTop />
            <AppWrapper />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <GlobalGuard />
        </BrowserRouter>
    );
}

export default App;
