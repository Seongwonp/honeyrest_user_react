import { useEffect, useRef, useState } from "react";

/**
 * 화면에 들어올 때만 내려받아 재생하는 배경용 비디오
 * - preload="none" + poster 로 초기 로딩 시 영상 바이트를 받지 않는다.
 * - IntersectionObserver 로 뷰포트 근처(rootMargin)에 오면 src 를 붙이고 재생,
 *   벗어나면 일시정지해 디코딩 비용을 줄인다.
 * - IntersectionObserver 미지원 환경에서는 즉시 로드한다.
 */
function LazyVideo({ src, poster = "/images/video-poster.svg", rootMargin = "200px", className, ...props }) {
    const videoRef = useRef(null);
    const [shouldLoad, setShouldLoad] = useState(() => typeof IntersectionObserver === "undefined");

    useEffect(() => {
        const el = videoRef.current;
        if (!el || typeof IntersectionObserver === "undefined") return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShouldLoad(true);
                    // 자동재생 정책으로 막혀도 poster 가 보이므로 에러는 무시
                    el.play?.().catch(() => {});
                } else {
                    el.pause?.();
                }
            },
            { rootMargin }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, [rootMargin]);

    return (
        <video
            ref={videoRef}
            src={shouldLoad ? src : undefined}
            poster={poster}
            preload="none"
            autoPlay={shouldLoad}
            muted
            loop
            playsInline
            className={className}
            {...props}
        />
    );
}

export default LazyVideo;
