import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { SWAL_CONFIRM_OPTIONS } from "@/config/swal";
import Header from '@/components/Header';
import useApiRequest from '@/api/useApiRequest';
import { FaKey } from 'react-icons/fa';

function PasswordChange() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const { request, isLoading } = useApiRequest();
    const navigate = useNavigate();

    const calculatePasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score += 1;
        if (/[A-Z]/.test(password)) score += 1;
        if (/\d/.test(password)) score += 1;
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        return score;
    };

    useEffect(() => {
        if (!token) {
            Swal.fire({
                title: '잘못된 접근입니다',
                text: '비밀번호 재설정 토큰이 유효하지 않습니다.',
                icon: 'error',
                confirmButtonText: '확인',
                ...SWAL_CONFIRM_OPTIONS,
            }).then(() => navigate('/login'));
        }
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!newPassword.trim() || !confirmPassword.trim()) return;
        if (newPassword !== confirmPassword) return;

        try {
            await request(
                {
                    method: 'POST',
                    url: '/api/password-reset/confirm',
                    data: { token, newPassword },
                },
                {
                    label: 'passwordChange',
                    errorMessage: '비밀번호 변경에 실패했습니다.',
                    onSuccess: () => {
                        Swal.fire({
                            title: '비밀번호 변경 완료',
                            text: '새 비밀번호로 로그인해주세요.',
                            icon: 'success',
                            confirmButtonText: '확인',
                            ...SWAL_CONFIRM_OPTIONS,
                        }).then(() => navigate('/login'));
                    },
                }
            );
        } catch (err) {
            console.error('비밀번호 변경 실패:', err);
        }
    };

    const strength = calculatePasswordStrength(newPassword);
    const strengthLabels = ['매우 약함', '약함', '보통', '강함'];
    const strengthColors = ['#FF4D4D', '#FFAA00', '#00AA00', '#007700'];
    const strengthIndex = strength === 0 ? 0 : strength - 1;

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
                <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-center text-gray-800 flex items-center justify-center gap-2">
                        <FaKey className="text-yellow-500" />
                        새 비밀번호 설정
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">새 비밀번호</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호 입력"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            <div className="mt-2 h-2 w-full rounded bg-gray-300">
                                <div
                                    className="h-2 rounded"
                                    style={{ width: `${(strength / 4) * 100}%`, backgroundColor: strengthColors[strengthIndex] }}
                                />
                            </div>
                            <p className="text-sm mt-1" style={{ color: strengthColors[strengthIndex] }}>
                                {newPassword ? strengthLabels[strengthIndex] : ''}
                            </p>
                            {submitted && !newPassword.trim() && (
                                <p className="text-red-500 text-sm mt-1">비밀번호를 입력해주세요.</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">비밀번호 확인</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="비밀번호 재입력"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-300"
                            />
                            {submitted && newPassword !== confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">비밀번호가 일치하지 않습니다.</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading('passwordChange')}
                            className={`w-full bg-yellow-400 hover:bg-yellow-500 text-deep-gray font-medium py-2 rounded-lg transition ${isLoading('passwordChange') ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {isLoading('passwordChange') ? '처리 중...' : '비밀번호 변경하기'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default PasswordChange;