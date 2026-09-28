import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { HiCreditCard } from "react-icons/hi";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { eyebrowClass } from "@/components/ui/styles";

export default function PaymentProcess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [widgets, setWidgets] = useState(null);
    const [ready, setReady] = useState(false);
    const { user } = useAuth();
    // 결제하기 중복 클릭 방지 (ref: 즉시 차단, state: 버튼 비활성화 표시)
    const payingRef = useRef(false);
    const [paying, setPaying] = useState(false);

    // 예약자 이메일: 입력된 이메일 → 로그인 사용자 이메일 순으로 사용 (임의의 더미 이메일은 보내지 않음)
    const guestEmail = state?.guestEmail || user?.email || "";

    // 결제 처리 페이지에 새로고침이나 직접 URL 접근으로 들어오면 location.state가 없어
    // handlePayment 내부에서 state.guestPhone 등을 그대로 참조하다 크래시가 났다(P0-2).
    useEffect(() => {
        if (!state) {
            navigate("/accommodations", {replace: true});
        }
    }, [state, navigate]);

    // 매 렌더마다 새 객체가 생성되지 않도록 결제 금액 기준으로 메모이제이션
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

        if (state?.paymentMethod === "TOSS") {
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

    const handlePayment = async () => {
        if (!state || !widgets || payingRef.current) return;
        payingRef.current = true;
        setPaying(true);

        const baseCode = "HR-" + crypto.randomUUID().slice(0, 8).toUpperCase();
        // 주문번호에는 비밀번호/개인정보를 절대 포함하지 않는다.
        const orderId = baseCode;

        // ✅ 예약 정보 저장
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
            couponId: state.couponId,
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
            // 결제창을 닫거나 요청이 실패한 경우에만 다시 누를 수 있게 한다.
            // (성공 시에는 successUrl로 페이지가 이동한다)
            payingRef.current = false;
            setPaying(false);
        }
    };

    // 위 useEffect가 리다이렉트를 시작하는 동안 잘못된 값으로 렌더링하지 않는다.
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
                    <Row label="쿠폰 적용" value={state?.couponId ? "사용됨" : "미사용"} />
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

            {/* 토스 결제 위젯 렌더링 영역 */}
            <Card padding="p-2 sm:p-4" className="overflow-hidden">
                <div id="payment-method" />
                <div id="agreement" />
            </Card>

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
