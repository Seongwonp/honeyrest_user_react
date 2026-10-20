import { FaTicketAlt, FaCoins } from "react-icons/fa";
import { cardClass, inputClass } from "@/components/ui/styles";
import { isPercentCoupon, getUserCouponId } from "@/utils/coupon";

// 할인 적용 (쿠폰 선택 + 포인트 사용)
function DiscountSection({ form, onChange, availableCoupons, availablePoints }) {
    return (
        <>
            {/* 쿠폰 선택 */}
            <div className={`${cardClass} p-6`}>
                <label htmlFor="reservation-userCouponId" className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                    <FaTicketAlt className="text-honey-yellow-dark" /> 쿠폰 선택 <span className="text-gray-300 font-bold text-xs">(선택)</span>
                </label>
                {availableCoupons.length > 0 ? (
                    <select
                        id="reservation-userCouponId"
                        name="userCouponId"
                        value={form.userCouponId}
                        onChange={onChange}
                        className={inputClass}
                    >
                        <option value="">쿠폰을 선택하세요</option>
                        {/* 같은 쿠폰을 여러 장 가질 수 있어 userCouponId 를 값·key 로 사용 */}
                        {availableCoupons.map((coupon) => (
                            <option key={getUserCouponId(coupon)} value={getUserCouponId(coupon) ?? ""}>
                                {coupon.name} - {isPercentCoupon(coupon)
                                ? `${Number(coupon.discountValue)}% 할인`
                                : `${Number(coupon.discountValue).toLocaleString()}원 할인`}
                            </option>
                        ))}
                    </select>
                ) : (
                    <p className="text-sm text-gray-400 bg-off-white rounded-2xl px-4 py-3">사용 가능한 쿠폰이 없습니다.</p>
                )}
            </div>

            {/* 포인트 사용 */}
            {availablePoints !== null && (
                <div className={`${cardClass} p-6`}>
                    <label htmlFor="reservation-usedPoint" className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                        <FaCoins className="text-honey-yellow-dark" />
                        포인트 사용 <span className="text-gray-300 font-bold text-xs">(선택)</span>
                    </label>
                    <div className="text-sm text-gray-500 mb-2">
                        사용 가능한 포인트: <span className="font-black text-honey-yellow-dark">{availablePoints.toLocaleString()}P</span>
                    </div>
                    <input
                        type="number"
                        id="reservation-usedPoint"
                        name="usedPoint"
                        value={form.usedPoint}
                        onChange={onChange}
                        className={inputClass}
                        placeholder="사용할 포인트 입력"
                        min={0}
                        max={availablePoints}
                    />
                    <div className="text-xs text-gray-400 mt-2">
                        ※ 최대 {availablePoints.toLocaleString()}P까지 사용 가능
                    </div>
                </div>
            )}
        </>
    );
}

export default DiscountSection;
