import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from './ScrollToTop.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/api/axios';
import ErrorBoundary from './components/ErrorBoundary.jsx';

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, syncUserFromServer } = useAuth();
    const hasRefreshed = useRef(false);
    const isLoggedOut = useRef(false);

    // navigate는 라우트 이동 시 참조가 바뀔 수 있으므로 ref로 최신값을 보관
    // (최초 1회 effect가 라우트 이동마다 재실행되지 않도록)
    const navigateRef = useRef(navigate);
    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

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
                    navigateRef.current('/login', { replace: true });
                });
        }

        try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            const timeout = payload.exp * 1000 - Date.now();

            if (timeout > 0) {
                const timer = setTimeout(() => {
                    toast.info('세션이 만료되어 자동 로그아웃되었습니다.');
                    logout();
                    navigateRef.current('/login');
                }, timeout);

                return () => clearTimeout(timer);
            }
        } catch (err) {
            console.error('[GlobalGuard] ❌ JWT 파싱 실패:', err);
        }
        // logout·syncUserFromServer는 useAuth에서 useCallback으로 고정된 참조 → 마운트 시 1회만 실행
    }, [logout, syncUserFromServer]);

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
            <ErrorBoundary>
                <GlobalGuard />
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
