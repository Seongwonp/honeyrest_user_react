function PlaceList({ categories, selectedCategory, setSelectedCategory, filteredPlaces }) {
    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#4B5563] mb-6 text-center"> 인기 추천 숙소</h2>
            <div className="flex flex-wrap gap-3 mb-6 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-full border ${
                            selectedCategory === cat ? "bg-yellow-400 text-white" : "bg-white text-[#4B5563]"
                        } hover:bg-yellow-500 transition`}
                    >
                        {cat}
                    </button>
                ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPlaces.map((place, idx) => (
                    <div
                        key={idx}
                        className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                        data-aos="fade-up"
                        data-aos-delay={idx * 100}
                    >
                        <img src={place.image} alt={place.title} className="w-full h-48 object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-[#4B5563]">{place.title}</h3>
                            <p className="text-sm text-gray-500">{place.location}</p>
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-yellow-600 font-bold">{place.price}</span>
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