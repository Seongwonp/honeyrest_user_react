import { motion } from "framer-motion";
import { FaThLarge, FaHotel, FaHome, FaUmbrellaBeach, FaTree } from "react-icons/fa";
import { MdHolidayVillage } from "react-icons/md";

// 서버 iconUrl 이 비거나 깨져도 모양이 유지되도록 아이콘 폰트 사용
const CATEGORY_ICONS = {
    전체: FaThLarge,
    호텔: FaHotel,
    펜션: FaHome,
    한옥: MdHolidayVillage,
    리조트: FaUmbrellaBeach,
};

function CategoryIcon({ name }) {
    const Icon = CATEGORY_ICONS[name] || FaTree;
    return <Icon aria-hidden="true" className="w-4 h-4 transition-colors duration-300" />;
}

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
                        <CategoryIcon name={cat.name} />
                        <span className="font-bold text-sm tracking-tight">{cat.name}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default CategorySelector;
