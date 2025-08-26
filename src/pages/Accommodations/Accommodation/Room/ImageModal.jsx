import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";

export default function ImageModal({ images, onClose }) {
    const [current, setCurrent] = useState(0);

    const prev = () => setCurrent((current - 1 + images.length) % images.length);
    const next = () => setCurrent((current + 1) % images.length);

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-md backdrop-saturate-150 z-50 flex items-center justify-center">
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white text-2xl hover:text-yellow-400 transition"
                aria-label="닫기"
            >
                <FaTimes />
            </button>

            {/* 이미지 슬라이더 */}
            <div className="relative w-full max-w-3xl h-[70vh] flex items-center justify-center">
                <img
                    src={images[current]}
                    alt={`room-${current}`}
                    className="object-contain max-h-full max-w-full rounded-lg shadow-xl"
                />

                {/* 이전 버튼 */}
                <button
                    onClick={prev}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-yellow-400 transition"
                    aria-label="이전 이미지"
                >
                    <FaChevronLeft />
                </button>

                {/* 다음 버튼 */}
                <button
                    onClick={next}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-yellow-400 transition"
                    aria-label="다음 이미지"
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}