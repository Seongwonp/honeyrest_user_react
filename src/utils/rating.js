// 세부 평점 평균 (고르지 않은 항목 제외, 소수 첫째 자리 반올림, 없으면 0)
export const calcAverageRating = (ratings) => {
    const valid = ratings.filter((r) => typeof r === "number" && Number.isFinite(r) && r > 0);
    if (valid.length === 0) return 0;
    const avg = valid.reduce((sum, r) => sum + r, 0) / valid.length;
    return parseFloat(avg.toFixed(1));
};
