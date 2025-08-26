import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {FaStar} from "react-icons/fa";
import { Link } from "react-router-dom";

function AccommodationCard({ item, index, toggleWish, isLoggedIn, userId, checkIn, checkOut, guests }) {
    console.log("AccommodationCard 렌더링됨:", item);
    return (
        <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition border border-gray-200 relative ${
                item.available === false ? "opacity-50 pointer-events-none" : "hover:shadow-lg"
            }`}>
            <Link
                to={`/accommodations/${item.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&userId=${userId}`}
            >
                <div className="flex flex-col md:flex-row gap-4 p-4 cursor-pointer">
                    <img
                        src={item.image}
                        alt={item.title}
                        className={`w-full md:w-48 h-32 object-cover rounded-md ${
                            item.available === false ? "grayscale brightness-75" : ""
                        }`}
                    />
                    {item.available === false && (
                        <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                            품절
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.location}</p>
                        <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <FaStar className="text-yellow-500" />
                            {item.rating} / 리뷰 {item.reviewCount.toLocaleString()}개
                        </div>
                        <div className="mt-2 text-sm">
                            {item.originalPrice && item.originalPrice > item.price && (
                                <span className="line-through text-gray-400 mr-2">
                                    ₩{item.originalPrice.toLocaleString()}
                                </span>
                            )}
                            <span className="text-red-500 font-bold text-lg">
                                ₩{item.price.toLocaleString()}
                            </span>
                        </div>
                        {item.tags && item.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2 text-xs">
                                {item.tags.map((tag, i) => {
                                    const IconComponent =
                                        FaIcons[tag.iconName] ||
                                        RiIcons[tag.iconName] ||
                                        MdIcons[tag.iconName] ||
                                        null;
                                    return (
                                        <span
                                            key={tag.mapId || `tag-${i}`}
                                            className={`px-2 py-1 rounded-full font-medium border ${
                                                tag.tagCategory === "취향"
                                                    ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                                    : tag.tagCategory === "시설"
                                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                                        : "bg-gray-100 text-gray-700 border-gray-200"
                                            }`}
                                        >
                                            {IconComponent && <IconComponent className="inline mr-1" />}
                                            {tag.tagName}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Link>

            {/* 찜 버튼 */}
            <button
                onClick={() => toggleWish(item.id, index)}
                disabled={!isLoggedIn}
                className={`absolute top-4 right-4 text-xl ${
                    !isLoggedIn
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-red-500 hover:scale-110 transition"
                }`}
                title={!isLoggedIn ? "로그인 후 찜하기 가능" : "찜하기"}
            >
                {item.isWishlisted ? <AiFillHeart /> : <AiOutlineHeart />}
            </button>
        </div>
    );
}

export default AccommodationCard;