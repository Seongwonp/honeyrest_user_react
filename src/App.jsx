import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom';
import AppWrapper from './AppWrapper';
import ScrollToTop from "./ScrollToTop.jsx";
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth'; // 로그인 정보 가져오는 훅

function GlobalGuard() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        const searchParams = new URLSearchParams(location.search);
        const userIdFromUrl = searchParams.get('userId');
        if (userIdFromUrl && user?.id && userIdFromUrl !== String(user.id)) {
            navigate('/error/403', { replace: true });
        }
    }, [location, user]);

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