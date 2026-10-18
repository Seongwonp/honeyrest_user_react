// 리뷰 세부 평점(청결도·서비스·시설·위치)으로 종합 평점을 계산한다.
// - 아직 고르지 않은 항목(0, null, NaN 등)은 제외
// - 소수점 첫째 자리로 반올림, 유효한 항목이 없으면 0
export const calcAverageRating = (ratings) => {
    const valid = ratings.filter((r) => typeof r === "number" && Number.isFinite(r) && r > 0);
    if (valid.length === 0) return 0;
    const avg = valid.reduce((sum, r) => sum + r, 0) / valid.length;
    return parseFloat(avg.toFixed(1));
};
