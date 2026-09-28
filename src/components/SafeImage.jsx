import { useEffect, useState } from "react";

// 이미지 종류별 기본 대체 이미지 (public/images 하위)
const FALLBACK_IMAGES = {
    stay: "/images/stay-placeholder.svg",
    room: "/images/room-placeholder.svg",
    profile: "/images/profile-placeholder.svg",
    event: "/images/event-placeholder.svg",
};

/**
 * 서버에서 받은 이미지를 안전하게 표시하는 컴포넌트
 * - src 가 비어 있거나 로딩에 실패하면 대체 이미지로 교체
 * - kind: "stay" | "room" | "profile" | "event" (기본값 "stay")
 * - fallbackSrc 를 직접 넘기면 kind 기본값보다 우선 적용
 */
function SafeImage({ src, kind = "stay", fallbackSrc, onError, ...props }) {
    const fallback = fallbackSrc || FALLBACK_IMAGES[kind] || FALLBACK_IMAGES.stay;
    const normalizedSrc = typeof src === "string" ? src.trim() : src;
    const [currentSrc, setCurrentSrc] = useState(normalizedSrc || fallback);

    useEffect(() => {
        setCurrentSrc(normalizedSrc || fallback);
    }, [normalizedSrc, fallback]);

    const handleError = (event) => {
        onError?.(event);
        if (currentSrc !== fallback) {
            setCurrentSrc(fallback);
        }
    };

    return <img {...props} src={currentSrc} onError={handleError} />;
}

export default SafeImage;
