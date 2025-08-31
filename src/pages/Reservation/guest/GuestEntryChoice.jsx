import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

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
        <div className="max-w-md mx-auto py-12 px-6 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-4">예약을 진행하시려면</h2>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
                <strong className="text-yellow-600">로그인하시면</strong> 예약 내역을 마이페이지에서 확인하고<br />
                쿠폰과 혜택도 함께 받을 수 있어요.
                <br />
                <span className="text-xs text-gray-400">(비회원 예약은 예약 번호로만 조회 가능합니다)</span>
            </p>

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleLogin}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-lg shadow-md"
                >
                    로그인하고 더 편리하게 예약하기
                </button>
                <button
                    onClick={handleGuestReserve}
                    className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-3 rounded-lg"
                >
                    비회원으로 예약 계속하기
                </button>
            </div>
        </div>
    );
}