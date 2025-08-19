import { Link } from 'react-router-dom';
import { FaTools } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const ServiceUnavailablePage = () => {

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
            <div data-aos="zoom-in" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#6D4C41' }}>
                503
            </div>
            <div
                data-aos="zoom-in"
                style={{
                    backgroundColor: '#FFCC80',
                    borderRadius: '50%',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginTop: '0.5rem',
                    animation: 'shake 1.2s infinite'
                }}
            >
                <FaTools size={100} color="#6D4C41" />
            </div>
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                서비스 이용이 일시적으로 불가능합니다 🛠️
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                현재 점검 중이거나 서버가 과부하 상태입니다.<br />
                잠시 후 다시 시도해주세요.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#6D4C41',
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
                    background-color: #5D4037 !important;
                }
                `}
            </style>
        </div>
    );
};

export default ServiceUnavailablePage;