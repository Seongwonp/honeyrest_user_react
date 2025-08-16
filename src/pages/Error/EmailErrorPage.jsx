import { Link } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const EmailErrorPage = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <div style={{
            backgroundColor: '#FFF176',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <FaEnvelopeOpenText size={80} color="#FF9800" data-aos="zoom-in" />
            <h2 data-aos="fade-up">이메일 인증에 실패했습니다 😥</h2>
            <Link to="/signup" style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#FF9800',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none'
            }} data-aos="fade-up">회원가입 페이지로 이동</Link>
        </div>
    );
};

export default EmailErrorPage;