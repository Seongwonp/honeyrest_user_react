import { useEffect, useState } from "react";

// 이미지 종류별 기본 대체 이미지 (public/images 하위)
const FALLBACK_IMAGES = {
    stay: "/images/stay-placeholder.svg",
    room: "/images/room-placeholder.svg",
    profile: "/images/profile-placeholder.svg",
    event: "/images/event-placeholder.svg",
};

// src 가 없거나 실패하면 대체 이미지 표시. kind: stay | room | profile | event, fallbackSrc 가 우선
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
