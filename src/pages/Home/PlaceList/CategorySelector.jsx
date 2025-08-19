import React from "react";

function CategorySelector({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="flex flex-wrap gap-4 justify-center mb-6">
            {categories.map((cat) => (
                <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-xl shadow-md transition-all duration-300
                        ${selectedCategory === cat.name
                        ? "bg-yellow-400 text-white shadow-lg scale-[1.05]"
                        : "bg-white text-gray-700 hover:bg-yellow-100"}`}
                >
                    <img src={cat.iconUrl} alt={cat.name} className="w-6 h-6" />
                    <span className="font-semibold">{cat.name}</span>
                </button>
            ))}
        </div>
    );
}

export default CategorySelector;