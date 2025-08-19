import { Link, useNavigate } from 'react-router-dom';
import { FaCreditCard } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const PaymentErrorPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div style={{
            backgroundColor: '#ffffff',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem',
            fontFamily: 'Apple SD Gothic Neo, sans-serif'
        }}>
            <div data-aos="zoom-in" style={{ fontSize: '2.8rem', fontWeight: 'bold', color: '#8E24AA' }}>
                결제 실패
            </div>
            <div
                data-aos="zoom-in"
                style={{
                    backgroundColor: '#F3E5F5',
                    borderRadius: '50%',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginTop: '0.5rem',
                    animation: 'shake 1.2s infinite'
                }}
            >
                <FaCreditCard size={100} color="#8E24AA" />
            </div>
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                결제에 실패했습니다 💳
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                카드 정보가 올바르지 않거나 결제가 거절되었습니다.<br />
                다시 시도하거나 다른 결제 수단을 이용해주세요.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link to="/" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#8E24AA',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-home">홈으로 돌아가기</Link>
                <button onClick={() => navigate(-1)} style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#CE93D8',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-back">결제 페이지로 이동</button>
            </div>

            <style>
                {`
                @keyframes shake {
                    0% { transform: rotate(0deg); }
                    25% { transform: rotate(3deg); }
                    50% { transform: rotate(-3deg); }
                    75% { transform: rotate(3deg); }
                    100% { transform: rotate(0deg); }
                }

                .hover-home:hover {
                    background-color: #6A1B9A !important;
                }

                .hover-back:hover {
                    background-color: #BA68C8 !important;
                }
                `}
            </style>
        </div>
    );
};

export default PaymentErrorPage;