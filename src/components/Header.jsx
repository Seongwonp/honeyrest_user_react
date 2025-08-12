import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className="bg-[#FFF9C4] shadow-md sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* 로고 */}
                <Link to="/" className="text-2xl font-bold text-[#4B5563] hover:text-[#FFEB3B] transition">
                    HoneyRest
                </Link>

                {/* 네비게이션 */}
                <nav className="hidden md:flex space-x-6">
                    <Link to="/" className="text-[#4B5563] hover:text-[#C8E6C9] transition">
                        홈
                    </Link>
                    <Link to="/login" className="text-[#4B5563] hover:text-[#C8E6C9] transition">
                        로그인
                    </Link>
                    <Link to="/mypage" className="text-[#4B5563] hover:text-[#C8E6C9] transition">
                        마이페이지
                    </Link>
                </nav>

                {/* 모바일 메뉴 아이콘 */}
                <div className="md:hidden">
                    <button className="text-[#4B5563] hover:text-[#C8E6C9] transition text-xl">
                        ☰
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;