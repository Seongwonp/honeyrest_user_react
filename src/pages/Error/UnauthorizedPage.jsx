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
            backgroundColor: '#FFF176',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <FaLock size={80} color="#1976D2" data-aos="zoom-in" />
            <h2 data-aos="fade-up">로그인이 필요합니다 🔐</h2>
            <Link to="/login" style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#1976D2',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none'
            }} data-aos="fade-up">로그인 페이지로 이동</Link>
        </div>
    );
};

export default UnauthorizedPage;