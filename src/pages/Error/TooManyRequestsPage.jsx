import { Link } from 'react-router-dom';
import { FaClock } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const TooManyRequestsPage = () => {


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
            <div data-aos="zoom-in" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#F57C00' }}>
                429
            </div>
            <div
                data-aos="zoom-in"
                style={{
                    backgroundColor: '#FFF3E0',
                    borderRadius: '50%',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginTop: '0.5rem',
                    animation: 'shake 1.2s infinite'
                }}
            >
                <FaClock size={100} color="#F57C00" />
            </div>
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                요청이 너무 많습니다 ⏱️
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                서버가 요청을 처리할 수 없습니다.<br />
                잠시 후 다시 시도해주세요.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#F57C00',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-home">홈으로 돌아가기</Link>
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
                    background-color: #EF6C00 !important;
                }
                `}
            </style>
        </div>
    );
};

export default TooManyRequestsPage;