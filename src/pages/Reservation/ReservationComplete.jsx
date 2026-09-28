import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    FaClipboardList, FaEnvelope, FaTicketAlt, FaUser,
    FaPhone, FaCalendarAlt, FaDoorOpen, FaUsers, FaChevronDown, FaExternalLinkAlt
} from "react-icons/fa";
import { HiExclamationCircle, HiCheckCircle } from "react-icons/hi";
import StatusPanel from "@/components/ui/StatusPanel.jsx";
import Button from "@/components/ui/Button.jsx";
import Card from "@/components/ui/Card.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import { eyebrowClass } from "@/components/ui/styles";

export default function ReservationComplete() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [showPaymentInfo, setShowPaymentInfo] = useState(false);

    if (!state) {
        return (
            <StatusPanel
                role="alert"
                icon={<HiExclamationCircle />}
                tone="red"
                eyebrow="Reservation"
                title="예약 정보가 없습니다"
                message="결제 후 예약 정보가 전달되지 않았습니다. 고객센터에 문의해주세요."
                actions={<Button onClick={() => navigate("/")}>홈으로 돌아가기</Button>}
            />
        );
    }

    const {
        reservationCode, accommodationName, roomName, checkIn, checkOut,
        guests, guestName, guestPhone, couponName,
        originalPrice, discountAmount, finalPrice, receiptUrl,
        paymentMethod, isEmailSent
    } = state;

    const formatPrice = (value) => {
        const safe = typeof value === "number" ? value : parseFloat(value ?? 0);
        return safe.toLocaleString() + "원";
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 space-y-6">
            {/* 완료 헤더 */}
            <Card className="text-center" padding="p-6 sm:p-10">
                <div aria-hidden="true" className="mx-auto mb-5 w-20 h-20 rounded-3xl bg-leaf-green/10 text-leaf-green-dark flex items-center justify-center text-5xl">
                    <HiCheckCircle />
                </div>
                <p className={`${eyebrowClass} mb-1`}>Reservation Complete</p>
                <h1 className="text-2xl md:text-3xl font-black text-deep-gray break-keep">예약이 완료되었습니다!</h1>

                <div className="mt-6 bg-honey-yellow/10 rounded-2xl px-4 py-5">
                    <p className="text-xs font-bold text-gray-500 flex items-center justify-center gap-2">
                        <FaTicketAlt className="text-honey-yellow-dark" />
                        예약 코드
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-deep-gray mt-1 select-all break-all">{reservationCode}</p>
                </div>
            </Card>

            {/* 예약 정보 */}
            <Card padding="p-6 sm:p-8">
                <SectionTitle
                    eyebrow="Details"
                    title={<span className="flex items-center gap-2"><FaClipboardList className="text-honey-yellow-dark text-xl" /> 예약 정보</span>}
                    className="mb-5"
                />
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    <Info icon={<FaDoorOpen />} label="숙소명" value={accommodationName} />
                    <Info icon={<FaDoorOpen />} label="객실명" value={roomName} />
                    <Info icon={<FaCalendarAlt />} label="체크인" value={checkIn} />
                    <Info icon={<FaCalendarAlt />} label="체크아웃" value={checkOut} />
                    <Info icon={<FaUsers />} label="인원" value={`${guests}명`} />
                    <Info icon={<FaUser />} label="예약자" value={guestName} />
                    <Info icon={<FaPhone />} label="전화번호" value={guestPhone} />
                    <Info icon={<FaTicketAlt />} label="쿠폰" value={couponName || "없음"} />
                    <Info icon={<FaEnvelope />} label="이메일 발송" value={isEmailSent ? "발송됨" : "미발송"} />
                </dl>
            </Card>

            {/* 결제 정보 (접기/펼치기) */}
            <Card padding="p-0" className="overflow-hidden">
                <button
                    type="button"
                    onClick={() => setShowPaymentInfo(!showPaymentInfo)}
                    aria-expanded={showPaymentInfo}
                    aria-controls="reservation-payment-info"
                    className="w-full flex items-center justify-between gap-3 px-6 sm:px-8 py-5 text-left font-black text-deep-gray hover:bg-off-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-honey-yellow/30"
                >
                    <span>결제 정보 자세히 보기</span>
                    <FaChevronDown className={`shrink-0 text-gray-400 transition-transform duration-300 ${showPaymentInfo ? "rotate-180" : ""}`} />
                </button>
                <div
                    id="reservation-payment-info"
                    className={`overflow-hidden transition-[max-height,opacity] duration-500 ease-in-out px-6 sm:px-8 text-sm ${showPaymentInfo ? "max-h-[1000px] opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"}`}
                    aria-hidden={!showPaymentInfo}
                >
                    <div className="space-y-3 border-t border-gray-100 pt-5">
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400 font-bold">결제 수단</span>
                            <span className="font-bold text-deep-gray">{paymentMethod}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400 font-bold">원가</span>
                            <span className="font-bold text-deep-gray">{formatPrice(originalPrice)}</span>
                        </div>
                        <div className="flex justify-between gap-4">
                            <span className="text-gray-400 font-bold">할인 금액</span>
                            <span className="font-bold text-red-500">-{formatPrice(discountAmount)}</span>
                        </div>
                        <div className="flex justify-between items-end gap-4 border-t border-gray-100 pt-4 mt-4">
                            <span className="font-black text-deep-gray">최종 결제 금액</span>
                            <span className="text-2xl font-black text-deep-gray">{formatPrice(finalPrice)}</span>
                        </div>
                        {receiptUrl && (
                            <Button
                                as="a"
                                href={receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                variant="secondary"
                                fullWidth
                                className="mt-4"
                                tabIndex={showPaymentInfo ? undefined : -1}
                            >
                                영수증 보기 <FaExternalLinkAlt className="text-xs" />
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            <div className="flex justify-center pt-2">
                <Button variant="dark" size="lg" onClick={() => navigate("/")}>
                    홈으로 돌아가기
                </Button>
            </div>
        </div>
    );
}

function Info({ icon, label, value }) {
    return (
        <div className="flex items-start gap-3 min-w-0">
            <span className="mt-0.5 w-8 h-8 shrink-0 rounded-xl bg-honey-yellow/10 text-honey-yellow-dark flex items-center justify-center text-xs">
                {icon}
            </span>
            <div className="min-w-0">
                <dt className={eyebrowClass}>{label}</dt>
                <dd className="font-bold text-deep-gray break-keep break-words">{value}</dd>
            </div>
        </div>
    );
}
