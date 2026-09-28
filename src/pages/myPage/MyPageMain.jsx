import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/PageLoader.jsx";
import { Outlet, useLocation } from "react-router-dom";
import MyPageNav from "./MyPageNav.jsx";
import MyPageEasterEgg from "./MyPageEasterEgg.jsx"; // 이스터에그 컴포넌트

function MyPageMain() {
    const { user } = useAuth();
    const location = useLocation();

    const isRoot = location.pathname === "/user/mypage" || location.pathname === "/user/mypage/";

    return (
        <div className="min-h-screen bg-off-white">
            <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
                <div className="mb-6">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">My Page</p>
                    <h1 className="text-3xl md:text-4xl font-black text-deep-gray">
                        마이페이지
                    </h1>
                    {user?.name && (
                        <p className="mt-2 text-sm text-gray-400">
                            <span className="font-bold text-deep-gray">{user.name}</span>님, 오늘도 달콤한 휴식을 준비해 보세요.
                        </p>
                    )}
                </div>
                <MyPageNav />
                <div className="mt-8">
                    <Suspense fallback={<PageLoader />}>
                        <Outlet context={{ user }} />
                    </Suspense>
                    {isRoot && <MyPageEasterEgg />}
                </div>
            </div>
        </div>
    );
}

export default MyPageMain;