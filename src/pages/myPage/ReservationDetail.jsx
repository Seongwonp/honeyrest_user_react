import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import {
    HiOutlineDocumentText,
    HiArrowLeft,
    HiCheckCircle,
    HiXCircle,
} from "react-icons/hi";
import { FaCreditCard, FaInfoCircle, FaPen } from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";
import PageLoader from "@/components/PageLoader.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import { eyebrowClass } from "@/components/ui/styles";

export default function ReservationDetail() {
    const { reservationId } = useParams();
    const [reservation, setReservation] = useState(null);
    const [loadError, setLoadError] = useState(false);
    // 다시 시도 시 값을 바꿔 재조회
    const [reloadKey, setReloadKey] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        if (!reservationId) return;

        // 예약 상세 조회 (effect 내부에 정의해 reservationId 변경 시에만 실행)
        const fetchReservationDetail = async () => {
            setLoadError(false);
            try {
                const res = await api.get(`/api/user/reservations/${reservationId}`);
                setReservation(res.data);
            } catch (err) {
                console.error("❌ 예약 상세 조회 실패:", err);
                setLoadError(true);
            }
        };

        fetchReservationDetail();
    }, [reservationId, reloadKey]);

    if (!reservation) {
        return loadError ? (
            <ErrorState title="예약 정보를 불러오지 못했습니다." onRetry={() => setReloadKey((k) => k + 1)} />
        ) : (
            <PageLoader />
        );
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
        <section className="space-y-6">
            <Header navigate={navigate} />
            <Card className="space-y-8">
                <InfoBlock reservation={reservation} />
                <PaymentBlock reservation={reservation} />
                {detail && <DetailBlock detail={detail} />}
                <ActionButtons
                    reservation={reservation}
                    showReviewButton={showReviewButton}
                    showCancelButton={showCancelButton}
                />
            </Card>
        </section>
    );
}

function Header({ navigate }) {
    return (
        <div className="flex flex-wrap justify-between items-end gap-3">
            <div>
                <p className={`${eyebrowClass} mb-1`}>Reservation Detail</p>
                <h2 className="text-2xl md:text-3xl font-black text-deep-gray flex items-center gap-2">
                    <HiOutlineDocumentText className="text-honey-yellow-dark" />
                    예약 상세 정보
                </h2>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                <HiArrowLeft />
                뒤로가기
            </Button>
        </div>
    );
}

// 블록 제목
function BlockTitle({ icon, children }) {
    return (
        <p className="text-sm font-black text-deep-gray flex items-center gap-2 mb-3">
            <span className="w-7 h-7 rounded-xl bg-honey-yellow/10 text-honey-yellow-dark flex items-center justify-center text-xs">
                {icon}
            </span>
            {children}
        </p>
    );
}

