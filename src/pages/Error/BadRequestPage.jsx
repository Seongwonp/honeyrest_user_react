import { Link, useNavigate } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const BadRequestPage = () => {
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
            <div data-aos="zoom-in" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#E64A19' }}>
                400
            </div>
            <FaExclamationTriangle
                size={90}
                color="#E64A19"
                data-aos="zoom-in"
                style={{ animation: 'shake 1.2s infinite', marginTop: '0.5rem' }}
            />
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                잘못된 요청이에요 ⚠️
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                요청이 올바르지 않습니다. 다시 시도해주세요.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link to="/" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#E64A19',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-home">홈으로 돌아가기</Link>
                <button onClick={() => navigate(-1)} style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#FFAB91',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-back">이전 페이지</button>
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
                    background-color: #D84315 !important;
                }

                .hover-back:hover {
                    background-color: #FF8A65 !important;
                }
                `}
            </style>
        </div>
    );
};

export default BadRequestPage;