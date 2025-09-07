import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaVolumeMute, FaVolumeUp, FaHandPointRight, FaTimes } from "react-icons/fa";

function IntroModal() {
    const [muted, setMuted] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [dontShow, setDontShow] = useState(false);
    const navigate = useNavigate();

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
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={handleClose}>
            {/* 배경 검정은 바로 나타나도록 */}
            <div className="absolute inset-0 bg-black/70"></div>

            {/* 모달 콘텐츠만 애니메이션 적용 */}
            <motion.div
                className="relative w-full max-w-[95vw] sm:max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl flex flex-col z-10"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5 }}
                onClick={(e) => e.stopPropagation()}
            >

                {/* 🎥 영상 영역 */}
                <div className="relative w-full h-[75vh] sm:h-[500px]">
                    <video
                        src="/videos/intro.mp4"
                        autoPlay
                        muted={muted}
                        loop
                        className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute top-3 left-3 right-3 flex justify-between items-center px-2">
                        <button
                            className="p-2 bg-gray-900/60 text-white rounded-full shadow hover:bg-gray-800 transition"
                            onClick={() => setMuted(!muted)}
                            aria-label="음소거 전환"
                        >
                            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
                        </button>
                        <button
                            className="p-2 bg-gray-900/60 text-white rounded-full shadow hover:bg-gray-800 transition"
                            onClick={handleClose}
                            aria-label="모달 닫기"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>

                {/* 📦 버튼 카드 영역 */}
                <div className="w-full bg-gray-900/80 backdrop-blur-md px-6 py-5 flex flex-col items-center gap-4 sm:flex-row sm:justify-between sm:items-center">
                    <button
                        onClick={handleClose}
                        className="flex items-center gap-2 px-5 py-3 bg-yellow-400 text-white text-base font-bold rounded-full shadow hover:bg-yellow-500 transition animate-bounce"
                    >
                        예약하러 가기 <FaHandPointRight className="text-lg" />
                    </button>

                    <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={dontShow}
                            onChange={(e) => setDontShow(e.target.checked)}
                            className="w-4 h-4 rounded accent-yellow-400"
                        />
                        하루 동안 보지 않기
                    </label>
                </div>
            </motion.div>
        </div>
    );
}

export default IntroModal;