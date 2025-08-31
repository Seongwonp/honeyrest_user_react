import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PaymentProcess() {
    const { state } = useLocation();
    const [widgets, setWidgets] = useState(null);
    const [ready, setReady] = useState(false);
    const [amount, setAmount] = useState({
        currency: "KRW",
        value: state?.finalPrice || 0,
    });

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
        const baseCode = "HR-" + crypto.randomUUID().slice(0, 8).toUpperCase();
        const orderId = state.userId
            ? baseCode
            : `${baseCode}-${state.guestPassword}`;

        // ✅ 예약 정보 sessionStorage에 저장
        sessionStorage.setItem("reservationInfo", JSON.stringify({
            userId: state.userId,
            guestName: state.guestName,
            guestPhone: state.guestPhone,
            accommodationId: state.accommodationId,
            reservationCode: orderId,
            roomId: state.roomId,
            checkIn: state.checkIn,
            checkOut: state.checkOut,
            guests: state.guests,
            couponId: state.couponId,
            isEmailSend: state.isEmailSend,
            specialRequest: state.specialRequest,
            originalPrice: state.originalPrice,
            discountAmount: state.discountAmount,
            couponName: state.couponName,
        }));

        try {
            await widgets.requestPayment({
                orderId,
                orderName: `${state.accommodationName} - ${state.roomName}`,
                successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
                customerName: state.guestName,
                customerMobilePhone: state.guestPhone.replaceAll("-", ""),
                customerEmail: state.guestEmail || "guest@example.com",
            });
        } catch (error) {
            console.error("❌ 결제 요청 실패:", error);
        }
    };

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
                    <Info label="유저" value={`${state?.userId}`}/>
                    <Info label="예약자" value={state?.guestName} />
                    <Info label="전화번호" value={state?.guestPhone} />
                    <Info label="이메일" value={state?.guestEmail || "미입력"} />
                    <Info label="쿠폰 적용" value={state?.couponId ? "사용됨" : "미사용"} />
                    <Info label="원가" value={state?.originalPrice ? `${state.originalPrice.toLocaleString()}원` : "-"} />
                    <Info label="할인 금액" value={state?.discountAmount ? `-${state.discountAmount.toLocaleString()}원` : "0원"} />
                    <Info label="쿠폰" value={state?.couponName || "미사용"} />
                </div>

                <div className="text-right text-lg font-semibold text-blue-600">
                    최종 결제 금액: {amount.value.toLocaleString()}원
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