function InfoBlock({ reservation }) {
    return (
        <div className="space-y-5">
            <div className="flex items-center gap-4">
                {reservation.thumbnailUrl && (
                    <div className="w-24 h-24 shrink-0 overflow-hidden rounded-2xl">
                        <SafeImage
                            src={reservation.thumbnailUrl}
                            alt="숙소 썸네일"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
                <div className="min-w-0 space-y-1">
                    <p className="text-xl font-black text-deep-gray leading-tight break-keep">{reservation.accommodationName}</p>
                    <p className="text-sm font-bold text-gray-400">{reservation.roomName}</p>
                </div>
            </div>
            <dl className="grid grid-cols-2 gap-3">
                <Info label="체크인" value={reservation.checkIn} />
                <Info label="체크아웃" value={reservation.checkOut} />
                <Info label="인원" value={`${reservation.guests}명`} />
                <Info label="예약자" value={reservation.guestName} />
                <Info label="전화번호" value={reservation.guestPhone} />
                <Info
                    label={
                        <span className="flex items-center gap-1">
                            <FaInfoCircle />
                            예약번호
                        </span>
                    }
                    value={<span className="font-mono text-leaf-green-dark">{reservation.reservationCode}</span>}
                />
            </dl>
        </div>
    );
}

function PaymentBlock({ reservation }) {
    return (
        <div className="border-t border-gray-50 pt-6">
            <BlockTitle icon={<FaCreditCard />}>결제 정보</BlockTitle>
            <dl className="divide-y divide-gray-50">
                <Row label="결제 수단" value={reservation.paymentMethod} />
                <Row
                    label="결제 상태"
                    value={
                        reservation.paymentStatus === "DONE" ? (
                            <span className="text-leaf-green-dark font-black inline-flex items-center gap-1">
                                <HiCheckCircle />
                                완료
                            </span>
                        ) : (
                            <span className="text-red-500 font-black inline-flex items-center gap-1">
                                <HiXCircle />
                                실패
                            </span>
                        )
                    }
                />
                <Row label="원가" value={`${reservation.originalPrice.toLocaleString()}원`} />
                <Row
                    label="할인 금액"
                    value={
                        reservation.discountAmount != null
                            ? `-${reservation.discountAmount.toLocaleString()}원`
                            : "0원"
                    }
                />
            </dl>
            <div className="mt-3 flex items-center justify-between rounded-2xl bg-honey-yellow/10 px-4 py-4">
                <span className="text-sm font-black text-deep-gray">최종 결제 금액</span>
                <span className="text-2xl font-black text-deep-gray">
                    {reservation.finalPrice.toLocaleString()}원
                </span>
            </div>
            {reservation.receiptUrl && (
                <a
                    href={reservation.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-xs font-bold text-gray-400 underline underline-offset-4 hover:text-leaf-green-dark"
                >
                    영수증 보기
                </a>
            )}
        </div>
    );
}

function DetailBlock({ detail }) {
    return (
        <div className="border-t border-gray-50 pt-6">
            <BlockTitle icon={<FaInfoCircle />}>결제 상세 정보</BlockTitle>
            <dl className="divide-y divide-gray-50">
                {detail.cardCompanyName && <Row label="카드사" value={detail.cardCompanyName} />}
                {detail.maskedCardNumber && <Row label="카드번호" value={detail.maskedCardNumber} />}
                {detail.installmentMonths !== null && (
                    <Row
                        label="할부개월"
                        value={detail.installmentMonths === 0 ? "일시불" : `${detail.installmentMonths}개월`}
                    />
                )}
                {detail.virtualAccountBank && <Row label="가상계좌 은행" value={detail.virtualAccountBank} />}
                {detail.virtualAccountNumber && <Row label="계좌번호" value={detail.virtualAccountNumber} />}
                {detail.virtualAccountHolder && <Row label="예금주" value={detail.virtualAccountHolder} />}
                {detail.virtualAccountExpire && <Row label="만료일" value={detail.virtualAccountExpire} />}
            </dl>
        </div>
    );
}

function ActionButtons({ reservation, showReviewButton, showCancelButton }) {
    if (!showReviewButton && !showCancelButton) return null;
    return (
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-50">
            {showReviewButton && (
                <div className="relative flex flex-col items-center pt-12">
                    {/* 말풍선 */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 animate-bounce">
                        <div className="bg-honey-yellow/15 text-honey-yellow-dark text-xs font-bold px-4 py-2 rounded-2xl relative whitespace-nowrap text-center">
                            🎁 작성 시 <strong className="font-black">1,000P</strong> 지급!
                            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-honey-yellow/15 rotate-45"></div>
                        </div>
                    </div>

                    {/* 버튼 */}
                    <Button as={Link} to={`/user/mypage/reviews/write/${reservation.reservationId}`}>
                        <FaPen />
                        리뷰 작성하기
                    </Button>
                </div>
            )}
            {showCancelButton && (
                <Button
                    as={Link}
                    variant="danger"
                    to={`/user/reservations/${reservation.reservationId}/cancel-request`}
                    className="self-end"
                >
                    <HiXCircle />
                    예약 취소 요청
                </Button>
            )}
        </div>
    );
}

// 라벨 위 / 값 아래 형태의 정보 칸
function Info({ label, value }) {
    return (
        <div className="rounded-2xl bg-off-white px-4 py-3 min-w-0">
            <dt className={eyebrowClass}>{label}</dt>
            <dd className="mt-0.5 text-sm font-bold text-deep-gray break-all">{value}</dd>
        </div>
    );
}

// 좌우 정렬 행
function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-gray-400 font-bold shrink-0">{label}</dt>
            <dd className="text-deep-gray font-bold text-right break-all">{value}</dd>
        </div>
    );
}
