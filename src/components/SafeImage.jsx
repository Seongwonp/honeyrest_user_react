import { useEffect, useState } from "react";

const DEFAULT_FALLBACK = "/images/stay-placeholder.svg";

function SafeImage({ src, fallbackSrc = DEFAULT_FALLBACK, onError, ...props }) {
    const [currentSrc, setCurrentSrc] = useState(src || fallbackSrc);

    useEffect(() => {
        setCurrentSrc(src || fallbackSrc);
    }, [src, fallbackSrc]);

    const handleError = (event) => {
        onError?.(event);
        if (currentSrc !== fallbackSrc) {
            setCurrentSrc(fallbackSrc);
        }
    };

    return <img {...props} src={currentSrc} onError={handleError} />;
}

export default SafeImage;
