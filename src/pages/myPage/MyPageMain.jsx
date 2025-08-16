// src/pages/mypage/MyPageMain.jsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import MyPageNav from "./MyPageNav.jsx";

function MyPageMain() {
    // 더미 사용자 정보
    const [user] = useState({
        name: "홍길동",
        email: "hong@example.com",
        profileImage: "/default-profile.png",
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">마이페이지</h1>
                <MyPageNav />
                <div className="mt-8">
                    <Outlet context={{ user }} />
                </div>
            </div>
        </div>
    );
}

export default MyPageMain;