// src/pages/mypage/MyPageNav.jsx
import { NavLink } from "react-router-dom";

function MyPageNav() {
    const navItems = [
        { label: "내 정보", path: "profile" },
        { label: "예약 내역", path: "reservations" },
        { label: "작성한 후기", path: "reviews" },
        { label: "비밀번호 변경", path: "password" },
    ];

    return (
        <nav className="flex gap-4 border-b pb-2">
            {navItems.map((item) => (
                <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                        `text-sm font-medium px-3 py-1 rounded ${
                            isActive ? "bg-yellow-400 text-white" : "text-gray-600 hover:text-yellow-500"
                        }`
                    }
                >
                    {item.label}
                </NavLink>
            ))}
        </nav>
    );
}

export default MyPageNav;