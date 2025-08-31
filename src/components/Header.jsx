import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo-Photoroom.png';
import defaultProfile from '../assets/images/default-profile.png';
import {
    FaUserCircle, FaSignInAlt, FaSignOutAlt,
    FaUserPlus, FaBars, FaTimes, FaClipboardList
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const { user, isLoggedIn, loadUser } = useAuth();

    const navItems = isLoggedIn
        ? [
            { label: '마이페이지', path: '/user/mypage/profile', icon: <FaUserCircle /> },
            { label: '로그아웃', path: '/logout', icon: <FaSignOutAlt /> },
        ]
        : [
            { label: '예약조회', path: '/reservation/lookup', icon: <FaClipboardList /> },
            { label: '로그인', path: '/login', icon: <FaSignInAlt /> },
            { label: '회원가입', path: '/signup', icon: <FaUserPlus /> },
        ];

    const handleNavClick = (item) => {
        if (item.path === '/logout') {
            const confirmed = window.confirm('로그아웃하시겠습니까?');
            if (!confirmed) return;

            setMenuOpen(false);
            navigate('/logout');
            return;
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
                                src={user.profileImage?.trim() ? user.profileImage : defaultProfile}
                                alt="프로필"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-800">
                {user.name}님
              </span>
                        </div>
                    )}
                </nav>

                {/* 모바일 메뉴 버튼 */}
                <div className="md:hidden">
                    <button
                        onClick={() => setMenuOpen(true)}
                        aria-label="메뉴 열기"
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
                        aria-label="메뉴 닫기"
                        className="self-end text-[#4B5563] hover:text-red-500 text-xl"
                    >
                        <FaTimes />
                    </button>

                    {/* 프로필 정보 (모바일) */}
                    {isLoggedIn && (
                        <div className="flex items-center gap-3 px-4">
                            <img
                                src={user.profileImage?.trim() ? user.profileImage : defaultProfile}
                                alt="프로필"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-800">
                {user.name}님
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