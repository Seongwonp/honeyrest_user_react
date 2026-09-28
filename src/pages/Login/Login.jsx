import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from "react-router-dom";
import Swal from 'sweetalert2';
import { SWAL_CONFIRM_OPTIONS } from "@/config/swal";
import logo from '/images/logo-Photoroom.png';
import { FaLock } from 'react-icons/fa';
import Header from "../../components/Header.jsx";
import KakaoLoginButton from "./kakao/KaKaoLoginButton.jsx";
import GoogleLoginButton from "./google/GoogleLoginButton.jsx";
import useApiRequest from '../../api/useApiRequest';
import { useAuth } from '@/hooks/useAuth';
import { getOAuthRedirectBase } from "@/config/urls";
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import AuthCard from '@/components/ui/AuthCard.jsx';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [autoLogin, setAutoLogin] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    const { request, isLoading } = useApiRequest();
    const { syncUserFromServer } = useAuth();

    const location = useLocation();
    const redirectTo = location.state?.redirectTo || "/";
    const reservationInfo = location.state?.reservationInfo;

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

                        if (!user || !user.userId) {
                            console.error('[Login] ❌ 응답에 user 정보 없음:', user);
                            return;
                        }

                        const userWithProvider = {
                            userId: user.userId,
                            email: user.email,
                            name: user.name,
                            phone: user.phone,
                            profileImage: user.profileImage,
                            role: user.role,
                            isVerified: user.isVerified,
                            provider: 'local'
                        };

                        const storage = autoLogin ? localStorage : sessionStorage;
                        storage.setItem('accessToken', accessToken);
                        storage.setItem('userInfo', JSON.stringify(userWithProvider));
                        syncUserFromServer();

                        Swal.fire({
                            title: `${user.name}님 환영합니다!`,
                            text: 'HoneyRest에 오신 것을 환영해요 🍯',
                            icon: 'success',
                            confirmButtonText: '확인',
                            ...SWAL_CONFIRM_OPTIONS,
                        }).then(() => {
                            navigate(redirectTo, {
                                state: reservationInfo || undefined
                            });
                        });
                    },
                }
            );
        } catch (err) {
            console.error("로그인 처리 중 오류:", err);
        }
    };

    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${import.meta.env.VITE_KAKAO_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${getOAuthRedirectBase()}/login/kakao/callback`)}&prompt=login`;
    const GOOGLE_AUTH_URL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(`${getOAuthRedirectBase()}/login/google/callback`)}&response_type=code&scope=openid%20email%20profile&prompt=select_account`;

    return (
        <>
            <Header />
            <AuthCard logo={logo} eyebrow="Welcome back" title="HoneyRest 로그인">
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <Input
                            label="이메일"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            autoComplete="email"
                            aria-invalid={submitted && !email.trim() ? true : undefined}
                        />
                        {submitted && !email.trim() && (
                            <p role="alert" className="text-red-500 text-xs font-bold mt-1.5">이메일을 입력해주세요.</p>
                        )}
                    </div>

                    <div>
                        <Input
                            label="비밀번호"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            aria-invalid={submitted && !password.trim() ? true : undefined}
                        />
                        {submitted && !password.trim() && (
                            <p role="alert" className="text-red-500 text-xs font-bold mt-1.5">비밀번호를 입력해주세요.</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-500 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={autoLogin}
                                onChange={(e) => setAutoLogin(e.target.checked)}
                                className="w-4 h-4 accent-honey-yellow-dark"
                            />
                            자동 로그인
                        </label>
                        <Link
                            to="/reset-password"
                            className="text-xs font-bold text-gray-400 hover:text-leaf-green-dark transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-leaf-green/40"
                        >
                            비밀번호를 잊으셨나요?
                        </Link>
                    </div>

                    <Button type="submit" disabled={isLoading('login')} size="lg" fullWidth>
                        <FaLock />
                        {isLoading('login') ? '로그인 중...' : '로그인'}
                    </Button>
                </form>

                <div className="my-6 flex items-center">
                    <hr className="flex-grow border-gray-100" />
                    <span className="mx-3 text-[10px] font-bold text-gray-300 uppercase tracking-widest">또는</span>
                    <hr className="flex-grow border-gray-100" />
                </div>

                <div className="space-y-3">
                    <KakaoLoginButton onClick={() => window.location.href = KAKAO_AUTH_URL} />
                    <GoogleLoginButton onClick={() => window.location.href = GOOGLE_AUTH_URL} />
                </div>

                <p className="mt-8 text-sm text-center text-gray-400">
                    계정이 없으신가요?{" "}
                    <Link
                        to="/signup"
                        className="font-black text-honey-yellow-dark hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                    >
                        회원가입
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}

export default Login;
