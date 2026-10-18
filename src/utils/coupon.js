// 쿠폰 할인 도우미 — 서버(Coupon.calculateDiscount)와 같은 규칙으로 화면 표시용 할인액을 계산한다.
// 최종 금액 검증은 서버가 다시 하므로 여기 값은 미리보기일 뿐이며, 서버가 계산한 값이 있으면 그것을 우선한다.

// 서버 CouponDiscountType 과 동일한 정률 별칭 (DB 에 여러 철자가 섞여 있음)
const PERCENT_TYPES = new Set(["RATE", "PERCENT", "PERCENTAGE"]);

/** 정률(%) 쿠폰 여부 (대소문자·공백 무시) */
export function isPercentCoupon(coupon) {
    return PERCENT_TYPES.has(String(coupon?.discountType ?? "").trim().toUpperCase());
}

/** 선택 값·key 로 쓰는 쿠폰 식별자: 사용자 보유 쿠폰 ID(user_coupon). 쿠폰 마스터 ID(couponId)가 아니다 */
export function getUserCouponId(coupon) {
    return coupon?.userCouponId ?? null;
}

/**
 * 주문 금액에 대한 쿠폰 할인액(원, 정수).
 * - 서버가 계산한 discountAmount 가 응답에 있으면 그대로 사용
 * - 정률: 금액 × 할인율 / 100 을 원 단위 내림(Math.floor)
 * - 정액: 할인값 그대로
 * - 최대 할인액(maxDiscountAmount, 구 응답 필드명 maxOrderAmount) 상한, 주문 금액 초과 불가
 */
export function calcCouponDiscount(coupon, amount) {
    if (!coupon) return 0;
    const price = Math.max(Number(amount) || 0, 0);

    const serverDiscount = Number(coupon.discountAmount);
    if (coupon.discountAmount != null && Number.isFinite(serverDiscount)) {
        return Math.min(Math.max(Math.floor(serverDiscount), 0), price);
    }

    const value = Number(coupon.discountValue) || 0;
    let discount = isPercentCoupon(coupon)
        // toFixed 로 부동소수 오차(예: 12344.9999999)를 먼저 정리한 뒤 내림한다
        ? Math.floor(Number(((price * value) / 100).toFixed(6)))
        : Math.floor(value);

    const maxDiscount = Number(coupon.maxDiscountAmount ?? coupon.maxOrderAmount);
    if (maxDiscount > 0 && discount > maxDiscount) {
        discount = Math.floor(maxDiscount);
    }
    return Math.min(Math.max(discount, 0), price);
}
