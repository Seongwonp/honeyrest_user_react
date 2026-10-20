import { useEffect, useRef, useState } from "react";

// 뷰포트 근처에 오면 src 를 붙여 재생하고, 벗어나면 일시정지하는 배경 비디오
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
                    // 자동재생이 막혀도 poster 가 보이므로 무시
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
