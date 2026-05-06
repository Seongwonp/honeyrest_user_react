import { useEffect, useState } from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { HiLocationMarker, HiStar } from "react-icons/hi";
import axios from "axios";
import CategorySelector from "./CategorySelector";
import { motion, AnimatePresence } from "framer-motion";

function PlaceList() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [places, setPlaces] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        axios.get("/api/accommodations/categories").then((res) => {
            const allCategory = {
                categoryId: 0,
                name: "전체",
                iconUrl: "https://cdn-icons-png.flaticon.com/512/5110/5110754.png",
                sortOrder: 0,
            };
            setCategories([allCategory, ...res.data]);
        });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        const params = selectedCategory === "전체" ? {} : { category: selectedCategory };
        axios
            .get("/api/accommodations/popular", { params })
            .then((res) => setPlaces(res.data));
    }, [selectedCategory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlaces = places.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(places.length / itemsPerPage);

    return (
        <section className="space-y-12" data-aos="fade-up">
            <div className="text-center space-y-4">
                <h2 className="text-3xl md:text-4xl font-black text-deep-gray tracking-tight">
                    나만을 위한 <span className="text-leaf-green">추천 숙소</span>
                </h2>
                <p className="text-gray-400 font-medium">카테고리별로 가장 인기 있는 숙소들을 엄선했습니다.</p>
            </div>

            <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="wait">
                    {currentPlaces.map((place, idx) => (
                        <motion.a
                            href={`/accommodations/${place.id}`}
                            key={place.id || idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group"
                        >
                            <div className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-leaf-green/10 transition-all duration-500 h-full flex flex-col">
                                <div className="relative h-64 overflow-hidden">
                                    <img 
                                        src={place.image} 
                                        alt={place.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1 shadow-sm">
                                        <HiStar className="text-honey-yellow text-lg" />
                                        <span className="text-sm font-bold text-deep-gray">{place.rating}</span>
                                    </div>
                                </div>
                                
                                <div className="p-6 flex-1 flex flex-col space-y-3">
                                    <div className="flex items-center gap-1 text-gray-400">
                                        <HiLocationMarker className="text-xs" />
                                        <span className="text-xs font-bold uppercase tracking-wider">{place.location}</span>
                                    </div>
                                    <h3 className="text-lg font-black text-deep-gray line-clamp-1 group-hover:text-leaf-green transition-colors">
                                        {place.title}
                                    </h3>
                                    
                                    <div className="pt-4 mt-auto border-t border-gray-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starts from</span>
                                            <span className="text-xl font-black text-deep-gray">
                                                ₩{new Intl.NumberFormat("ko-KR").format(place.price)}
                                                <span className="text-xs font-bold text-gray-400 ml-1">/ night</span>
                                            </span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-leaf-green/10 text-leaf-green flex items-center justify-center group-hover:bg-leaf-green group-hover:text-white transition-all duration-300">
                                            <FaChevronRight size={14} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.a>
                    ))}
                </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-6 pt-10">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-lg hover:text-deep-gray disabled:opacity-30 disabled:hover:shadow-none transition-all"
                    >
                        <FaChevronLeft size={14} />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-black text-deep-gray">{currentPage}</span>
                        <span className="text-sm font-bold text-gray-300">/</span>
                        <span className="text-sm font-bold text-gray-400">{totalPages}</span>
                    </div>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="w-12 h-12 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-white hover:shadow-lg hover:text-deep-gray disabled:opacity-30 disabled:hover:shadow-none transition-all"
                    >
                        <FaChevronRight size={14} />
                    </button>
                </div>
            )}
        </section>
    );
}

export default PlaceList;
