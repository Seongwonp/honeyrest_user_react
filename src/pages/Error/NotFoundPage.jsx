import { Link, useNavigate } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const NotFoundPage = () => {
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
            <div data-aos="zoom-in" style={{ fontSize: '4rem', fontWeight: 'bold', color: '#FBC02D' }}>
                404
            </div>
            <FaQuestionCircle
                size={90}
                color="#FBC02D"
                data-aos="zoom-in"
                style={{ animation: 'shake 1.2s infinite', marginTop: '0.5rem' }}
            />
            <h2 data-aos="fade-up" style={{ marginTop: '1rem', fontSize: '1.8rem', color: '#4E342E' }}>
                앗! 페이지를 찾을 수 없어요!
            </h2>
            <p data-aos="fade-up" style={{ marginTop: '0.5rem', color: '#6D4C41', fontSize: '1rem' }}>
                요청하신 페이지가 존재하지 않거나 이동되었어요.
            </p>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                <Link to="/" style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#FBC02D',
                    color: '#fff',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 'bold',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                    transition: 'background-color 0.3s'
                }} data-aos="fade-up" className="hover-home">홈으로 돌아가기</Link>
                <button onClick={() => navigate(-1)} style={{
                    padding: '0.6rem 1.2rem',
                    backgroundColor: '#9E9E9E',
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
                    background-color: #F9A825 !important;
                }

                .hover-back:hover {
                    background-color: #757575 !important;
                }
                `}
            </style>
        </div>
    );
};

export default NotFoundPage;