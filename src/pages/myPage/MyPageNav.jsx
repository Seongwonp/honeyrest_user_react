// src/pages/mypage/MyPageNav.jsx
import { NavLink } from "react-router-dom";

function MyPageNav() {
    const navItems = [
        { label: "내 정보", path: "profile" },
        { label: "예약 내역", path: "reservations" },
        { label: "작성한 후기", path: "reviews" },
        { label: "찜 목록", path: "wishList" },
        { label: "내 문의 내역", path: "inquiries" },
        { label: "쿠폰 목록", path: "coupons" },
        { label: "포인트 내역", path: "points" },
    ];

    return (
        <nav aria-label="마이페이지 메뉴" className="glass-card rounded-3xl p-2">
            {/* 모바일에서는 가로 스크롤, 페이지 자체는 넘치지 않도록 내부에서만 스크롤 */}
            <ul className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {navItems.map((item) => (
                    <li key={item.path} className="shrink-0">
                        <NavLink
                            to={item.path}
                            className={({ isActive }) =>
                                `block whitespace-nowrap text-sm font-bold px-4 py-2.5 rounded-2xl transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30 ${
                                    isActive
                                        ? "bg-honey-yellow text-deep-gray shadow-lg shadow-honey-yellow/20"
                                        : "text-gray-500 hover:bg-honey-yellow/10 hover:text-honey-yellow-dark"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
}

export default MyPageNav;
