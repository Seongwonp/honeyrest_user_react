import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaVolumeMute, FaVolumeUp, FaHandPointRight, FaTimes } from "react-icons/fa";
import { buttonVariants, buttonSizes } from "@/components/ui/styles";

function IntroModal() {
    const [muted, setMuted] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [dontShow, setDontShow] = useState(false);
    useEffect(() => {
        const cookie = document.cookie.split('; ').find(row => row.startsWith('hideIntroModal='));
        if (!cookie) {
            setShowModal(true);
        }
    }, []);

    const handleClose = () => {
        if (dontShow) {
            const expires = new Date();
            expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000);
            document.cookie = `hideIntroModal=true; expires=${expires.toUTCString()}; path=/`;
        }
        setShowModal(false);
    };

    if (!showModal) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={handleClose}>
            {/* 배경 검정은 바로 나타나도록 */}
            <div className="absolute inset-0 bg-deep-gray/70 backdrop-blur-sm"></div>

            {/* 모달 콘텐츠만 애니메이션 적용 */}
            <motion.div
                role="dialog"
                aria-modal="true"
                aria-label="HoneyRest 소개 영상"
                className="relative w-full sm:max-w-4xl bg-black rounded-[2rem] overflow-hidden shadow-2xl flex flex-col z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >

                {/* 🎥 영상 영역 */}
                <div className="relative w-full h-[65vh] sm:h-[500px]">
                    {/* 모달이 열릴 때만 렌더링되므로 다른 경로·쿠키로 숨긴 경우 영상은 요청되지 않음 */}
                    <video
                        src="/videos/intro.mp4"
                        poster="/images/video-poster.svg"
                        preload="none"
                        playsInline
                        autoPlay
                        muted={muted}
                        loop
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/50"
                            onClick={() => setMuted(!muted)}
                            aria-label={muted ? "소리 켜기" : "음소거"}
                        >
                            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                        <button
                            type="button"
                            className="w-10 h-10 flex items-center justify-center bg-black/50 text-white rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/50"
                            onClick={handleClose}
                            aria-label="모달 닫기"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* 📦 버튼 카드 영역 */}
                <div className="w-full bg-deep-gray px-6 py-5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <button
                        type="button"
                        onClick={handleClose}
                        className={`${buttonVariants.primary} ${buttonSizes.lg} motion-safe:animate-bounce`}
                    >
                        예약하러 가기 <FaHandPointRight className="text-lg" />
                    </button>

                    <label className="flex items-center gap-2 text-white/80 text-sm font-medium cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dontShow}
                            onChange={(e) => setDontShow(e.target.checked)}
                            className="w-4 h-4 rounded accent-honey-yellow"
                        />
                        하루 동안 보지 않기
                    </label>
                </div>
            </motion.div>
        </div>
    );
}

export default IntroModal;
