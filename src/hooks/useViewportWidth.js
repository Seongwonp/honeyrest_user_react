import { useSyncExternalStore } from "react";

// 현재 창 너비(px). 창 크기가 바뀌면 다시 렌더링한다.
// react-slick 0.31 의 responsive 옵션은 matchMedia "변경" 때만 적용돼서, 처음부터 좁은 화면(휴대폰)으로 열면
// 데스크톱 설정(slidesToShow 4 등)이 그대로 쓰여 카드가 찌그러진다. 그래서 슬라이드 수를 직접 계산할 때 쓴다.
function subscribe(callback) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
}

const getWidth = () => window.innerWidth;
const getServerWidth = () => 1280;

export function useViewportWidth() {
    return useSyncExternalStore(subscribe, getWidth, getServerWidth);
}

/**
 * 너비 구간별 값 고르기.
 * @param {number} width 현재 너비
 * @param {Array<[number, any]>} steps [최대 너비, 값] 오름차순. 어느 구간에도 안 들면 fallback
 */
export function pickByWidth(width, steps, fallback) {
    for (const [maxWidth, value] of steps) {
        if (width <= maxWidth) return value;
    }
    return fallback;
}
