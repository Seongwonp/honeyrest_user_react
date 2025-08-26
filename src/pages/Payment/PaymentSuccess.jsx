import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get("paymentKey");
            const orderId = searchParams.get("orderId");
            const amount = searchParams.get("amount");
            const reservationInfo = JSON.parse(sessionStorage.getItem("reservationInfo"));

            console.log("🔍 paymentKey:", paymentKey);
            console.log("🔍 orderId:", orderId);
            console.log("🔍 amount:", amount);
            console.log("🔍 reservationInfo:", reservationInfo);


            if (!paymentKey || !orderId || !amount || !reservationInfo) {
                alert("결제 정보 또는 예약 정보가 누락되었습니다.");
                navigate("/payment/fail");
                return;
            }

            try {
                const response = await axios.post("/api/payment/toss/confirm", {
                    paymentKey,
                    orderId,
                    amount,
                    reservationInfo,
                });

                const result = response.data;

                if (result.status === "FAILED") {
                    navigate(`/payment/fail?code=${result.raw?.code}&message=${result.raw?.message}`);
                    return;
                }

                navigate("/reservation/complete", { state: result });
                sessionStorage.removeItem("reservationInfo");
            } catch (err) {
                console.error("❌ 결제 승인 실패:", err);
                alert("결제 승인 중 문제가 발생했습니다. 고객센터에 문의해주세요.");
                navigate("/payment/fail");
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, []);

    return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
            {loading ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">결제 승인 중입니다...</h2>
                    <p className="text-gray-600 text-sm">잠시만 기다려주세요. 예약 정보를 확인하고 있습니다.</p>
                </>
            ) : (
                <p className="text-green-600 font-semibold">결제 승인 처리가 완료되었습니다.</p>
            )}
        </div>
    );
}