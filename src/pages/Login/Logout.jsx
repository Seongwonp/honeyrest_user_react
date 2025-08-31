import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-toastify';

function Logout() {
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(true);
    const { loadUser } = useAuth();

    useEffect(() => {

        const rawUser =
            localStorage.getItem('userInfo') || sessionStorage.getItem('userInfo');
        const userInfo = rawUser ? JSON.parse(rawUser) : {};
        const provider = userInfo?.provider;

        // 내부 세션 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');
        sessionStorage.removeItem('accessToken');
        sessionStorage.removeItem('userInfo');

        // 토스트 중복 방지: 조건부 실행
        toast.dismiss(); // 기존 토스트 제거
        toast.success('로그아웃되었습니다 👋', {
            position: 'top-center',
            autoClose: 2000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
        });

        // 소셜 로그아웃 처리
        if (provider === 'kakao') {
            const KAKAO_CLIENT_ID = import.meta.env.VITE_KAKAO_CLIENT_ID;
            const LOGOUT_REDIRECT_URI = 'http://localhost:5173/login';
            window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${KAKAO_CLIENT_ID}&logout_redirect_uri=${LOGOUT_REDIRECT_URI}`;
            return;
        }

        //  2초 후 상태 초기화 + 메인 이동
        const timer = setTimeout(() => {
            loadUser();
            setShowMessage(false);
            navigate('/');
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigate, loadUser]);

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