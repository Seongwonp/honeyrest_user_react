import { useSyncExternalStore } from "react";

// 현재 창 너비(px).
// react-slick 의 responsive 는 처음부터 좁은 화면이면 적용되지 않아서 슬라이드 수를 직접 계산할 때 쓴다.
function subscribe(callback) {
    window.addEventListener("resize", callback);
    return () => window.removeEventListener("resize", callback);
}

const getWidth = () => window.innerWidth;
const getServerWidth = () => 1280;

export function useViewportWidth() {
    return useSyncExternalStore(subscribe, getWidth, getServerWidth);
}

// steps: [최대 너비, 값] 오름차순, 해당 구간이 없으면 fallback
export function pickByWidth(width, steps, fallback) {
    for (const [maxWidth, value] of steps) {
        if (width <= maxWidth) return value;
    }
    return fallback;
}
