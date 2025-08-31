import FilterSidebar from "./FilterSidebar";
import AccommodationListPage from "./AccommodationListPage";
import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import { MdFilterList } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import MapSearchModal from "@/pages/Accommodations/Map/MapSearchModal.jsx";

function AccommodationLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [mapSearchOpen, setMapSearchOpen] = useState(false); //여기로 이동
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
        <div className="min-h-screen px-4 mt-2 bg-gray-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
                {/* 모바일 필터 토글 버튼 */}
                <div className="md:hidden flex justify-end py-4">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-md shadow hover:bg-yellow-600 transition"
                    >
                        <MdFilterList />
                        {sidebarOpen ? "필터 닫기" : "필터 열기"}
                    </button>
                </div>

                {/* 사이드바 */}
                {sidebarOpen && (
                    <aside className="md:w-72 w-full md:sticky md:top-4 p-6 bg-white rounded-xl shadow-md mb-6 md:mb-0 md:mr-6 h-fit">
                        <FilterSidebar
                            onFilterChange={handleFilterChange}
                            openMapSearch={handleOpenMapSearch}
                        />
                    </aside>
                )}

                {/* 숙소 리스트 */}
                <main className="flex-1 p-6 bg-white rounded-xl shadow-sm">
                    <AccommodationListPage />
                </main>
            </div>

            {/* 지도 검색 모달 */}
            {mapSearchOpen && (
                <MapSearchModal
                    onClose={handleCloseMapSearch}
                    onSearch={handleMapSearch}
                />
            )}
        </div>
    );
}
export default AccommodationLayout;