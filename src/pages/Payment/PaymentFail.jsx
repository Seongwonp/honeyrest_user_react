import React from "react";
import { useNavigate } from "react-router-dom";

export default function PaymentFail() {
    const navigate = useNavigate();

    return (
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">결제에 실패했습니다</h2>
            <p className="text-gray-600 text-sm mb-6">
                결제가 정상적으로 완료되지 않았습니다. 다시 시도하거나 다른 결제 수단을 선택해주세요.
            </p>
            <div className="flex justify-center gap-4">
                <button
                    onClick={() => navigate(-1)}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded"
                >
                    이전 페이지로
                </button>
                <button
                    onClick={() => navigate("/")}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 rounded"
                >
                    홈으로 이동
                </button>
            </div>
        </div>
    );
}