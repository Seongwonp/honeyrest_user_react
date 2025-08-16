import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Logout() {
    const navigate = useNavigate();
    const [showMessage, setShowMessage] = useState(true);

    useEffect(() => {
        // 토큰 및 사용자 정보 제거
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userInfo');

        // 1.5초 후 로그인 페이지로 이동
        const timer = setTimeout(() => {
            setShowMessage(false);
            navigate('/login');
        }, 1500);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        showMessage && (
            <div className="h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        로그아웃되었습니다 👋
                    </h2>
                    <p className="text-sm text-gray-500">
                        잠시 후 로그인 페이지로 이동합니다...
                    </p>
                </div>
            </div>
        )
    );
}

export default Logout;