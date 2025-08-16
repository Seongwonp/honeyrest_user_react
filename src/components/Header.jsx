import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-Photoroom.png';
import {
    FaUserCircle, FaSignInAlt, FaSignOutAlt,
    FaUserPlus, FaBars, FaTimes
} from 'react-icons/fa';
import { useState, useEffect } from 'react';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('userInfo');
        if (storedUser) {
            setUserInfo(JSON.parse(storedUser));
        }
    }, []);

    const isLoggedIn = !!userInfo;

    const navItems = isLoggedIn
        ? [
            { label: '마이페이지', path: '/user/mypage', icon: <FaUserCircle /> },
            { label: '로그아웃', path: '/logout', icon: <FaSignOutAlt /> },
        ]
        : [
            { label: '로그인', path: '/login', icon: <FaSignInAlt /> },
            { label: '회원가입', path: '/signup', icon: <FaUserPlus /> },
        ];

    const handleNavClick = (item) => {
        if (item.path === '/logout') {
            const confirmed = window.confirm('로그아웃하시겠습니까?');
            if (!confirmed) return;
        }
        setMenuOpen(false);
        navigate(item.path);
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
                {/* 로고 */}
                <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-[#4B5563] transition">
                    HoneyRest
                    <img src={logo} alt="logo" width={50} className="inline" />
                </Link>

                {/* 데스크탑 네비게이션 */}
                <nav className="hidden md:flex space-x-6 items-center">
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item)}
                            className="flex items-center gap-1 text-[#4B5563] hover:text-[#C8E6C9] transition"
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}

                    {/* 프로필 정보 */}
                    {isLoggedIn && (
                        <div className="flex items-center gap-2 ml-4">
                            <img
                                src={userInfo.profileImage}
                                alt="프로필"
                                className="w-8 h-8 rounded-full object-cover border border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-800">
                                {userInfo.name}님
                            </span>
                        </div>
                    )}
                </nav>

                {/* 모바일 메뉴 버튼 */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(true)}
                        className="text-[#4B5563] hover:text-[#C8E6C9] transition text-xl"
                    >
                        <FaBars />
                    </button>
                </div>
            </div>

            {/* 사이드 드로어 메뉴 */}
            <div
                className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
                    menuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col p-4 space-y-4">
                    <button
                        onClick={() => setMenuOpen(false)}
                        className="self-end text-[#4B5563] hover:text-red-500 text-xl"
                    >
                        <FaTimes />
                    </button>

                    {/* 프로필 정보 (모바일) */}
                    {isLoggedIn && (
                        <div className="flex items-center gap-3 px-4">
                            <img
                                src={userInfo.profileImage}
                                alt="프로필"
                                className="w-10 h-10 rounded-full object-cover border border-gray-300"
                            />
                            <span className="text-sm font-medium text-gray-800">
                                {userInfo.name}님
                            </span>
                        </div>
                    )}

                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item)}
                            className="flex items-center gap-2 text-[#4B5563] hover:bg-[#FFF9C4] px-4 py-2 rounded transition"
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>
        </header>
    );
}

export default Header;