import {useEffect, useState} from "react";
import axios from "axios";
import CategorySelector from "./CategorySelector";

function PlaceList() {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("전체");
    const [places, setPlaces] = useState([]);

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
        const params = selectedCategory === "전체" ? {} : {category: selectedCategory};
        axios
            .get("/api/accommodations/popular", {params})
            .then((res) => setPlaces(res.data));
    }, [selectedCategory]);

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#4B5563] mb-6 text-center">인기 추천 숙소</h2>

            <CategorySelector
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {places.map((place, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay={idx * 100}
                    >
                        <img src={place.image} alt={place.title} className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#4B5563]">{place.title}</h3>
                            <p className="text-sm text-gray-500">{place.location}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-yellow-600 font-bold">
                                    ₩{new Intl.NumberFormat("ko-KR").format(place.price)}
                                    <span className="text-xs text-gray-500 ml-1">/ 1박</span>
                                </span>
                                <span className="text-sm text-gray-700">⭐ {place.rating}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlaceList;