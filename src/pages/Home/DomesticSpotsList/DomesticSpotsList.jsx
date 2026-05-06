import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiChevronRight } from "react-icons/hi";

function DomesticSpotsList({ userInfo, navigate }) {
    const [allRegions, setAllRegions] = useState([]);
    const [expandedRegionId, setExpandedRegionId] = useState(null);
    const [regionCache, setRegionCache] = useState(null);

    useEffect(() => {
        if (regionCache) {
            setAllRegions(regionCache);
            return;
        }

        fetch("/api/region/all")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.data;
                setAllRegions(list || []);
                setRegionCache(list || []);
            })
            .catch((err) => console.error("❌ 전체 지역 불러오기 실패:", err));
    }, [regionCache]);

    const handleClick = (regionName) => {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

        const params = new URLSearchParams({
            location: regionName,
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

    const topRegions = allRegions.filter(r => r.level === 1);

    const cityMap = allRegions.reduce((acc, city) => {
        if (city.level === 2 && city.parentId) {
            if (!acc[city.parentId]) acc[city.parentId] = [];
            acc[city.parentId].push(city);
        }
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {topRegions.map((region) => (
                <div key={region.regionId} className="relative group">
                    <button
                        onClick={() =>
                            setExpandedRegionId(region.regionId === expandedRegionId ? null : region.regionId)
                        }
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300
                            ${expandedRegionId === region.regionId 
                                ? "bg-leaf-green text-white font-bold shadow-lg shadow-leaf-green/20" 
                                : "bg-gray-50 text-deep-gray hover:bg-gray-100 font-semibold border border-transparent"
                            }`}
                    >
                        <span className="text-sm tracking-tight">{region.name}</span>
                        <motion.div
                            animate={{ rotate: expandedRegionId === region.regionId ? 90 : 0 }}
                        >
                            <HiChevronRight size={14} className={`${expandedRegionId === region.regionId ? "text-white" : "text-gray-300"}`} />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {expandedRegionId === region.regionId && (
                            <motion.div
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute top-full left-0 mt-3 z-50 w-full min-w-[280px]"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 grid grid-cols-2 gap-3">
                                    {(cityMap[region.regionId] || []).map((city) => (
                                        <button
                                            key={city.regionId}
                                            onClick={() => handleClick(city.name)}
                                            className="text-left text-xs font-bold text-gray-400 hover:text-leaf-green transition-colors px-3 py-2 rounded-xl hover:bg-leaf-green/5"
                                        >
                                            {city.name}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}

export default DomesticSpotsList;
