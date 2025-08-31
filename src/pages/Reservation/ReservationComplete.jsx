import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaClipboardList, FaCreditCard, FaEnvelope, FaTicketAlt, FaUser,
    FaPhone, FaCalendarAlt, FaDoorOpen, FaUsers
} from "react-icons/fa";
import verifiedGif from "/src/assets/images/verified.gif";

export default function ReservationComplete() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);

    if (!state) {
        return (
            <div className="max-w-xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-yellow-500 mb-4">❌ 예약 정보가 없습니다</h2>
                <p className="text-gray-600 text-sm">결제 후 예약 정보가 전달되지 않았습니다. 고객센터에 문의해주세요.</p>
                <button
                    className="mt-6 px-4 py-2 bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
                    onClick={() => navigate("/")}
                >
                    홈으로 돌아가기
                </button>
            </div>
        );
    }

    const {
        reservationCode, accommodationName, roomName, checkIn, checkOut,
        guests, guestName, guestPhone, guestEmail, couponName,
        originalPrice, discountAmount, finalPrice, receiptUrl,
        paymentMethod, isEmailSent
    } = state;

    const formatPrice = (value) => {
        const safe = typeof value === "number" ? value : parseFloat(value ?? 0);
        return safe.toLocaleString() + "원";
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
            <div className="max-w-3xl w-full px-6 py-16 space-y-12 bg-white rounded-xl shadow-md ring-1 ring-[#e5e5e5]">
                <img src={verifiedGif} alt="Verified" className="w-28 h-28 mx-auto" />
                <h2 className="text-3xl font-bold text-[#fbbf24] text-center">🎉 예약이 완료되었습니다!</h2>

                <div className="bg-white rounded-lg shadow-sm ring-1 ring-[#e5e5e5] p-6 text-center">
                    <p className="text-base font-semibold text-[#1f2937] flex items-center justify-center gap-2">
                        <FaTicketAlt className="text-[#fbbf24]" />
                        예약 코드
                    </p>
                    <p className="text-2xl font-bold text-[#1f2937] mt-2 select-all">{reservationCode}</p>
                </div>

                <div className="bg-white rounded-lg shadow-sm ring-1 ring-[#e5e5e5] p-6 space-y-6">
                    <h3 className="text-xl font-semibold text-[#1f2937] flex items-center gap-2">
                        <FaClipboardList className="text-[#fbbf24]" />
                        예약 정보
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-5 text-sm text-[#374151]">
                        <Info icon={<FaDoorOpen />} label="숙소명" value={accommodationName} />
                        <Info icon={<FaDoorOpen />} label="객실명" value={roomName} />
                        <Info icon={<FaCalendarAlt />} label="체크인" value={checkIn} />
                        <Info icon={<FaCalendarAlt />} label="체크아웃" value={checkOut} />
                        <Info icon={<FaUsers />} label="인원" value={`${guests}명`} />
                        <Info icon={<FaUser />} label="예약자" value={guestName} />
                        <Info icon={<FaPhone />} label="전화번호" value={guestPhone} />
                        <Info icon={<FaEnvelope />} label="이메일" value={guestEmail || "미입력"} />
                        <Info icon={<FaTicketAlt />} label="쿠폰" value={couponName || "없음"} />
                        <div className="flex items-center space-x-2 text-[#374151] text-sm">
                            <FaEnvelope className="text-[#fbbf24]" />
                            <span className="font-medium">이메일 발송:</span>
                            {isEmailSent ? <span>발송됨</span> : <span>미발송</span>}
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm ring-1 ring-[#e5e5e5]">
                    <button
                        type="button"
                        onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                        aria-expanded={showPaymentInfo}
                        className="w-full flex items-center justify-between px-6 py-4 text-black font-semibold rounded-t-lg bg-white border-b border-[#e5e5e5] transition focus:outline-none hover:text-[#fbbf24] hover:border-[#fbbf24]"
                    >
                        <span>결제 정보 자세히 보기</span>
                        <span className={`transform transition-transform duration-300 ${showPaymentInfo ? 'rotate-180' : 'rotate-0'}`}>
                            ▼
                        </span>
                    </button>
                    <div
                        className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out px-6 text-[#1f2937] text-base bg-white rounded-b-lg ${showPaymentInfo ? 'max-h-[1000px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'}`}
                        aria-hidden={!showPaymentInfo}
                    >
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="font-medium">결제 수단</span>
                                <span>{paymentMethod}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">원가</span>
                                <span>{formatPrice(originalPrice)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="font-medium">할인 금액</span>
                                <span className="text-red-500">-{formatPrice(discountAmount)}</span>
                            </div>
                            <div className="flex justify-between mt-4 border-t pt-4">
                                <span className="font-bold text-lg">최종 결제 금액</span>
                                <span className="font-bold text-lg text-[#fbbf24]">{formatPrice(finalPrice)}</span>
                            </div>
                            {receiptUrl && (
                                <div className="mt-4 text-center">
                                    <a
                                        href={receiptUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-block px-4 py-2 bg-[#fbbf24] hover:bg-[#f59e0b] text-black font-semibold rounded transition"
                                    >
                                        영수증 보기
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-center mt-8">
                    <button
                        className="px-6 py-3 bg-[#1f2937] hover:bg-[#111827] text-white font-semibold rounded transition"
                        onClick={() => navigate("/")}
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            </div>
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-center space-x-2 text-[#374151]">
            <span className="text-[#fbbf24]">{icon}</span>
            <span className="font-medium">{label}:</span>
            <span>{value}</span>
        </div>
    );
}