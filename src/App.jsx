import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from './ScrollToTop.jsx';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import { getAccessToken, refreshAccessToken } from '@/api/axios';
import { AuthProvider } from '@/context/AuthContext.jsx';
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

    // 만료 타이머는 언마운트 시에만 정리 (재발급 결과를 기다리는 동안 effect 재실행과 무관하게 유지)
    const expiryTimerRef = useRef(null);
    useEffect(() => () => clearTimeout(expiryTimerRef.current), []);

    // 앱 최초 마운트 시 1회: 토큰 재발급 + 만료 타이머
    // - 재발급은 axios.js 의 refreshAccessToken() 을 사용 → 응답 인터셉터의 401 처리와
    //   같은 in-flight Promise 를 공유하므로 서버 재발급 요청은 한 번만 나간다.
    // - 만료 타이머는 재발급으로 받은 새 토큰의 exp 기준으로 건다.
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
        // logout·syncUserFromServer는 AuthProvider에서 useCallback으로 고정된 참조 → 마운트 시 1회만 실행
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
                {/* 인증 상태는 앱 전체에서 하나의 Provider 로 공유 */}
                <AuthProvider>
                    <GlobalGuard />
                </AuthProvider>
            </ErrorBoundary>
        </BrowserRouter>
    );
}

export default App;
