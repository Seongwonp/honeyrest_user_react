import { Link, useNavigate } from 'react-router-dom';
import logo from '/public/images/logo-Photoroom.png';
import SafeImage from '@/components/SafeImage.jsx';
import { ADMIN_URL } from '@/config/urls';
import {
    FaUserCircle, FaSignInAlt, FaSignOutAlt,
    FaUserPlus, FaBars, FaTimes, FaClipboardList
} from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const navigate = useNavigate();
    const { user, isLoggedIn } = useAuth();
    // 관리자 URL 이 설정된 경우에만 관리자 버튼 노출
    const isAdmin = isLoggedIn && user.role?.includes('ADMIN') && Boolean(ADMIN_URL);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // 모바일 메뉴가 열려 있을 때 Escape 로 닫기
    useEffect(() => {
        if (!menuOpen) return;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setMenuOpen(false);
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [menuOpen]);

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
            if (!window.confirm('로그아웃하시겠습니까?')) return;
        }
        setMenuOpen(false);
        navigate(item.path);
    };

    const handleAdminClick = () => {
        setMenuOpen(false);
        window.open(`${ADMIN_URL}/`, '_blank', 'noopener');
    };

    return (
        <header 
            className={`sticky top-0 z-[100] transition-all duration-300 ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-lg shadow-sm py-2' 
                : 'bg-white py-4'
            }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* 로고 */}
                <Link to="/" className="flex items-center gap-2 group">
                    <img 
                        src={logo} 
                        alt="logo" 
                        className="w-10 h-10 object-contain transition-transform group-hover:rotate-12" 
                    />
                    <span className="text-2xl font-bold bg-gradient-to-r from-deep-gray to-gray-500 bg-clip-text text-transparent">
                        HoneyRest
                    </span>
                </Link>

                {/* 데스크탑 메뉴 */}
                <nav className="hidden md:flex items-center gap-1">
                    {isAdmin && (
                        <button
                            onClick={handleAdminClick}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-deep-gray hover:bg-leaf-green/10 hover:text-leaf-green transition-all font-medium"
                        >
                            <FaClipboardList className="text-sm" />
                            <span>관리자</span>
                        </button>
                    )}
                    {navItems.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => handleNavClick(item)}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-deep-gray hover:bg-honey-yellow/10 hover:text-honey-yellow-dark transition-all font-medium"
                        >
                            <span className="text-sm opacity-70 group-hover:opacity-100">{item.icon}</span>
                            <span>{item.label}</span>
                        </button>
                    ))}
                    
                    {isLoggedIn && (
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                            <div className="text-right hidden lg:block">
                                <p className="text-xs text-gray-400">Welcome</p>
                                <p className="text-sm font-bold text-deep-gray">{user.name}님</p>
                            </div>
                            <SafeImage
                                kind="profile"
                                src={user.profileImage}
                                alt="프로필"
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-honey-yellow/20"
                            />
                        </div>
                    )}
                </nav>

                {/* 모바일 메뉴 버튼 */}
                <button
                    type="button"
                    onClick={() => setMenuOpen(true)}
                    aria-label="메뉴 열기"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                    className="md:hidden p-2 rounded-xl bg-gray-50 text-deep-gray hover:bg-honey-yellow/20 transition-colors"
                >
                    <FaBars size={20} />
                </button>
            </div>

            {/* 모바일 사이드 드로어 */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            aria-hidden="true"
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110] md:hidden"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            id="mobile-menu"
                            role="dialog"
                            aria-modal="true"
                            aria-label="모바일 메뉴"
                            className="fixed top-0 right-0 h-full w-[280px] max-w-[85vw] bg-white z-[120] shadow-2xl md:hidden flex flex-col"
                        >
                            <div className="p-6 flex justify-between items-center border-b border-gray-50">
                                <span className="font-bold text-xl text-deep-gray">Menu</span>
                                <button
                                    type="button"
                                    onClick={() => setMenuOpen(false)}
                                    aria-label="메뉴 닫기"
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <FaTimes size={20} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-2">
                                {isLoggedIn && (
                                    <div className="flex items-center gap-4 p-4 rounded-2xl bg-honey-yellow/5 mb-6">
                                        <SafeImage
                                            kind="profile"
                                            src={user.profileImage}
                                            alt="프로필"
                                            className="w-12 h-12 rounded-full object-cover border-2 border-honey-yellow/30"
                                        />
                                        <div>
                                            <p className="font-bold text-deep-gray">{user.name}님</p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                )}

                                {isAdmin && (
                                    <button
                                        onClick={handleAdminClick}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-deep-gray hover:bg-leaf-green/10 hover:text-leaf-green-dark transition-all"
                                    >
                                        <FaClipboardList />
                                        <span className="font-medium">관리자 페이지</span>
                                    </button>
                                )}

                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNavClick(item)}
                                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-deep-gray hover:bg-honey-yellow/10 hover:text-honey-yellow-dark transition-all"
                                    >
                                        <span className="text-lg opacity-60">{item.icon}</span>
                                        <span className="font-medium">{item.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="p-6 border-t border-gray-50">
                                <p className="text-center text-xs text-gray-400">
                                    © HoneyRest. All rights reserved.
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    );
}

export default Header;
