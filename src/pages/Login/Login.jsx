import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import logo from '/src/assets/images/logo-Photoroom.png';
import { FaLock } from 'react-icons/fa';
import Header from "../../components/Header.jsx";
import KakaoLoginButton from "./kakao/KaKaoLoginButton.jsx";
import GoogleLoginButton from "./google/GoogleLoginButton.jsx";
import useApiRequest from '../../api/useApiRequest';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { request, isLoading } = useApiRequest();

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&` +
        `client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=http://localhost:5173/login/kakao/callback&prompt=login`;

    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&` +
        `redirect_uri=http://localhost:5173/login/google/callback&` +
        `response_type=code&scope=openid%20email%20profile&prompt=select_account`;

    const handleLogin = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!email.trim() || !password.trim()) return;

        try {
            await request(
                {
                    method: 'POST',
                    url: '/api/auth/login',
                    data: { email, password },
                    skipRedirect: true,
                },
                {
                    label: 'login',
                    errorMessage: '이메일 또는 비밀번호가 올바르지 않습니다.',
                    onSuccess: (res) => {
                        const { accessToken, user } = res;

                        const userWithProvider = { ...user, provider: 'local' };
                        const storage = autoLogin ? localStorage : sessionStorage;
                        storage.setItem('accessToken', accessToken);
                        storage.setItem('userInfo', JSON.stringify(userWithProvider));

                        Swal.fire({
                            title: `${user.name}님 환영합니다!`,
                            text: 'HoneyRest에 오신 것을 환영해요 🍯',
                            icon: 'success',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#FDD835',
                        }).then(() => {
                            navigate('/');
                        });
                    },
                    onError: (err) => {
                        if (err.response?.status === 401) {
                            console.log("ERROR 401");
                        }
                    },
                }
            );
            // eslint-disable-next-line no-unused-vars
        } catch (err) { /* empty */ }
    };

    const handleKakaoLogin = () => {
        window.location.href = KAKAO_AUTH_URL;
    };

    const handleGoogleLogin = () => {
        window.location.href = GOOGLE_AUTH_URL;
    };

    return (
        <>
            <Header />
            <div className="bg-white h-screen flex flex-col">
                <div className="flex-grow flex items-start justify-center pt-20 px-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md overflow-hidden" data-aos="zoom-in">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="logo" className="h-16" />
                        </div>

                        <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
                            HoneyRest 로그인 🍯
                        </h2>

                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">이메일</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                />
                                {submitted && !email.trim() && (
                                    <p className="text-red-500 text-sm mt-1">이메일을 입력해주세요.</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                                />
                                {submitted && !password.trim() && (
                                    <p className="text-red-500 text-sm mt-1">비밀번호를 입력해주세요.</p>
                                )}
                            </div>

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input
                                    type="checkbox"
                                    checked={autoLogin}
                                    onChange={(e) => setAutoLogin(e.target.checked)}
                                />
                                자동 로그인
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading('login')}
                                className={`w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2 ${isLoading('login') ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <FaLock />
                                {isLoading('login') ? '로그인 중...' : '로그인'}
                            </button>
                        </form>

                        <div className="my-6 flex items-center">
                            <hr className="flex-grow border-gray-300" />
                            <span className="mx-3 text-sm text-gray-500">또는</span>
                            <hr className="flex-grow border-gray-300" />
                        </div>

                        <div className="space-y-3">
                            <KakaoLoginButton onClick={handleKakaoLogin} />
                            <GoogleLoginButton onClick={handleGoogleLogin} />
                        </div>

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