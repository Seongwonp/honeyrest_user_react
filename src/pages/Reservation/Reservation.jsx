import {useState, useEffect, useRef} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { toast } from "react-toastify";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Button from "@/components/ui/Button.jsx";
import GuestInfoSection from "./sections/GuestInfoSection.jsx";
import DiscountSection from "./sections/DiscountSection.jsx";
import CancellationPolicyCard from "./sections/CancellationPolicyCard.jsx";
import PaymentMethodSection from "./sections/PaymentMethodSection.jsx";
import StaySummaryCard from "./sections/StaySummaryCard.jsx";
import AgreementSection from "./sections/AgreementSection.jsx";
import PaymentSummary from "./sections/PaymentSummary.jsx";
import { calcCouponDiscount, getUserCouponId } from "@/utils/coupon";

// 상태는 이 컴포넌트가 갖고, 구역별 마크업은 ./sections/* 에 둔다
export default function Reservation() {
    const navigate = useNavigate();
    const {state} = useLocation();
    const [agree, setAgree] = useState(false);

    // 새로고침·직접 접근이면 location.state 가 없으므로 되돌려보낸다
    useEffect(() => {
        if (!state) {
            navigate("/accommodations", {replace: true});
        }
    }, [state, navigate]);

    // 동의 항목 및 상태 관리
    const [agreements, setAgreements] = useState({
        privacy: false,
        cancellation: false,
        email: false
    });
    const [expanded, setExpanded] = useState({
        privacy: false,
        cancellation: false,
        email: false
    });
    // toggle 세부내용
    const toggleDetail = (key) => {
        setExpanded(prev => ({...prev, [key]: !prev[key]}));
    };
    // 전체 동의 체크
    const allRequiredAgreed = agreements.privacy && agreements.cancellation;
    // 외부 상태 연동 (결제 버튼 등)
    useEffect(() => {
        setAgree(allRequiredAgreed);
    }, [allRequiredAgreed]);

    const {
        roomId,
        checkIn,
        checkOut,
        guests,
        userId,
        userName,
        userPhone,
        accommodationName,
        accommodationThumbnail,
        accommodationAddress,
        roomName,
        cancellationPolicy = [],
        availableCoupons = [],
        availablePoints = 0
    } = state ?? {};

    // 기준 금액은 서버(form-info)가 계산한 값을 쓰고, 없을 때만 상세 페이지의 totalPrice 사용
    const originalPrice = Number(state?.originalPrice ?? state?.totalPrice ?? 0) || 0;

    // 결제 버튼 중복 클릭 방지
    const submittingRef = useRef(false);
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        guestName: userName || "",
        guestPhone: userPhone || "",
        specialRequest: "",
        // user_coupon ID (쿠폰 마스터 couponId 아님)
        userCouponId: "",
        usedPoint:0
    });

    const [paymentMethod, setPaymentMethod] = useState("");

    const [selectedCoupon, setSelectedCoupon] = useState(null);
    const [discountAmount, setDiscountAmount] = useState(0);
    const [finalPrice, setFinalPrice] = useState(originalPrice);

    useEffect(() => {
        const coupon = form.userCouponId
            ? availableCoupons.find(c => String(getUserCouponId(c)) === String(form.userCouponId)) ?? null
            : null;
        // 서버와 같은 규칙: 정률은 원 단위 내림, 서버 계산값이 있으면 우선
        const discount = calcCouponDiscount(coupon, originalPrice);

        const pointDiscount = Math.min(form.usedPoint || 0, availablePoints);
        const final = Math.max(originalPrice - discount - pointDiscount, 0);

        // 선택 해제 시 이전 쿠폰이 요약에 남지 않게 항상 갱신
        setSelectedCoupon(coupon);
        setDiscountAmount(discount);
        setFinalPrice(final);
    }, [form.userCouponId, form.usedPoint, originalPrice, availableCoupons, availablePoints]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 포인트 입력일 경우 제한 처리
        if (name === "usedPoint") {
            let point = parseInt(value, 10);
            if (isNaN(point)) point = 0;
            if (point < 0) point = 0;
            if (point > availablePoints) point = availablePoints;

            setForm((prev) => ({ ...prev, usedPoint: point }));
            return;
        }

        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handlePayment = () => {
        if (submittingRef.current) return;
        if (!form.guestName.trim() || !form.guestPhone.trim()) {
            toast.error("예약자 이름과 전화번호는 필수입니다.");
            return;
        }

        if (!paymentMethod) {
            toast.error("결제 수단을 선택해주세요.");
            return;
        }

        const payload = {
            roomId,
            checkIn,
            checkOut,
            guests,
            guestName: form.guestName,
            guestPhone: form.guestPhone,
            specialRequest: form.specialRequest,
            originalPrice: originalPrice,       // 추가
            discountAmount: discountAmount,     // 추가
            couponName: selectedCoupon?.name || null, // 추가
            userCouponId: form.userCouponId ? Number(form.userCouponId) : null,
            usedPoint: form.usedPoint || 0,
            userId,
            isEmailSend: agreements.email,
            paymentMethod,
            finalPrice,
            accommodationName,
            roomName
        };

        submittingRef.current = true;
        setSubmitting(true);
        navigate("/payment/process", { state: payload });
    };


    // 리다이렉트 중에는 렌더링하지 않는다
    if (!state) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
                    <FaArrowLeft /> 이전으로
                </Button>
                <SectionTitle eyebrow="Reservation" title="예약 정보 입력 및 결제" className="mb-0" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 좌측 영역 */}
                <div className="lg:col-span-2 space-y-6 min-w-0">
                    <GuestInfoSection form={form} onChange={handleChange} />

                    <DiscountSection
                        form={form}
                        onChange={handleChange}
                        availableCoupons={availableCoupons}
                        availablePoints={availablePoints}
                    />

                    <CancellationPolicyCard cancellationPolicy={cancellationPolicy} />

                    <PaymentMethodSection
                        paymentMethod={paymentMethod}
                        setPaymentMethod={setPaymentMethod}
                    />
                </div>

                {/* 우측 영역 */}
                <div className="space-y-6 lg:sticky lg:top-24 self-start min-w-0">
                    <StaySummaryCard
                        accommodationThumbnail={accommodationThumbnail}
                        accommodationName={accommodationName}
                        accommodationAddress={accommodationAddress}
                        roomName={roomName}
                        checkIn={checkIn}
                        checkOut={checkOut}
                        guests={guests}
                    />

                    <AgreementSection
                        agreements={agreements}
                        setAgreements={setAgreements}
                        expanded={expanded}
                        toggleDetail={toggleDetail}
                        cancellationPolicy={cancellationPolicy}
                    />

                    <PaymentSummary
                        roomName={roomName}
                        originalPrice={originalPrice}
                        selectedCoupon={selectedCoupon}
                        discountAmount={discountAmount}
                        availablePoints={availablePoints}
                        usedPoint={form.usedPoint}
                        finalPrice={finalPrice}
                        onPay={handlePayment}
                        disabled={
                            !form.guestName.trim() ||
                            !form.guestPhone.trim() ||
                            !paymentMethod ||
                            !agree ||
                            submitting
                        }
                    />
                </div>
            </div>
        </div>
    );
}
