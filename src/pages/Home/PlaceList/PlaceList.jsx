import {useEffect, useState} from "react";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import CategorySelector from "./CategorySelector";

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
                iconUrl: "https://cdn-icons-png.flaticon.com/512/5110/5110754.png", // 전체용 기본 아이콘
                sortOrder: 0,
            };
            setCategories([allCategory, ...res.data]);
        });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
        const params = selectedCategory === "전체" ? {} : {category: selectedCategory};
        axios
            .get("/api/accommodations/popular", {params})
            .then((res) => setPlaces(res.data));
    }, [selectedCategory]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPlaces = places.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#4B5563] mb-6 text-center">인기 추천 숙소</h2>

            <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {currentPlaces.map((place, idx) => (
                    <a
                        href={`/accommodations/${place.id}`}
                        className="block"
                        key={idx}
                    >
                        <div
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                            data-aos="fade-up"
                            data-aos-delay={idx * 100}
                        >
                            <img src={place.image} alt={place.title} className="w-full h-48 object-cover"/>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold text-[#4B5563]">{place.title}</h3>
                                <p className="text-sm text-gray-500">{place.location}</p>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="flex items-center text-yellow-600 font-bold">
                                        ₩{new Intl.NumberFormat("ko-KR").format(place.price)}
                                        <span className="text-xs text-gray-500 ml-1">/ 1박</span>
                                    </span>
                                    <span className="flex items-center text-sm text-gray-700">
                                        <FaStar className="mr-1 text-yellow-500" />
                                        {place.rating}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
            <div className="flex justify-center gap-3 mt-6">
                <button
                    onClick={() => setCurrentPage(prev => Math.max(prev-1, 1))}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 rounded-lg shadow transition ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:shadow-lg'}`}
                >
                    <FaChevronLeft />
                </button>
                <span>{currentPage}</span>
                <button
                    onClick={() => setCurrentPage(prev => Math.min(prev+1, Math.ceil(places.length/itemsPerPage)))}
                    disabled={currentPage === Math.ceil(places.length/itemsPerPage)}
                    className={`px-3 py-1 rounded-lg shadow transition ${currentPage === Math.ceil(places.length/itemsPerPage) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:shadow-lg'}`}
                >
                    <FaChevronRight />
                </button>
            </div>
        </div>
    );
}

export default PlaceList;