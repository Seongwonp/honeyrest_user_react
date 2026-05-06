import React from "react";
import { motion } from "framer-motion";

function CategorySelector({ categories, selectedCategory, setSelectedCategory }) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((cat) => (
                <button
                    key={cat.categoryId}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`relative flex items-center gap-3 px-6 py-3.5 rounded-2xl transition-all duration-500 overflow-hidden group
                        ${selectedCategory === cat.name
                        ? "text-white shadow-xl shadow-leaf-green/20"
                        : "bg-white text-gray-500 hover:text-leaf-green border border-gray-100 hover:border-leaf-green/20"}`}
                >
                    {selectedCategory === cat.name && (
                        <motion.div 
                            layoutId="category-bg"
                            className="absolute inset-0 bg-leaf-green"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    
                    <div className="relative z-10 flex items-center gap-3">
                        <img 
                            src={cat.iconUrl} 
                            alt={cat.name} 
                            className={`w-5 h-5 transition-all duration-300 ${selectedCategory === cat.name ? "brightness-0 invert" : "grayscale group-hover:grayscale-0"}`} 
                        />
                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default CategorySelector;
