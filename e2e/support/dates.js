// 날짜 도우미 — playwright.config.js 의 timezoneId(Asia/Seoul) 기준 "오늘"에서 N일 뒤를 계산한다.
const TIME_ZONE = 'Asia/Seoul';

/** Asia/Seoul 기준 오늘 날짜 {year, month(1~12), day} */
function seoulToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return { year: get('year'), month: get('month'), day: get('day') };
}

/**
 * 오늘로부터 offsetDays 뒤의 날짜.
 * @returns {{ iso: string, year: number, month: number, day: number }}
 *   iso: 'YYYY-MM-DD', month: 1~12, day: 1~31
 */
export function daysFromToday(offsetDays) {
    const { year, month, day } = seoulToday();
    // UTC 로 계산해 로컬 타임존/서머타임 영향 없이 날짜만 더한다.
    const d = new Date(Date.UTC(year, month - 1, day + offsetDays));
    return {
        iso: d.toISOString().slice(0, 10),
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
}
