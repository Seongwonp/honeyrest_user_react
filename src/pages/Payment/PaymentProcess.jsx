import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export default function PaymentProcess() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [widgets, setWidgets] = useState(null);
    const [ready, setReady] = useState(false);
    const { user } = useAuth();

    // 예약자 이메일: 입력된 이메일 → 로그인 사용자 이메일 순으로 사용 (임의의 더미 이메일은 보내지 않음)
    const guestEmail = state?.guestEmail || user?.email || "";

    // 결제 처리 페이지에 새로고침이나 직접 URL 접근으로 들어오면 location.state가 없어
    // handlePayment 내부에서 state.guestPhone 등을 그대로 참조하다 크래시가 났다(P0-2).
    useEffect(() => {
        if (!state) {
            navigate("/accommodations", {replace: true});
        }
    }, [state, navigate]);

    const amount = {
        currency: "KRW",
        value: state?.finalPrice || 0,
    };

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
    }, [widgets]);

    const handlePayment = async () => {
        if (!state) return;

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
        }
    };

    // 위 useEffect가 리다이렉트를 시작하는 동안 잘못된 값으로 렌더링하지 않는다.
    if (!state) {
        return null;
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
            <h2 className="text-3xl font-bold text-gray-900">💳 결제 정보 확인</h2>

            <div className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-4">
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                    <Info label="숙소명" value={state?.accommodationName} />
                    <Info label="객실명" value={state?.roomName} />
                    <Info label="체크인" value={state?.checkIn} />
                    <Info label="체크아웃" value={state?.checkOut} />
                    <Info label="인원" value={`${state?.guests}명`} />
                    <Info label="예약자" value={state?.guestName} />
                    <Info label="전화번호" value={state?.guestPhone} />
                    <Info label="이메일" value={guestEmail || "미입력"} />
                    <Info label="유저 ID" value={state?.userId || "비회원"} />
                    <Info label="쿠폰" value={state?.couponName || "미사용"} />
                    <Info label="쿠폰 적용" value={state?.couponId ? "사용됨" : "미사용"} />
                    <Info label="원가" value={state?.originalPrice ? `${state.originalPrice.toLocaleString()}원` : "-"} />
                    <Info label="할인 금액" value={state?.discountAmount ? `-${state.discountAmount.toLocaleString()}원` : "0원"} />
                    <Info label="사용한 포인트" value={state?.usedPoint ? `-${state.usedPoint.toLocaleString()}P` : "0P"} />
                </div>

                <div className="text-right text-lg font-semibold text-blue-600">
                    최종 결제 금액: {amount.value.toLocaleString()}원
                    {state?.usedPoint > 0 && (
                        <div className="text-sm text-gray-500 mt-1">
                            포인트 사용: -{state.usedPoint.toLocaleString()}P
                        </div>
                    )}
                </div>
            </div>

            <div id="payment-method" className="mt-6" />
            <div id="agreement" className="mt-4" />

            <button
                id="payment-button"
                className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded w-full transition"
                disabled={!ready}
                onClick={handlePayment}
            >
                결제하기
            </button>
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