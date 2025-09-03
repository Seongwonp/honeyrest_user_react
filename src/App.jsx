import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from './ScrollToTop.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/api/axios';

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, syncUserFromServer } = useAuth();
    const hasRefreshed = useRef(false); // refresh 1회 실행 여부
    const isLoggedOut = useRef(false);   // 로그아웃 상태 표시

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const accessToken = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

        // 로그아웃 상태면 refresh 금지
        if (!accessToken || hasRefreshed.current || isLoggedOut.current) return;

        hasRefreshed.current = true;

        // 자동 로그인(refresh)
        api.post('/api/auth/refresh')
            .then(res => {
                const newAccessToken = res.data;
                const storage = localStorage.getItem('accessToken') ? localStorage : sessionStorage;
                storage.setItem('accessToken', newAccessToken);
                toast.success('로그인되었습니다!');
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

        // AccessToken 만료 타이머
        if (accessToken) {
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const exp = payload.exp * 1000;
                const now = Date.now();
                const timeout = exp - now;

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
        }

        // URL 파라미터 기반 접근 제어
        const searchParams = new URLSearchParams(location.search);
        const userIdFromUrl = searchParams.get('userId');
        if (userIdFromUrl && user?.userId && userIdFromUrl !== String(user.userId)) {
            navigate('/error/403', { replace: true });
        }
    }, [location, navigate, logout, syncUserFromServer]);

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