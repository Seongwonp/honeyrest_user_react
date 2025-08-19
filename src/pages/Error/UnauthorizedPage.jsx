import { Link } from 'react-router-dom';
import { FaLock } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const UnauthorizedPage = () => {


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
            <div data-aos="zoom-in" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#1565C0' }}>
                401
            </div>
            <div
                data-aos="zoom-in"
                style={{
                    backgroundColor: '#E3F2FD',
                    borderRadius: '50%',
                    padding: '1rem',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    marginTop: '0.5rem',
                    animation: 'shake 1.2s infinite'
                }}
            >
                <FaLock size={100} color="#1565C0" />
            </div>
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                로그인이 필요합니다 🔐
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                이 페이지를 이용하려면 로그인이 필요합니다.
            </p>
            <div style={{ marginTop: '2rem' }}>
                <Link to="/login" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#1565C0',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-login">로그인 페이지로 이동</Link>
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

                .hover-login:hover {
                    background-color: #0D47A1 !important;
                }
                `}
            </style>
        </div>
    );
};

export default UnauthorizedPage;