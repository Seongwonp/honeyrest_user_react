import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const BadRequestPage = () => {
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
            <FaExclamationTriangle size={80} color="#FF5722" data-aos="zoom-in" />
            <h2 data-aos="fade-up">잘못된 요청입니다 ⚠️</h2>
            <Link to="/" style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#FF5722',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none'
            }} data-aos="fade-up">홈으로 돌아가기</Link>
        </div>
    );
};

export default BadRequestPage;