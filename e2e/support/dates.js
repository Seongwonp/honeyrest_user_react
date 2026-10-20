// Asia/Seoul 기준 날짜 계산 (playwright.config.js 의 timezoneId 와 맞춤)
const TIME_ZONE = 'Asia/Seoul';

/** 오늘 {year, month(1~12), day} */
function seoulToday() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit',
    }).formatToParts(new Date());
    const get = (type) => Number(parts.find((p) => p.type === type).value);
    return { year: get('year'), month: get('month'), day: get('day') };
}

/** 오늘로부터 offsetDays 뒤 { iso: 'YYYY-MM-DD', year, month, day } */
export function daysFromToday(offsetDays) {
    const { year, month, day } = seoulToday();
    // UTC 로 더해 타임존/서머타임 영향을 피한다
    const d = new Date(Date.UTC(year, month - 1, day + offsetDays));
    return {
        iso: d.toISOString().slice(0, 10),
        year: d.getUTCFullYear(),
        month: d.getUTCMonth() + 1,
        day: d.getUTCDate(),
    };
}
