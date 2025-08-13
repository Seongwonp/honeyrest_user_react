import React from 'react';
import logo from '/src/assets/images/logo-Photoroom.png';
import { FaLock, FaGoogle } from 'react-icons/fa';
import { HiChatBubbleLeftRight } from 'react-icons/hi2';

function Login() {
    return (
        <div className="bg-white min-h-screen flex items-center justify-center px-4">
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md" data-aos="zoom-in">

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
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
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
                    {/* 카카오 로그인 */}
                    <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-yellow-300 text-black font-medium py-2 rounded-lg transition">
                        <HiChatBubbleLeftRight className="text-2xl text-[#3C1E1E]" />
                        카카오 로그인
                    </button>

                    {/* 구글 로그인 */}
                    <button className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition">
                        <FaGoogle />
                        구글로 로그인
                    </button>
                </div>

                {/* 회원가입 링크 */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    계정이 없으신가요?{" "}
                    <span className="text-yellow-600 hover:underline cursor-pointer">회원가입</span>
                </p>
            </div>
        </div>
    );
}

export default Login;