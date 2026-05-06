import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import qs from "qs";
import axios from "axios";
import AccommodationCard from "./AccommodationCard";
import { motion, AnimatePresence } from "framer-motion";
import ListSearchBox from "./ListSearchBox.jsx";
import { useAuth } from "@/hooks/useAuth";
import { HiOutlineSortAscending, HiChevronLeft, HiChevronRight } from "react-icons/hi";

function AccommodationListPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const userId = user?.userId || null;

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const location = searchParams.get("location") || "";
    const checkIn = searchParams.get("checkIn") || getToday();
    const checkOut = searchParams.get("checkOut") || getTomorrow(checkIn);
    const guests = Number(searchParams.get("guests")) || 2;
    const sort = searchParams.get("sort") || "priceAsc";
    const page = Number(searchParams.get("page")) || 0;

    const sortOptions = [
        { value: "priceAsc", label: "가격 낮은순" },
        { value: "priceDesc", label: "가격 높은순" },
        { value: "ratingDesc", label: "평점 높은순" },
        { value: "latest", label: "최신순" }
    ];

    const selectedCategories = useMemo(() => searchParams.getAll("selectedCategories"), [searchParams]);
    const selectedTags = useMemo(() => searchParams.getAll("selectedTags"), [searchParams]);
    const maxPrice = Number(searchParams.get("maxPrice")) || 1000000;

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/accommodations/search", {
                params: {
                    location,
                    checkIn,
                    checkOut,
                    guests,
                    ...(userId && { userId }),
                    sort,
                    page,
                    selectedCategories,
                    selectedTags,
                    maxPrice,
                },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" })
            });

            const data = res.data;
            setResults(data.content || []);
            setTotalPages(data.totalPages || 1);
        } catch (err) {
            console.error("❌ 숙소 검색 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (location && checkIn && checkOut) {
            fetchData();
        }
    }, [
        location,
        checkIn,
        checkOut,
        guests,
        sort,
        page,
        JSON.stringify(selectedCategories),
        JSON.stringify(selectedTags),
        maxPrice
    ]);

    return (
        <div className="space-y-8">
            <ListSearchBox />

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-3xl border border-gray-50 shadow-sm">
                <div className="flex flex-col">
                    <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Search Results</p>
                    <p className="text-sm font-bold text-deep-gray">
                        총 <span className="text-leaf-green">{results.length}개</span>의 숙소를 찾았습니다.
                    </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <HiOutlineSortAscending className="text-gray-400" />
                    <select
                        value={sort}
                        onChange={(e) => {
                            const params = new URLSearchParams(searchParams);
                            params.set("sort", e.target.value);
                            params.set("page", "0");
                            navigate({ search: params.toString() }, { replace: true });
                        }}
                        className="flex-1 sm:flex-none bg-gray-50 border-none rounded-xl px-4 py-2 text-sm font-bold text-deep-gray focus:ring-2 focus:ring-leaf-green/20 outline-none"
                    >
                        {sortOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="w-full h-64 bg-gray-100 animate-pulse rounded-[2.5rem]" />
                    ))}
                </div>
            ) : results.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-20 bg-white rounded-[2.5rem] border border-gray-50 shadow-sm"
                >
                    <p className="text-4xl mb-4">😢</p>
                    <h3 className="text-xl font-black text-deep-gray mb-2">조건에 맞는 숙소가 없습니다.</h3>
                    <p className="text-gray-400">필터를 조정하거나 다른 지역을 검색해보세요!</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {results.map((item, index) => (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <AccommodationCard
                                    item={item}
                                    checkIn={checkIn}
                                    checkOut={checkOut}
                                    userId={userId}
                                    guests={guests}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pt-8">
                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set("page", page - 1);
                                    navigate({ search: params.toString() }, { replace: true });
                                }}
                                disabled={page === 0}
                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
                            >
                                <HiChevronLeft />
                            </button>
                            
                            <div className="flex gap-2">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            const params = new URLSearchParams(searchParams);
                                            params.set("page", i);
                                            navigate({ search: params.toString() }, { replace: true });
                                        }}
                                        className={`w-10 h-10 rounded-xl text-sm font-black transition-all ${
                                            i === page 
                                            ? "bg-leaf-green text-white shadow-lg shadow-leaf-green/20" 
                                            : "bg-white text-gray-400 border border-gray-100 hover:border-leaf-green/30"
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set("page", page + 1);
                                    navigate({ search: params.toString() }, { replace: true });
                                }}
                                disabled={page === totalPages - 1}
                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-lg disabled:opacity-20 transition-all"
                            >
                                <HiChevronRight />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function getToday() {
    return new Date().toISOString().split("T")[0];
}

function getTomorrow(dateStr) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
}

export default AccommodationListPage;
