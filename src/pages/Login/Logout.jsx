import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/api/axios';

function Logout() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [showMessage, setShowMessage] = useState(true);
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        const performLogout = async () => {
            if (hasLoggedOut.current) return;
            hasLoggedOut.current = true;

            const rawUser =
                localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
            const userInfo = rawUser ? JSON.parse(rawUser) : {};
            const provider = userInfo?.provider;

            try {
                await api.post('/api/auth/logout');
                console.log('[Logout] ✅ 서버 로그아웃 완료');
            } catch (err) {
                console.error('[Logout] ❌ 서버 로그아웃 실패:', err);
            }

            logout(); // 클라이언트 상태 초기화

            toast.dismiss();
            toast.success('로그아웃되었습니다 👋', {
                position: 'top-center',
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: false,
            });

            if (provider === 'kakao') {
                const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
                const LOGOUT_REDIRECT_URI = 'http://localhost:5173/login';
                window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
                return;
            }

            setTimeout(() => {
                setShowMessage(false);
                navigate('/');
            }, 2000);
        };

        performLogout();
    }, [navigate, logout]);

    return (
        showMessage && (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        로그아웃되었습니다 👋
                    </h2>
                    <p className="text-sm text-gray-500">
                        잠시 후 메인 페이지로 이동합니다...
                    </p>
                </div>
            </div>
        )
    );
}

export default Logout;