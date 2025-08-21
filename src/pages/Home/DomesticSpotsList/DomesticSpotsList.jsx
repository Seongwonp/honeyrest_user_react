import { useEffect, useState } from "react";

function DomesticSpotsList({ userInfo, navigate }) {
    const [allRegions, setAllRegions] = useState([]);
    const [expandedRegionId, setExpandedRegionId] = useState(null);
    const [regionCache, setRegionCache] = useState(null);

    useEffect(() => {
        if (regionCache) {
            setAllRegions(regionCache);
            return;
        }

        fetch("/api/region")
            .then((res) => res.json())
            .then((data) => {
                const list = Array.isArray(data) ? data : data.data;
                setAllRegions(list || []);
                setRegionCache(list || []);
            })
            .catch((err) => console.error("❌ 지역 전체 불러오기 실패:", err));
    }, []);

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

    const topRegions = allRegions.filter(r => r.level === 1 && r.popular);

    const cityMap = allRegions.reduce((acc, city) => {
        if (city.level === 2 && city.popular && city.parentId) {
            if (!acc[city.parentId]) acc[city.parentId] = [];
            acc[city.parentId].push(city);
        }
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {topRegions.map((region) => (
                <div key={region.regionId} className="relative flex flex-col items-start space-y-2">
            <span
                onClick={() =>
                    setExpandedRegionId(region.regionId === expandedRegionId ? null : region.regionId)
                }
                className={`cursor-pointer text-sm hover:text-blue-500 ${
                    expandedRegionId === region.regionId ? "font-bold text-blue-600" : "text-gray-700"
                }`}
            >
                {region.name}
            </span>

                    {expandedRegionId === region.regionId && (
                        <div className="absolute top-full left-0 mt-2 z-10 bg-white shadow-md p-2 rounded-md flex flex-wrap gap-x-6 gap-y-2 w-64">
                            {(cityMap[region.regionId] || []).map((city) => (
                                <span
                                    key={city.regionId}
                                    onClick={() => handleClick(city.name)}
                                    className="text-sm text-center text-gray-700 cursor-pointer hover:text-blue-500"
                                >
                            {city.name}
                        </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default DomesticSpotsList;