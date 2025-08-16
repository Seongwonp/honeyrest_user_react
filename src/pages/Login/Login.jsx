import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Swal from 'sweetalert2';
import logo from '/src/assets/images/logo-Photoroom.png';
import { FaLock } from 'react-icons/fa';
import Header from "../../components/Header.jsx";
import KakaoLoginButton from "./kakao/KaKaoLoginButton.jsx";
import GoogleLoginButton from "./google/GoogleLoginButton.jsx";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&` +
        `client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=http://localhost:5173/login/kakao/callback&prompt=login`;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=http://localhost:5173/login/google/callback&` +
        `response_type=code&` +
        `scope=openid%20email%20profile&` +
        `prompt=select_account`;

    // Axios 인터셉터: 자동 로그인용
    useEffect(() => {
        axios.interceptors.request.use(config => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });
    }, []);

    const handleLogin = async () => {
        try {
            const res = await axios.post('/api/auth/login', { email, password });
            const { accessToken, user } = res.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('userInfo', JSON.stringify(user));
            setError(null);

            Swal.fire({
                title: `${user.name}님 환영합니다!`,
                text: 'HoneyRest에 오신 것을 환영해요 🍯',
                icon: 'success',
                confirmButtonText: '확인',
                confirmButtonColor: '#FDD835',
            }).then(() => {
                navigate('/');
            });
        } catch (err) {
            setError(err.response?.data?.message || '로그인 실패');
        }
    };

    const handleKakaoLogin = () => {
        console.log("카카오 로그인 시도");
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleGoogleLogin = () => {
        console.log("구글 로그인 시도");
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <>
            <Header />
            <div className="bg-white h-screen flex flex-col">
                <div className="flex-grow flex items-start justify-center pt-20 px-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md overflow-hidden" data-aos="zoom-in">
                        {/* 로고 */}
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="logo" className="h-16" />
                        </div>

                        {/* 타이틀 */}
                        <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
                            HoneyRest 로그인 🍯
                        </h2>

                        {/* 이메일 입력 */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">이메일</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* 에러 메시지 */}
                        {error && (
                            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
                        )}

                        {/* 로그인 버튼 */}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                        >
                            <FaLock />
                            로그인
                        </button>

                        {/* 구분선 */}
                        <div className="my-6 flex items-center">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-3 text-sm text-gray-500">또는</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        {/* 소셜 로그인 버튼 */}
                        <div className="space-y-3">
                            <KakaoLoginButton onClick={handleKakaoLogin} />
                            <GoogleLoginButton onClick={handleGoogleLogin} />
                        </div>

                        {/* 회원가입 링크 */}
                        <p className="mt-6 text-sm text-center text-gray-600">
                            계정이 없으신가요?{" "}
                            <span
                                className="text-yellow-600 hover:underline cursor-pointer"
                                onClick={() => navigate("/signup")}
                            >
                                회원가입
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;