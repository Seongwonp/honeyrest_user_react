import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from './ScrollToTop.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { refreshAccessToken } from '@/api/axios';
import { getAccessToken } from '@/auth/authStorage';
import { AuthProvider } from '@/context/AuthContext.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import DemoBanner from './components/DemoBanner.jsx';
import { IS_DEMO } from '@/config/demo';

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, syncUserFromServer } = useAuth();
    const hasRefreshed = useRef(false);
    const isLoggedOut = useRef(false);

    // navigate 참조가 바뀌어도 최초 1회 effect 가 다시 돌지 않게 ref 로 보관
    const navigateRef = useRef(navigate);
    useEffect(() => {
        navigateRef.current = navigate;
    }, [navigate]);

    // 만료 타이머는 언마운트 시에만 정리
    const expiryTimerRef = useRef(null);
    useEffect(() => () => clearTimeout(expiryTimerRef.current), []);

    // 앱 최초 마운트 시 1회: 토큰 재발급 + 만료 타이머
    // 재발급은 인터셉터와 같은 Promise 를 공유하고, 타이머는 새 토큰 exp 기준
    useEffect(() => {
        const accessToken = getAccessToken();

        if (!accessToken || isLoggedOut.current || hasRefreshed.current) return;
        hasRefreshed.current = true;

        const scheduleExpiryLogout = (token) => {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const timeout = payload.exp * 1000 - Date.now();

                if (timeout > 0) {
                    expiryTimerRef.current = setTimeout(() => {
                        toast.info('세션이 만료되어 자동 로그아웃되었습니다.');
                        logout();
                        navigateRef.current('/login');
                    }, timeout);
                }
            } catch (err) {
                console.error('[GlobalGuard] ❌ JWT 파싱 실패:', err);
            }
        };

        refreshAccessToken()
            .then(newAccessToken => {
                syncUserFromServer();
                scheduleExpiryLogout(newAccessToken);
            })
            .catch(err => {
                console.error('[GlobalGuard] ❌ 자동 로그인 실패:', err);
                isLoggedOut.current = true;
                logout();
                navigateRef.current('/login', { replace: true });
            });
        // 의존성은 모두 고정 참조라 마운트 시 1회만 실행
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
            {IS_DEMO && <DemoBanner />}
            <AppWrapper />
        </>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ErrorBoundary>
                <AuthProvider>
                    <GlobalGuard />
                </AuthProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
