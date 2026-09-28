import Header from './Header';
import Footer from './Footer';
import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import PageLoader from './PageLoader';

function Layout() {

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow w-full">
                {/* 지연 로딩 페이지 로딩 중에도 헤더/푸터는 유지 */}
                <Suspense fallback={<PageLoader />}>
                    <Outlet />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default Layout;