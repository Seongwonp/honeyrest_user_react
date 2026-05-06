import FilterSidebar from "./FilterSidebar";
import AccommodationListPage from "./AccommodationListPage";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { HiX } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import MapSearchModal from "@/pages/Accommodations/Map/MapSearchModal.jsx";
import { motion, AnimatePresence } from "framer-motion";

function AccommodationLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [mapSearchOpen, setMapSearchOpen] = useState(false);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams(searchParams);
        params.set("maxPrice", newFilters.maxPrice);
        params.delete("selectedCategories");
        newFilters.categories.forEach(cat => params.append("selectedCategories", cat));
        params.delete("selectedTags");
        newFilters.tags.forEach(tag => params.append("selectedTags", tag));
        params.set("page", "0");
        navigate({ search: params.toString() }, { replace: true });
    };

    const handleOpenMapSearch = () => setMapSearchOpen(true);
    const handleCloseMapSearch = () => setMapSearchOpen(false);

    const handleMapSearch = (location) => {
        const params = new URLSearchParams(searchParams);
        params.set("lat", location.lat);
        params.set("lng", location.lng);
        params.set("page", "0");
        navigate({ search: params.toString() }, { replace: true });
        setMapSearchOpen(false);
    };

    return (
        <div className="min-h-screen bg-off-white pb-20">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* 헤더 부분 (필터 토글 및 지도 검색 버튼) */}
                <div className="flex justify-between items-center py-8">
                    <h1 className="text-2xl font-black text-deep-gray tracking-tight">
                        발견된 <span className="text-honey-yellow">숙소</span>
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 text-deep-gray rounded-2xl shadow-sm hover:shadow-lg transition-all md:hidden"
                        >
                            <MdFilterList className="text-honey-yellow" />
                            <span className="text-sm font-bold">Filters</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* 데스크탑 사이드바 */}
                    <aside className="hidden md:block w-80 sticky top-24 shrink-0">
                        <div className="bg-white rounded-[2rem] p-8 border border-gray-50 shadow-sm">
                            <FilterSidebar
                                onFilterChange={handleFilterChange}
                                openMapSearch={handleOpenMapSearch}
                            />
                        </div>
                    </aside>

                    {/* 메인 리스트 */}
                    <main className="flex-1 w-full">
                        <AccommodationListPage />
                    </main>
                </div>
            </div>

            {/* 모바일 필터 사이드바 (Drawer) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150] md:hidden"
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 left-0 w-full max-w-[320px] bg-white z-[160] md:hidden shadow-2xl overflow-y-auto"
                        >
                            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                <h2 className="text-xl font-black text-deep-gray">Filters</h2>
                                <button 
                                    onClick={() => setSidebarOpen(false)}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <HiX size={24} />
                                </button>
                            </div>
                            <div className="p-6">
                                <FilterSidebar
                                    onFilterChange={handleFilterChange}
                                    openMapSearch={handleOpenMapSearch}
                                />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* 지도 검색 모달 */}
            <AnimatePresence>
                {mapSearchOpen && (
                    <MapSearchModal
                        onClose={handleCloseMapSearch}
                        onSearch={handleMapSearch}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
export default AccommodationLayout;
