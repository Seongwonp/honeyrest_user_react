import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

function Login() {
    return (
        <div className="bg-[#FFF9C4] min-h-screen flex items-center justify-center px-4">
            <div
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
                data-aos="zoom-in"
            >
                {/* 타이틀 */}
                <h2 className="text-2xl font-bold text-[#4B5563] mb-6 text-center">
                    HoneyRest 로그인 🍯
                </h2>

                {/* 이메일 입력 */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                </div>

                {/* 비밀번호 입력 */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">비밀번호</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />
                </div>

                {/* 로그인 버튼 */}
                <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-2 rounded-md transition flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faLock} />
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
                    {/* 카카오 로그인 - 이미지 아이콘 사용 */}
                    <button className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-yellow-300 text-black font-semibold py-2 rounded-md transition">
                        <img src="/icons/kakao.svg" alt="Kakao" className="w-5 h-5" />
                        카카오로 로그인
                    </button>

                    {/* 구글 로그인 */}
                    <button className="w-full flex items-center justify-center gap-2 bg-white border hover:bg-gray-100 text-gray-700 font-semibold py-2 rounded-md transition">
                        <FontAwesomeIcon icon={faGoogle} />
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