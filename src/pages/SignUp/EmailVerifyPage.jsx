import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useRef } from 'react';
import axios from 'axios';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaExclamationCircle } from 'react-icons/fa';
import verifyIcon from '/public/images/verified.gif';

const EmailVerifyPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('이메일 인증 중입니다...');
    const [status, setStatus] = useState('loading'); // loading, success, error
    const hasFetched = useRef(false);

    useEffect(() => {
        AOS.init({ duration: 800, once: true });

        if (token && !hasFetched.current) {
            hasFetched.current = true;
            axios.get(`/api/user/email/verify?token=${token}`)
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
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            {status === 'loading' && (
                <img
                    src={verifyIcon}
                    alt="로딩 중"
                    style={{ width: '100px', marginBottom: '1rem' }}
                    data-aos="fade-up"
                />
            )}

            {status === 'success' && (
                <img
                    src={verifyIcon}
                    alt="인증 성공"
                    style={{ width: '200px', marginBottom: '1rem' }}
                />
            )}

            {status === 'error' && (
                <FaExclamationCircle
                    size={80}
                    color="#F44336"
                    style={{ marginBottom: '1rem' }}
                    data-aos="zoom-in"
                />
            )}

            <h2 data-aos="zoom-in">{message}</h2>

                <button
                    onClick={() => window.location.href = '/'}
                    className="mt-4 px-6 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg shadow-md transition duration-200"
                    data-aos="fade-up"
                >
                    홈으로 돌아가기
                </button>

        </div>
    );
};

export default EmailVerifyPage;