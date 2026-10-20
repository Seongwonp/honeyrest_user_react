import { useEffect, useRef, useState } from "react";
import api from "@/api/axios";
import Slider from "react-slick";
import { FaChevronDown, FaChevronUp, FaFire } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { todayLocal, addDays } from "@/utils/date";

function HotPlacesSection({ isDropdownOpen, setIsDropdownOpen, verticalSliderSettings, navigate, userInfo }) {
    const [hotList, setHotList] = useState([]);
    const containerRef = useRef(null);

    useEffect(() => {
        // 장식용 요청이라 실패해도 에러 페이지로 보내지 않음
        api.get("/api/region/hot?topN=8", { skipRedirect: true })
            .then(res => {
                setHotList(Array.isArray(res.data) ? res.data : []);
            })
            .catch(err => {
                console.error("핫 여행지 불러오기 실패:", err);
            });
    }, []);

    // 펼친 목록은 바깥 클릭·Escape 로 닫는다
    useEffect(() => {
        if (!isDropdownOpen) return undefined;
        const handlePointerDown = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsDropdownOpen(false);
        };
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsDropdownOpen(false);
        };
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isDropdownOpen, setIsDropdownOpen]);

    const handlePlaceClick = (placeName) => {
        const today = todayLocal();
        const tomorrow = addDays(today, 1);

        const params = new URLSearchParams({
            location: placeName,
            checkIn: today,
            checkOut: tomorrow,
            guests: "2",
            page: "0",
        });

        if (userInfo?.userId) {
            params.set("userId", userInfo.userId);
        }

        navigate(`/accommodations?${params.toString()}`);
    };

    return (
        // backdrop-blur 가 쌓임 맥락을 만들어서, 펼친 목록이 날씨 카드 위에 오도록 카드에 z-index 지정
        <div
            ref={containerRef}
            className={`w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-5 relative ${isDropdownOpen ? "z-40" : "z-10"}`}
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                    <FaFire className="text-orange-500 text-lg animate-pulse" />
                </div>
                
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trending Now</p>
                    <div className="h-6 overflow-hidden">
                        <Slider {...verticalSliderSettings}>
                            {hotList.map((place, idx) => (
                                <button
                                    type="button"
                                    key={place.name ?? idx}
                                    className="block w-full text-left text-sm font-bold text-deep-gray cursor-pointer hover:text-honey-yellow-dark transition-colors"
                                    onClick={() => handlePlaceClick(place.name)}
                                >
                                    {idx + 1}. {place.name}
                                </button>
                            ))}
                        </Slider>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    aria-label={isDropdownOpen ? "인기 검색어 목록 닫기" : "인기 검색어 목록 열기"}
                    aria-expanded={isDropdownOpen}
                    aria-controls="hot-places-list"
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-400"
                >
                    {isDropdownOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </button>
            </div>

            <AnimatePresence>
                {isDropdownOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 w-full z-50 mt-3"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 max-h-72 overflow-y-auto overscroll-contain">
                            <ul id="hot-places-list" className="space-y-1">
                                {hotList.map((place, idx) => (
                                    <li key={place.name ?? idx}>
                                        <button
                                            type="button"
                                            className="w-full text-left flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                                            onClick={() => handlePlaceClick(place.name)}
                                        >
                                            <span className="w-6 text-sm font-black text-gray-300 group-hover:text-honey-yellow transition-colors">{idx + 1}</span>
                                            <span className="flex-1 min-w-0 text-sm font-bold text-deep-gray">{place.name}</span>
                                            <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{(place.searchCount ?? 0).toLocaleString("ko-KR")}회 검색</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default HotPlacesSection;
