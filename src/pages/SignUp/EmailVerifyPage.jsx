import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import api from '@/api/axios';
import { FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import StatusPanel from '@/components/ui/StatusPanel.jsx';
import Button from '@/components/ui/Button.jsx';

const EmailVerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('이메일 인증 중입니다...');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const hasFetched = useRef(false);

    useEffect(() => {
        if (token && !hasFetched.current) {
            hasFetched.current = true;
            api.get(`/api/user/email/verify?token=${token}`)
                .then(() => {
                    setMessage('이메일 인증이 완료되었습니다!');
                    setStatus('success');
                })
                .catch(err => {
                    const msg = err.response?.data?.message || '인증 중 오류가 발생했습니다.';
                    setMessage(msg);
                    setStatus('error');
                });
        } else if (!token) {
            setMessage('토큰이 없습니다.');
            setStatus('error');
        }
        // token은 URL 쿼리값이라 페이지 내에서 고정, hasFetched ref로 중복 요청 방지
    }, [token]);

    // 상태별 아이콘 / 톤 / 라벨
    const icon = status === 'error'
        ? <FaExclamationCircle />
        : status === 'success'
            ? <FaCheckCircle />
            : <div className="w-10 h-10 border-4 border-honey-yellow/20 border-t-honey-yellow rounded-full animate-spin" />;
    const tone = status === 'error' ? 'red' : status === 'success' ? 'green' : 'honey';
    const eyebrow = status === 'error' ? 'Verification Failed' : status === 'success' ? 'Verified' : 'Verifying';

    return (
        <div className="min-h-screen bg-off-white flex items-center justify-center">
            <StatusPanel
                role={status === 'error' ? 'alert' : 'status'}
                icon={icon}
                tone={tone}
                eyebrow={eyebrow}
                title={message}
                actions={
                    <Button onClick={() => window.location.href = '/'}>
                        홈으로 돌아가기
                    </Button>
                }
            />
        </div>
    );
};

export default EmailVerifyPage;
