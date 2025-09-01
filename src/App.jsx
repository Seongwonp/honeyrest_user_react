import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from "./ScrollToTop.jsx";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {toast} from "react-toastify"; // 로그인 정보 가져오는 훅

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        // AccessToken 만료 타이머 설정
        const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const exp = payload.exp * 1000; // JWT 만료 시간 (ms)
                const now = Date.now();
                const timeout = exp - now;

                if (timeout > 0) {
                    const timer = setTimeout(() => {
                        toast.info('세션이 만료되어 자동 로그아웃되었습니다.');
                        navigate('/logout'); // 로그아웃 페이지로 이동
                    }, timeout);

                    return () => clearTimeout(timer);
                }
            } catch (err) {
                console.error('[GlobalGuard] ❌ JWT 파싱 실패:', err);
            }
        }

        const searchParams = new URLSearchParams(location.search);
        const userIdFromUrl = searchParams.get('userId');
        if (userIdFromUrl && user?.id && userIdFromUrl !== String(user.id)) {
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