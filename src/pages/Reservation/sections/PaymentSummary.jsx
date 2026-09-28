import Button from "@/components/ui/Button.jsx";
import { cardClass, eyebrowClass } from "@/components/ui/styles";

// 결제 금액 요약 + 결제 버튼
function PaymentSummary({ roomName, originalPrice, selectedCoupon, discountAmount, availablePoints, usedPoint, finalPrice, onPay, disabled }) {
    return (
        <div className={`${cardClass} p-6`}>
            <p className={`${eyebrowClass} mb-1`}>Payment</p>
            <h3 className="text-lg font-black text-deep-gray mb-4">결제 정보</h3>
            <div className="mb-6 text-sm text-gray-500 space-y-2">
                <div className="flex justify-between">
                    <span className="break-keep">{roomName}</span>
                    <span className="font-bold text-deep-gray whitespace-nowrap">{originalPrice.toLocaleString()}원</span>
                </div>
                {selectedCoupon && (
                    <div className="flex justify-between gap-2 text-honey-yellow-dark font-bold">
                        <span>{selectedCoupon.name}</span>
                        <span>-{discountAmount.toLocaleString()}원</span>
                    </div>
                )}
                {availablePoints > 0 && usedPoint > 0 && (
                    <div className="flex justify-between gap-2 text-leaf-green-dark font-bold">
                        <span>포인트 사용</span>
                        <span>-{usedPoint.toLocaleString()}원</span>
                    </div>
                )}
                <div className="border-t border-gray-100 pt-4 mt-4 flex justify-between items-end">
                    <span className="font-black text-deep-gray">총 금액</span>
                    <span className="text-2xl font-black text-deep-gray">{finalPrice.toLocaleString()}원</span>
                </div>
            </div>

            <Button
                onClick={onPay}
                disabled={disabled}
                size="lg"
                fullWidth
            >
                결제하고 예약하기
            </Button>
        </div>
    );
}

export default PaymentSummary;
