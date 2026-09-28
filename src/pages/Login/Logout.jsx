import { useEffect, useState, useRef } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';
import api from '@/api/axios';
import { getOAuthRedirectBase } from '@/config/urls';

function Logout() {
    const navigate = useNavigate();
    const { user, isLoggedIn, logout } = useAuth();
    // 진입 시점의 로그인 여부 (비로그인 진입은 기존 PrivateRoute 와 동일하게 401 처리)
    // logout() 이후 상태가 바뀌어도 안내 메시지·카카오 로그아웃 흐름이 끊기지 않도록 최초 값만 사용
    const [loggedInOnEnter] = useState(isLoggedIn);
    const [showMessage, setShowMessage] = useState(true);
    const hasLoggedOut = useRef(false);

    useEffect(() => {
        const performLogout = async () => {
            if (!loggedInOnEnter || hasLoggedOut.current) return;
            hasLoggedOut.current = true;

            // logout() 이전에 공유 인증 상태에서 로그인 제공자를 확보
            const provider = user?.provider;

            try {
                await api.post('/api/auth/logout');
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
                const LOGOUT_REDIRECT_URI = encodeURIComponent(`${getOAuthRedirectBase()}/login`);
                window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
                return;
            }

            setTimeout(() => {
                setShowMessage(false);
                navigate('/');
            }, 2000);
        };

        performLogout();
        // hasLoggedOut ref 로 1회만 실행되므로 user 변경으로 재실행돼도 무방
    }, [navigate, logout, user, loggedInOnEnter]);

    if (!loggedInOnEnter) {
        return <Navigate to="/error/401" replace />;
    }

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