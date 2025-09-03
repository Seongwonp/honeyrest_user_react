import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import Header from '@/components/Header';
import { FaUnlockAlt } from 'react-icons/fa';

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { request, isLoading } = useApiRequest();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        if (!email.trim()) return;

        try {
            await request(
                {
                    method: 'POST',
                    url: '/api/password-reset/request',
                    data: { email },
                },
                {
                    label: 'resetPassword',
                    errorMessage: '존재하지 않는 이메일입니다.',
                    onSuccess: () => {
                        Swal.fire({
                            title: '이메일을 확인해주세요',
                            text: '비밀번호 재설정 링크가 발송되었습니다.',
                            icon: 'success',
                            confirmButtonText: '확인',
                            confirmButtonColor: '#FDD835',
                        }).then(() => navigate('/login'));
                    },
                }
            );
        } catch (err) {
            console.error('비밀번호 초기화 요청 실패:', err);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-center text-gray-800 flex items-center justify-center gap-2">
                        <FaUnlockAlt className="text-yellow-500" />
                        비밀번호 재설정 요청
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">이메일 주소</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            {submitted && !email.trim() && (
                                <p className="text-red-500 text-sm mt-1">이메일을 입력해주세요.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading('resetPassword')}
                            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg transition ${isLoading('resetPassword') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading('resetPassword') ? '처리 중...' : '비밀번호 초기화 메일 보내기'}
                        </button>
                    </form>

                    <p className="text-sm text-center text-gray-600 mt-4">
                        로그인 페이지로 돌아가기{' '}
                        <span
                            className="text-blue-600 hover:underline cursor-pointer"
                            onClick={() => navigate('/login')}
                        >
                            로그인
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;