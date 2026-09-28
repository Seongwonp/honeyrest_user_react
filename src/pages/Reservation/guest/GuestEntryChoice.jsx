import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaSignInAlt, FaUserClock } from "react-icons/fa";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import { eyebrowClass } from "@/components/ui/styles";

export default function GuestEntryChoice() {
    const navigate = useNavigate();
    const location = useLocation();
    const reservationInfo = location.state;

    const handleLogin = () => {
        navigate("/login", {
            state: { redirectTo: "/reserve", reservationInfo }
        });
    };

    const handleGuestReserve = () => {
        navigate("/reserve/guest/form", {
            state: reservationInfo
        });
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
            <Card className="w-full max-w-md text-center" padding="p-6 sm:p-10">
                <p className={`${eyebrowClass} mb-1`}>Reservation</p>
                <h1 className="text-2xl font-black text-deep-gray mb-3 break-keep">예약을 진행하시려면</h1>
                <p className="text-sm text-gray-500 leading-relaxed break-keep">
                    <strong className="font-black text-deep-gray">로그인하시면</strong> 예약 내역을 마이페이지에서 확인하고
                    쿠폰과 혜택도 함께 받을 수 있어요.
                </p>
                <p className="mt-3 text-xs text-gray-400 bg-off-white rounded-2xl px-4 py-3 break-keep">
                    비회원 예약은 예약 번호로만 조회 가능합니다.
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    <Button onClick={handleLogin} fullWidth className="break-keep">
                        <FaSignInAlt />
                        로그인하고 더 편리하게 예약하기
                    </Button>
                    <Button variant="secondary" onClick={handleGuestReserve} fullWidth className="break-keep">
                        <FaUserClock />
                        비회원으로 예약 계속하기
                    </Button>
                </div>
            </Card>
        </div>
    );
}
