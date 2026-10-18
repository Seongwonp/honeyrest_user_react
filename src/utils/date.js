import dayjs from "dayjs";

// 날짜 문자열(YYYY-MM-DD) 도우미.
// new Date().toISOString() 은 UTC 기준이라 KST 00:00~08:59 에는 "어제" 날짜가 나온다.
// 체크인/체크아웃처럼 날짜만 다루는 값은 반드시 브라우저 로컬 시간대 기준으로 만든다.

const DATE_FORMAT = "YYYY-MM-DD";

/** Date(또는 dayjs 가 해석할 수 있는 값)를 로컬 시간대 기준 'YYYY-MM-DD' 로 변환. 잘못된 값이면 빈 문자열 */
export function formatLocalDate(date) {
    const d = dayjs(date);
    return d.isValid() ? d.format(DATE_FORMAT) : "";
}

/** 로컬 시간대 기준 오늘 날짜 'YYYY-MM-DD' */
export function todayLocal() {
    return formatLocalDate(new Date());
}

/**
 * 'YYYY-MM-DD' 에 n 일을 더한 날짜 문자열.
 * dayjs 는 'YYYY-MM-DD' 를 로컬 자정으로 해석하므로 시간대와 무관하게 날짜만 이동한다.
 * dateStr 이 비었거나 잘못되면 오늘을 기준으로 계산한다.
 */
export function addDays(dateStr, n) {
    const base = dateStr ? dayjs(dateStr) : dayjs();
    return (base.isValid() ? base : dayjs()).add(n, "day").format(DATE_FORMAT);
}
