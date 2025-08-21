import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import qs from "qs";
import axios from "axios";
import AccommodationCard from "./AccommodationCard";
import { motion, AnimatePresence } from "framer-motion";
import ListSearchBox from "./ListSearchBox.jsx";

function AccommodationListPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const location = searchParams.get("location") || "";
    const checkIn = searchParams.get("checkIn") || getToday();
    const checkOut = searchParams.get("checkOut") || getTomorrow(checkIn);
    const guests = Number(searchParams.get("guests")) || 2;
    const storedUser = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userId = storedUser.userId;
    const sort = searchParams.get("sort") || "priceAsc";
    const page = Number(searchParams.get("page")) || 0;
    const sortOptions = [
        { value: "priceAsc", label: "가격 낮은순" },
        { value: "priceDesc", label: "가격 높은순" },
        { value: "ratingDesc", label: "평점 높은순" },
        { value: "latest", label: "최신순" },
        { value: "random", label: "랜덤" }
    ];
    useEffect(() => {
        console.log("✅ 숙소 리스트 결과:", results);
    }, [results]);


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
                    userId,
                    sort,
                    page,
                    selectedCategories,
                    selectedTags,
                    maxPrice,
                },
                paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" })
            });

            const data = res.data;
            setResults(data.content);
            setTotalPages(data.totalPages);
            // setPage(data.page); ← 이건 필요 없어요, 이미 URL에서 page를 관리 중이니까!
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

    const toggleWish = (id, index) => {
        console.log("찜 토글:", id, index);
        // 실제 찜 처리 로직 추가 예정
    };

    return (
        <div className="p-6">
            <ListSearchBox />
            <div className="flex justify-end mb-4">
                <select
                    value={sort}
                    onChange={(e) => {
                        const params = new URLSearchParams(searchParams);
                        params.set("sort", e.target.value);
                        params.set("page", "0"); // 정렬 바꾸면 페이지 초기화
                        navigate({ search: params.toString() }, { replace: true });
                    }}
                    className="border px-3 py-2 rounded text-sm"
                >
                    {sortOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            <p className="text-sm text-gray-500 mt-4">
                총 {results.length}개 숙소 / 페이지 {page + 1} / {totalPages}
            </p>
            <p className="text-sm text-gray-500 mt-2">
                정렬 기준: {sortOptions.find(opt => opt.value === sort)?.label}
            </p>
            {loading ? (
                <div className="text-center text-gray-500 mt-12">⏳ 로딩 중...</div>
            ) : results.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                    😢 조건에 맞는 숙소가 없습니다. 다시 검색해보세요!
                </div>
            ) : (
                <AnimatePresence>
                    <motion.div
                        key={`motion-page-${page}`}
                        className="flex flex-col gap-6"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {results.map((item, index) => (
                            <AccommodationCard
                                key={item.id && item.id !== "" ? `accommodation-${item.id}` : `accommodation-${index}`}
                                item={item}
                                index={index}
                                toggleWish={toggleWish}
                                isLoggedIn={!!userId}
                                checkIn={checkIn}
                                checkOut={checkOut}
                                userId={userId}
                            />
                        ))}
                    </motion.div>

                    <div className="flex justify-center mt-8 gap-2">
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    const params = new URLSearchParams(searchParams);
                                    params.set("page", i);
                                    navigate({ search: params.toString() }, { replace: true });
                                }}
                                className={`px-3 py-1 rounded-md border ${
                                    i === page ? "bg-yellow-400 text-white" : "bg-white text-gray-700"
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </AnimatePresence>
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