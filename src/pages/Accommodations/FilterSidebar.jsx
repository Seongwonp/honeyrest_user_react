import { useEffect, useState } from "react";
import { MdAttachMoney, MdRefresh } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import * as FaIcons from "react-icons/fa";

function FilterSidebar({ onFilterChange, openMapSearch }) {
    const [categories, setCategories] = useState([]);
    const [tags, setTags] = useState([]);
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000000 });

    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedPrice, setSelectedPrice] = useState(1000000);
    const [tempPrice, setTempPrice] = useState(1000000);

    const [expandedGroups, setExpandedGroups] = useState({});

    useEffect(() => {
        Promise.all([
            fetch("/api/accommodations/categories").then(res => res.json()),
            fetch("/api/accommodations/price-range").then(res => res.json()),
            fetch("/api/accommodations/tags").then(res => res.json()),
        ])
            .then(([cats, price, tagList]) => {
                setCategories(cats);
                setPriceRange(price);
                setSelectedPrice(price.max);
                setTempPrice(price.max);
                setTags(tagList);
            })
            .catch(err => console.error("❌ 필터 옵션 불러오기 실패:", err));
    }, []);

    const applyFilters = (updated = {}) => {
        onFilterChange({
            categories: updated.categories ?? selectedCategories,
            tags: updated.tags ?? selectedTags,
            maxPrice: updated.maxPrice ?? selectedPrice,
        });
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value;
        const updated = e.target.checked
            ? [...selectedCategories, value]
            : selectedCategories.filter(v => v !== value);

        setSelectedCategories(updated);
        applyFilters({ categories: updated });
    };

    const confirmPrice = () => {
        setSelectedPrice(tempPrice);
        applyFilters({ maxPrice: tempPrice });
    };

    const toggleGroup = (category) => {
        setExpandedGroups(prev => ({
            ...prev,
            [category]: !prev[category],
        }));
    };

    const resetFilters = () => {
        setSelectedCategories([]);
        setSelectedTags([]);
        setSelectedPrice(priceRange.max);
        setTempPrice(priceRange.max);
        applyFilters({ categories: [], tags: [], maxPrice: priceRange.max });
    };

    const groupedTags = tags.reduce((acc, tag) => {
        if (!acc[tag.category]) acc[tag.category] = [];
        acc[tag.category].push(tag);
        return acc;
    }, {});

    return (
        <div>
            <div className="mb-6">
                <h3 className="font-semibold mb-2">위치 기반 검색</h3>
                <button
                    onClick={openMapSearch}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                    📍 지도에서 숙소 찾기
                </button>
            </div>

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">필터</h2>
                <button
                    onClick={resetFilters}
                    className="flex items-center gap-1 text-sm text-blue-500 hover:underline"
                >
                    <MdRefresh />
                    초기화
                </button>
            </div>

            <AnimatePresence>
                {(selectedCategories.length > 0 || selectedTags.length > 0 || selectedPrice < priceRange.max) && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mb-4 text-sm text-gray-700"
                    >
                        <h3 className="font-semibold mb-2">선택된 필터</h3>
                        <div className="flex flex-wrap gap-2">
                            {selectedCategories.map((cat) => (
                                <span key={cat} className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                                    {cat}
                                    <button onClick={() => {
                                        const updated = selectedCategories.filter(v => v !== cat);
                                        setSelectedCategories(updated);
                                        applyFilters({ categories: updated });
                                    }}>
                                        <RxCross2 className="text-blue-600 hover:text-blue-800" />
                                    </button>
                                </span>
                            ))}
                            {selectedTags.map((tag) => (
                                <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                    #{tag}
                                    <button onClick={() => {
                                        const updated = selectedTags.filter(t => t !== tag);
                                        setSelectedTags(updated);
                                        applyFilters({ tags: updated });
                                    }}>
                                        <RxCross2 className="text-yellow-600 hover:text-yellow-800" />
                                    </button>
                                </span>
                            ))}
                            {selectedPrice < priceRange.max && (
                                <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-800 rounded-full">
                                    최대 {selectedPrice.toLocaleString()}원
                                    <button onClick={() => {
                                        setSelectedPrice(priceRange.max);
                                        setTempPrice(priceRange.max);
                                        applyFilters({ maxPrice: priceRange.max });
                                    }}>
                                        <RxCross2 className="text-green-600 hover:text-green-800" />
                                    </button>
                                </span>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="mb-6">
                <h3 className="font-semibold mb-2">숙소 유형</h3>
                <div className="flex flex-col gap-2 text-sm">
                    {categories.map((cat) => (
                        <label key={cat.categoryId}>
                            <input
                                type="checkbox"
                                value={cat.name}
                                checked={selectedCategories.includes(cat.name)}
                                onChange={handleCategoryChange}
                            />{" "}
                            {cat.name}
                        </label>
                    ))}
                </div>
            </div>

            <div className="mb-6">
                <h3 className="font-semibold mb-2 flex items-center gap-1">
                    <MdAttachMoney className="text-yellow-500" />
                    가격 범위
                </h3>
                <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    step={10000}
                    value={tempPrice}
                    onChange={(e) => setTempPrice(Number(e.target.value))}
                    onMouseUp={confirmPrice}
                    onTouchEnd={confirmPrice}
                    className="w-full h-3 accent-yellow-500"
                />
                <p className="text-sm mt-2 text-gray-700 text-center">
                    {priceRange.min.toLocaleString()}원 ~{" "}
                    <span className="font-semibold text-yellow-600">
                        {tempPrice.toLocaleString()}원
                    </span>
                </p>
            </div>

            <div className="overflow-y-auto max-h-120 pr-1 mb-6">
                {Object.entries(groupedTags).map(([category, tagList]) => {
                    const isExpanded = expandedGroups[category];
                    const visibleTags = isExpanded ? tagList : tagList.slice(0, 10);

                    return (
                        <div key={category} className="mb-6">
                            <h3 className="font-semibold mb-2">{category}</h3>
                            <div className="flex flex-wrap gap-2 text-sm">
                                {visibleTags.map((tag) => {
                                    const IconComponent = RiIcons[tag.iconName] || MdIcons[tag.iconName] || FaIcons[tag.iconName] || null;
                                    return (
                                        <button
                                            key={tag.tagId}
                                            onClick={() => {
                                                const updated = selectedTags.includes(tag.name)
                                                    ? selectedTags.filter(t => t !== tag.name)
                                                    : [...selectedTags, tag.name];

                                                setSelectedTags(updated);
                                                applyFilters({ tags: updated });
                                            }}
                                            className={`px-2 py-1 rounded border ${
                                                selectedTags.includes(tag.name)
                                                    ? "bg-yellow-100 border-yellow-400 text-yellow-700"
                                                    : "border-gray-300 text-gray-600"
                                            } flex items-center gap-1`}
                                        >
                                            {IconComponent && <IconComponent className="text-yellow-500" />}
                                            {tag.name}
                                        </button>
                                    );
                                })}
                            </div>
                            {tagList.length > 10 && (
                                <button
                                    onClick={() => toggleGroup(category)}
                                    className="mt-2 text-xs text-blue-500 hover:underline"
                                >
                                    {isExpanded ? "접기" : "더 보기"}
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default FilterSidebar;
