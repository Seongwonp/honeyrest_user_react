import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import {
    HiOutlineDocumentText,
    HiArrowLeft,
    HiCheckCircle,
    HiXCircle,
} from "react-icons/hi";
import { FaCreditCard, FaInfoCircle, FaPen } from "react-icons/fa";

export default function ReservationDetail() {
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (reservationId) fetchReservationDetail();
    }, [reservationId]);

    const fetchReservationDetail = async () => {
        try {
            const res = await api.get(`/api/user/reservations/${reservationId}`);
            setReservation(res.data);
        } catch (err) {
            console.error("❌ 예약 상세 조회 실패:", err);
        }
    };

    if (!reservation) {
        return <p className="text-center text-gray-500">불러오는 중...</p>;
    }

    const { paymentDetailDTO: detail } = reservation;

    const today = new Date();
    const checkOutDate = new Date(reservation.checkOut);
    const checkInDate = new Date(reservation.checkIn);
    const cancelDeadline = new Date(checkInDate);
    cancelDeadline.setDate(cancelDeadline.getDate() - 1);

    const isConfirmed = reservation.status === "CONFIRMED";
    const isStayCompleted = checkOutDate < today;
    const isBeforeCancelDeadline = today < cancelDeadline;

    const showReviewButton = isConfirmed && isStayCompleted && !reservation.reviewed;
    const showCancelButton = isConfirmed && isBeforeCancelDeadline;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
            <Header navigate={navigate} />
            <div className="bg-white border rounded-lg shadow p-6 space-y-4">
                <InfoBlock reservation={reservation} />
                <PaymentBlock reservation={reservation} />
                {detail && <DetailBlock detail={detail} />}
                <ActionButtons
                    reservation={reservation}
                    showReviewButton={showReviewButton}
                    showCancelButton={showCancelButton}
                    navigate={navigate}
                />
            </div>
        </div>
    );
}

function Header({ navigate }) {
    return (
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <HiOutlineDocumentText className="text-[#FF9F00]" />
                예약 상세 정보
            </h2>
            <button
                onClick={() => navigate(-1)}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
            >
                <HiArrowLeft />
                뒤로가기
            </button>
        </div>
    );
}

function InfoBlock({ reservation }) {
    return (
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-700">
            <div className="flex items-center gap-3 col-span-2">
                {reservation.thumbnailUrl && (
                    <img
                        src={reservation.thumbnailUrl}
                        alt="숙소 썸네일"
                        className="w-24 h-24 object-cover rounded-md border"
                    />
                )}
                <div className="space-y-1">
                    <Info label="숙소명" value={reservation.accommodationName} />
                    <Info label="객실명" value={reservation.roomName} />
                </div>
            </div>
            <Info label="체크인" value={reservation.checkIn} />
            <Info label="체크아웃" value={reservation.checkOut} />
            <Info label="인원" value={`${reservation.guests}명`} />
            <Info label="예약자" value={reservation.guestName} />
            <Info label="전화번호" value={reservation.guestPhone} />
            <Info
                label={
                    <span className="flex items-center gap-1">
                        <FaInfoCircle className="text-[#1E3A8A]" />
                        예약번호
                    </span>
                }
                value={<span className="font-mono text-[#1E3A8A]">{reservation.reservationCode}</span>}
            />
        </div>
    );
}

function PaymentBlock({ reservation }) {
    return (
        <div className="border-t pt-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
                <FaCreditCard className="text-[#FF9F00]" />
                결제 정보
            </p>
            <Info label="결제 수단" value={reservation.paymentMethod} />
            <Info
                label="결제 상태"
                value={
                    reservation.paymentStatus === "DONE" ? (
                        <span className="text-green-600 font-semibold flex items-center gap-1">
                            <HiCheckCircle />
                            완료
                        </span>
                    ) : (
                        <span className="text-red-500 font-semibold flex items-center gap-1">
                            <HiXCircle />
                            실패
                        </span>
                    )
                }
            />
            <Info label="원가" value={`${reservation.originalPrice.toLocaleString()}원`} />
            <Info
                label="할인 금액"
                value={
                    reservation.discountAmount != null
                        ? `-${reservation.discountAmount.toLocaleString()}원`
                        : "0원"
                }
            />
            <Info
                label="최종 결제 금액"
                value={
                    <span className="text-[#FF9F00] font-bold">
                        {reservation.finalPrice.toLocaleString()}원
                    </span>
                }
            />
            {reservation.receiptUrl && (
                <a
                    href={reservation.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline text-sm"
                >
                    영수증 보기
                </a>
            )}
        </div>
    );
}

function DetailBlock({ detail }) {
    return (
        <div className="border-t pt-4 space-y-2 text-sm">
            <p className="font-semibold text-gray-800 flex items-center gap-2">
                <FaInfoCircle className="text-[#FF9F00]" />
                결제 상세 정보
            </p>
            {detail.cardCompanyName && <Info label="카드사" value={detail.cardCompanyName} />}
            {detail.maskedCardNumber && <Info label="카드번호" value={detail.maskedCardNumber} />}
            {detail.installmentMonths !== null && (
                <Info
                    label="할부개월"
                    value={detail.installmentMonths === 0 ? "일시불" : `${detail.installmentMonths}개월`}
                />
            )}
            {detail.virtualAccountBank && <Info label="가상계좌 은행" value={detail.virtualAccountBank} />}
            {detail.virtualAccountNumber && <Info label="계좌번호" value={detail.virtualAccountNumber} />}
            {detail.virtualAccountHolder && <Info label="예금주" value={detail.virtualAccountHolder} />}
            {detail.virtualAccountExpire && <Info label="만료일" value={detail.virtualAccountExpire} />}
        </div>
    );
}

function ActionButtons({ reservation, showReviewButton, showCancelButton, navigate }) {
    return (
        <div className="flex gap-4 pt-6">
            {showReviewButton && (
                <div className="relative flex flex-col items-center">
                    {/* 말풍선 */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 text-sm px-6 py-2 rounded-lg shadow relative min-w-[135px] text-center">
                            🎁 작성 시 <strong>1,000P</strong> 지급!
                            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-yellow-100 border-l border-b border-yellow-400 rotate-45"></div>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <button
                        onClick={() => navigate(`/user/mypage/reviews/write/${reservation.reservationId}`)}
                        className="px-4 py-2 bg-[#FF9F00] text-white rounded hover:bg-[#e68a00] text-sm flex items-center gap-2"
                    >
                        <FaPen />
                        리뷰 작성하기
                    </button>
                </div>
            )}
            {showCancelButton && (
                <button
                    onClick={() => navigate(`/user/reservations/${reservation.reservationId}/cancel-request`)}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm flex items-center gap-2"
                >
                    <HiXCircle />
                    예약 취소 요청
                </button>
            )}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div>
            <span className="font-medium">{label}:</span> {value}
        </div>
    );
}