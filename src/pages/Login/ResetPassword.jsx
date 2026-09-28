import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useNavigate, Link } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import Header from '@/components/Header';
import { FaUnlockAlt } from 'react-icons/fa';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import AuthCard from '@/components/ui/AuthCard.jsx';

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
            <AuthCard
                eyebrow="Reset Password"
                title="비밀번호 재설정 요청"
                description="가입한 이메일로 비밀번호 재설정 링크를 보내드립니다."
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Input
                            label="이메일 주소"
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

                    <Button type="submit" disabled={isLoading('resetPassword')} size="lg" fullWidth>
                        <FaUnlockAlt />
                        {isLoading('resetPassword') ? '처리 중...' : '비밀번호 초기화 메일 보내기'}
                    </Button>
                </form>

                <p className="mt-8 text-sm text-center text-gray-400">
                    로그인 페이지로 돌아가기{' '}
                    <Link
                        to="/login"
                        className="font-black text-honey-yellow-dark hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                    >
                        로그인
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}

export default ResetPassword;
