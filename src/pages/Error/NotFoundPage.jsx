import { Link } from 'react-router-dom';
import { FaQuestionCircle } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const NotFoundPage = () => {
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
            <FaQuestionCircle size={80} color="#F57C00" data-aos="zoom-in" />
            <h2 data-aos="fade-up">페이지를 찾을 수 없습니다 😢</h2>
            <Link to="/" style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#F57C00',
                color: '#fff',
                borderRadius: '5px',
                textDecoration: 'none'
            }} data-aos="fade-up">홈으로 돌아가기</Link>
        </div>
    );
};

export default NotFoundPage;