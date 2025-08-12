import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

function Layout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow px-4 py-6 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}

export default Layout;