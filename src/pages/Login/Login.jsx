import React from 'react';
import { useNavigate } from "react-router-dom";
import logo from '/src/assets/images/logo-Photoroom.png';
import {FaLock} from 'react-icons/fa';
import Header from "../../components/Header.jsx";
import KakaoLoginButton from "./KaKaoLoginButton.jsx";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
function Login() {
    const navigate = useNavigate();
    const handleKakaoLogin = () => {
        try {
            console.log("카카오 로그인 시도");
            // TODO: OAuth URL로 리디렉션
            // window.location.href = KAKAO_AUTH_URL;
        } catch (error) {
            console.error("카카오 로그인 오류:", error);
        }
    };

    const handleGoogleLogin = () => {
        try {
            console.log("구글 로그인 시도");
            // TODO: OAuth URL로 리디렉션
            // window.location.href = GOOGLE_AUTH_URL;
        } catch (error) {
            console.error("구글 로그인 오류:", error);
        }
    };

    return (
        <>
            <Header/>
            <div className="bg-white h-screen flex flex-col">
                <div className="flex-grow flex items-start justify-center pt-20 px-4">
                    <div
                        className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md overflow-hidden"
                        data-aos="zoom-in"
                    >
                        {/* 로고 */}
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="logo" className="h-16"/>
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
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* 비밀번호 입력 */}
                        <div className="mb-6">
                            <label className="block text-sm text-gray-600 mb-1">비밀번호</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                        </div>

                        {/* 로그인 버튼 */}
                        <button
                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                            <FaLock/>
                            로그인
                        </button>

                        {/* 구분선 */}
                        <div className="my-6 flex items-center">
                            <hr className="flex-grow border-gray-300"/>
                            <span className="mx-3 text-sm text-gray-500">또는</span>
                            <hr className="flex-grow border-gray-300"/>
                        </div>

                        {/* 소셜 로그인 버튼 */}
                        <div className="space-y-3">
                            <KakaoLoginButton onClick={handleKakaoLogin} />
                            <GoogleLoginButton onClick={handleGoogleLogin} />
                        </div>
                        {/* 회원가입 링크 */}
                        <p className="mt-6 text-sm text-center text-gray-600">
                            계정이 없으신가요?{" "}
                            <span className="text-yellow-600 hover:underline cursor-pointer"
                                  onClick={() => navigate("/signup")}>회원가입</span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;