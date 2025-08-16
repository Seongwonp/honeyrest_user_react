import Header from './Header';
import Footer from './Footer';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { attachErrorInterceptor } from '../api/axios'; // 경로 확인

function Layout() {
    const navigate = useNavigate();

    useEffect(() => {
        attachErrorInterceptor(navigate);
    }, [navigate]);

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;