import { useAuth } from "@/hooks/useAuth";
import { Outlet, useLocation } from "react-router-dom";
import MyPageNav from "./MyPageNav.jsx";
import MyPageEasterEgg from "./MyPageEasterEgg.jsx"; // 이스터에그 컴포넌트

function MyPageMain() {
    const { user } = useAuth();
    const location = useLocation();

    const isRoot = location.pathname === "/user/mypage" || location.pathname === "/user/mypage/";

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-5xl mx-auto py-10 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">마이페이지</h1>
                <MyPageNav />
                <div className="mt-8">
                    <Outlet context={{ user }} />
                    {isRoot && <MyPageEasterEgg />}
                </div>
            </div>
        </div>
    );
}

export default MyPageMain;