import dayjs from "dayjs";

// 날짜만 다루는 값은 로컬 시간대 기준으로 만든다.
// toISOString() 은 UTC 라 KST 00:00~08:59 에는 "어제"가 나온다.

const DATE_FORMAT = "YYYY-MM-DD";

/** 로컬 기준 'YYYY-MM-DD', 잘못된 값이면 빈 문자열 */
export function formatLocalDate(date) {
    const d = dayjs(date);
    return d.isValid() ? d.format(DATE_FORMAT) : "";
}

export function todayLocal() {
    return formatLocalDate(new Date());
}

// dateStr 이 비었거나 잘못되면 오늘 기준
export function addDays(dateStr, n) {
    const base = dateStr ? dayjs(dateStr) : dayjs();
    return (base.isValid() ? base : dayjs()).add(n, "day").format(DATE_FORMAT);
}
