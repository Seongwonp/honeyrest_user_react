import {AiFillHeart, AiOutlineHeart} from "react-icons/ai";
import {FaStar} from "react-icons/fa";

function AccommodationCard({item, index, toggleWish, isLoggedIn}) {
    return (
        <div
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-200 relative">
            <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* 이미지 썸네일 */}
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full md:w-48 h-32 object-cover rounded-md"
                />

                {/* 숙소 정보 */}
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.location}</p>

                    <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <FaStar className="text-yellow-500"/>
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

                    {/* 태그 표시 */}
                    {item.tags && item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                            {item.tags.map((tag, i) => (
                                <span
                                    key={tag.mapId && tag.mapId !== "" ? tag.mapId : `tag-${i}`}
                                    className={`px-2 py-1 rounded-full font-medium border ${
                                        tag.tagCategory === "취향"
                                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                                            : tag.tagCategory === "시설"
                                                ? "bg-blue-100 text-blue-800 border-blue-300"
                                                : "bg-gray-100 text-gray-700 border-gray-300"
                                    }`}
                                >
                                #{tag.tagName}
                            </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

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
                {item.isWishlisted ? <AiFillHeart/> : <AiOutlineHeart/>}
            </button>
        </div>
    );
}

export default AccommodationCard;