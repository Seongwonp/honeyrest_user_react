import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HiCreditCard } from "react-icons/hi";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { eyebrowClass } from "@/components/ui/styles";
import { IS_DEMO } from "@/config/demo";

// E2E·데모용 테스트 결제 (가짜 paymentKey, 승인은 서버의 토스 스텁). 빌드 시 상수 치환이라 운영 번들엔 없다
const IS_E2E_PAYMENT = import.meta.env.VITE_E2E === "true";
const IS_TEST_PAYMENT = IS_E2E_PAYMENT || IS_DEMO;

// 주문번호에 개인정보를 넣지 않는다
const createOrderId = () => "HR-" + crypto.randomUUID().slice(0, 8).toUpperCase();

export default function PaymentProcess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [widgets, setWidgets] = useState(null);
    const [ready, setReady] = useState(false);
    const { user } = useAuth();
    // 중복 클릭 방지 (ref: 즉시 차단, state: 버튼 표시)
    const payingRef = useRef(false);
    const [paying, setPaying] = useState(false);

    // 입력 이메일 → 로그인 사용자 이메일 순
    const guestEmail = state?.guestEmail || user?.email || "";

    // 새로고침·직접 접근이면 location.state 가 없다
    useEffect(() => {
        if (!state) {
            navigate("/accommodations", {replace: true});
        }
    }, [state, navigate]);

    const finalPrice = state?.finalPrice || 0;
    const amount = useMemo(() => ({
        currency: "KRW",
        value: finalPrice,
    }), [finalPrice]);

    useEffect(() => {
        async function initWidgets() {
            const clientKey = import.meta.env.VITE_TOSS_WIDGET_CLIENT_KEY;
            const tossPayments = await loadTossPayments(clientKey);
            const customerKey = state?.userId ? `user-${state.userId}` : ANONYMOUS;
            const widgetsInstance = tossPayments.widgets({ customerKey });
            setWidgets(widgetsInstance);
        }

        if (state?.paymentMethod === "TOSS" && !IS_TEST_PAYMENT) {
            initWidgets();
        }
    }, [state]);

    useEffect(() => {
        async function renderWidgets() {
            if (!widgets) return;

            document.getElementById("payment-method").innerHTML = "";
            document.getElementById("agreement").innerHTML = "";

            await widgets.setAmount(amount);

            await Promise.all([
                widgets.renderPaymentMethods({
                    selector: "#payment-method",
                    variantKey: "DEFAULT",
                }),
                widgets.renderAgreement({
                    selector: "#agreement",
                    variantKey: "AGREEMENT",
                }),
            ]);

            setReady(true);
        }

        renderWidgets();
    }, [widgets, amount]);

    // PaymentSuccess 가 승인 요청에 쓸 예약 정보
    const saveReservationDraft = (orderId) => {
        sessionStorage.setItem("reservationInfo", JSON.stringify({
            userId: state.userId,
            guestName: state.guestName,
            guestPhone: state.guestPhone,
            guestEmail: guestEmail || null,
            accommodationId: state.accommodationId,
            reservationCode: orderId,
            roomId: state.roomId,
            checkIn: state.checkIn,
            checkOut: state.checkOut,
            guests: state.guests,
            userCouponId: state.userCouponId ?? null,
            couponName: state.couponName,
            discountAmount: state.discountAmount,
            originalPrice: state.originalPrice,
            usedPoint: state.usedPoint || 0,
            finalPrice: state.finalPrice,
            isEmailSend: state.isEmailSend,
            specialRequest: state.specialRequest,
            paymentMethod: state.paymentMethod,
            accommodationName: state.accommodationName,
            roomName: state.roomName,
        }));
    };

    // E2E·데모 전용 (IS_TEST_PAYMENT 참고)
    const handleTestPayment = () => {
        if (!IS_TEST_PAYMENT || !state || payingRef.current) return;
        payingRef.current = true;
        setPaying(true);

        const orderId = createOrderId();
        saveReservationDraft(orderId);
        const params = new URLSearchParams({
            paymentKey: `${IS_DEMO ? "demo" : "e2e"}_${crypto.randomUUID()}`,
            orderId,
            amount: String(finalPrice),
        });
        navigate(`/payment/success?${params.toString()}`);
    };

    const handlePayment = async () => {
        if (!state || !widgets || payingRef.current) return;
        payingRef.current = true;
        setPaying(true);

        const orderId = createOrderId();

        saveReservationDraft(orderId);

        try {
            await widgets.requestPayment({
                orderId,
                orderName: `${state.accommodationName} - ${state.roomName}`,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                customerName: state.guestName,
                customerMobilePhone: state.guestPhone.replaceAll("-", ""),
                ...(guestEmail ? { customerEmail: guestEmail } : {}),
            });
        } catch (error) {
            console.error("❌ 결제 요청 실패:", error);
            // 성공하면 successUrl 로 이동하므로 실패·취소 시에만 다시 활성화
            payingRef.current = false;
            setPaying(false);
        }
    };

    // 리다이렉트 중에는 렌더링하지 않는다
    if (!state) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <SectionTitle eyebrow="Checkout" title="결제 정보 확인" className="mb-2" />

            <Card className="space-y-6">
                <div>
                    <p className="text-xl font-black text-deep-gray leading-tight break-keep">{state?.accommodationName}</p>
                    <p className="text-sm font-bold text-gray-400">{state?.roomName}</p>
                </div>
                <dl className="grid grid-cols-2 gap-3">
                    <Info label="체크인" value={state?.checkIn} />
                    <Info label="체크아웃" value={state?.checkOut} />
                    <Info label="인원" value={`${state?.guests}명`} />
                    <Info label="예약자" value={state?.guestName} />
                    <Info label="전화번호" value={state?.guestPhone} />
                    <Info label="이메일" value={guestEmail || "미입력"} />
                    <Info label="유저 ID" value={state?.userId || "비회원"} />
                    <Info label="쿠폰" value={state?.couponName || "미사용"} />
                </dl>

                <dl className="divide-y divide-gray-50 border-t border-gray-50 pt-2">
                    <Row label="쿠폰 적용" value={state?.userCouponId ? "사용됨" : "미사용"} />
                    <Row label="원가" value={state?.originalPrice ? `${state.originalPrice.toLocaleString()}원` : "-"} />
                    <Row label="할인 금액" value={state?.discountAmount ? `-${state.discountAmount.toLocaleString()}원` : "0원"} />
                    <Row label="사용한 포인트" value={state?.usedPoint ? `-${state.usedPoint.toLocaleString()}P` : "0P"} />
                </dl>

                <div className="bg-deep-gray rounded-3xl p-5 sm:p-6 text-white flex items-end justify-between gap-4">
                    <div>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Total</p>
                        <p className="text-sm font-bold text-white/80">최종 결제 금액</p>
                        {state?.usedPoint > 0 && (
                            <p className="text-xs text-white/50 mt-1">
                                포인트 사용: -{state.usedPoint.toLocaleString()}P
                            </p>
                        )}
                    </div>
                    <p className="text-2xl sm:text-3xl font-black text-honey-yellow whitespace-nowrap">
                        {amount.value.toLocaleString()}원
                    </p>
                </div>
            </Card>

            {/* 토스 결제 위젯 (테스트 결제 모드에서는 숨김) */}
            {!IS_DEMO && (
                <Card padding="p-2 sm:p-4" className="overflow-hidden">
                    <div id="payment-method" />
                    <div id="agreement" />
                </Card>
            )}

            {IS_TEST_PAYMENT && (
                <Card className="space-y-3 border-2 border-dashed border-honey-yellow">
                    <p className="text-sm font-bold text-deep-gray">
                        {IS_DEMO
                            ? "데모 환경: 토스 결제창 없이 테스트 결제로 진행합니다. 실제로 청구되지 않습니다."
                            : "E2E 테스트 모드: 토스 결제창 없이 테스트 결제로 진행합니다."}
                    </p>
                    <Button
                        type="button"
                        variant={IS_DEMO ? "primary" : "secondary"}
                        size={IS_DEMO ? "lg" : "md"}
                        fullWidth
                        disabled={paying}
                        onClick={handleTestPayment}
                        data-testid="e2e-test-payment"
                    >
                        {IS_DEMO ? (paying ? "결제 진행 중..." : "테스트 결제(데모)") : "테스트 결제"}
                    </Button>
                </Card>
            )}

            {!IS_DEMO && (
                <Button
                    id="payment-button"
                    size="lg"
                    fullWidth
                    disabled={!ready || paying}
                    onClick={handlePayment}
                >
                    <HiCreditCard />
                    {paying ? "결제 진행 중..." : "결제하기"}
                </Button>
            )}
        </div>
    );
}

function Info({ label, value }) {
    return (
        <div className="rounded-2xl bg-off-white px-4 py-3 min-w-0">
            <dt className={eyebrowClass}>{label}</dt>
            <dd className="mt-0.5 text-sm font-bold text-deep-gray break-all">{value}</dd>
        </div>
    );
}

function Row({ label, value }) {
    return (
        <div className="flex items-center justify-between gap-4 py-2.5 text-sm">
            <dt className="text-gray-400 font-bold">{label}</dt>
            <dd className="text-deep-gray font-bold text-right">{value}</dd>
        </div>
    );
}
