import { useEffect, useState } from "react";
import api from "@/api/axios";
import Slider from "react-slick";
import { FaChevronDown, FaChevronUp, FaFire } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

function HotPlacesSection({ isDropdownOpen, setIsDropdownOpen, verticalSliderSettings, navigate, userInfo }) {
    const [hotList, setHotList] = useState([]);

    useEffect(() => {
        api.get("/api/region/hot?topN=8")
            .then(res => {
                setHotList(res.data);
            })
            .catch(err => {
                console.error("핫 여행지 불러오기 실패:", err);
            });
    }, []);

    const handlePlaceClick = (placeName) => {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

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
        <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl shadow-sm border border-gray-100 p-5 relative">
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
                    <FaFire className="text-orange-500 text-lg animate-pulse" />
                </div>
                
                <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Trending Now</p>
                    <div className="h-6 overflow-hidden">
                        <Slider {...verticalSliderSettings}>
                            {hotList.map((place, idx) => (
                                <div
                                    key={idx}
                                    className="text-sm font-bold text-deep-gray cursor-pointer hover:text-honey-yellow-dark transition-colors"
                                    onClick={() => handlePlaceClick(place.name)}
                                >
                                    {idx + 1}. {place.name}
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>

                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
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
                        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 max-h-64 overflow-y-auto">
                            <ul className="space-y-1">
                                {hotList.map((place, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => handlePlaceClick(place.name)}
                                    >
                                        <span className="w-6 text-sm font-black text-gray-300 group-hover:text-honey-yellow transition-colors">{idx + 1}</span>
                                        <span className="flex-1 text-sm font-bold text-deep-gray">{place.name}</span>
                                        <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">{place.searchCount} searches</span>
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
