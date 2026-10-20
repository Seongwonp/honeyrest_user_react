// 화면 표시용 할인액. 서버(Coupon.calculateDiscount)와 같은 규칙이고, 서버 계산값이 있으면 그걸 쓴다.

// 정률 별칭 (DB 에 여러 철자가 섞여 있음)
const PERCENT_TYPES = new Set(["RATE", "PERCENT", "PERCENTAGE"]);

export function isPercentCoupon(coupon) {
    return PERCENT_TYPES.has(String(coupon?.discountType ?? "").trim().toUpperCase());
}

// user_coupon ID (쿠폰 마스터 couponId 아님)
export function getUserCouponId(coupon) {
    return coupon?.userCouponId ?? null;
}

// 정률은 원 단위 내림, 최대 할인액(maxDiscountAmount, 구 필드 maxOrderAmount)과 주문 금액을 넘지 않는다
export function calcCouponDiscount(coupon, amount) {
    if (!coupon) return 0;
    const price = Math.max(Number(amount) || 0, 0);

    const serverDiscount = Number(coupon.discountAmount);
    if (coupon.discountAmount != null && Number.isFinite(serverDiscount)) {
        return Math.min(Math.max(Math.floor(serverDiscount), 0), price);
    }

    const value = Number(coupon.discountValue) || 0;
    let discount = isPercentCoupon(coupon)
        // 부동소수 오차(12344.9999…)를 toFixed 로 정리한 뒤 내림
        ? Math.floor(Number(((price * value) / 100).toFixed(6)))
        : Math.floor(value);

    const maxDiscount = Number(coupon.maxDiscountAmount ?? coupon.maxOrderAmount);
    if (maxDiscount > 0 && discount > maxDiscount) {
        discount = Math.floor(maxDiscount);
    }
    return Math.min(Math.max(discount, 0), price);
}
