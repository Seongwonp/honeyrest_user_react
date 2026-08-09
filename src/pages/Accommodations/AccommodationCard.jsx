import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import { HiStar, HiLocationMarker, HiCheckCircle } from "react-icons/hi";
import { Link } from "react-router-dom";
import WishToggleButton from "@/components/WishToggleButton.jsx";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";

function AccommodationCard({ item, userId, checkIn, checkOut, guests }) {
    const isSoldOut = item.available === false;

    return (
        <div className={`relative bg-white rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-leaf-green/5 transition-all duration-500 overflow-hidden ${isSoldOut ? "opacity-60" : ""}`}>
            <Link
                to={`/accommodations/${item.id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
                className="flex flex-col md:flex-row gap-6 p-6"
            >
                {/* 이미지 섹션 */}
                <div className="relative w-full md:w-64 h-48 shrink-0 overflow-hidden rounded-2xl">
                    <SafeImage
                        src={item.image}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-700 ${!isSoldOut ? "hover:scale-110" : "grayscale"}`}
                    />
                    {isSoldOut && (
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center">
                            <span className="text-white font-black tracking-widest uppercase py-2 px-4 border-2 border-white rounded-xl">Sold Out</span>
                        </div>
                    )}
                </div>

                {/* 콘텐츠 섹션 */}
                <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="space-y-2">
                        <div className="flex items-center gap-1 text-gray-400">
                            <HiLocationMarker size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">{item.location}</span>
                        </div>
                        <h3 className="text-xl font-black text-deep-gray group-hover:text-leaf-green transition-colors leading-tight">
                            {item.title}
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-honey-yellow/10 px-2 py-1 rounded-lg">
                                <HiStar className="text-honey-yellow" size={14} />
                                <span className="text-xs font-black text-honey-yellow-dark">{item.rating}</span>
                            </div>
                            <span className="text-xs font-bold text-gray-400">리뷰 {item.reviewCount.toLocaleString()}개</span>
                        </div>
                        
                        {/* 태그 */}
                        <div className="flex flex-wrap gap-1.5 pt-2">
                            {item.tags?.slice(0, 3).map((tag, i) => {
                                const IconComponent = FaIcons[tag.iconName] || RiIcons[tag.iconName] || MdIcons[tag.iconName];
                                return (
                                    <span
                                        key={tag.mapId || i}
                                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-100 text-[10px] font-bold text-gray-500"
                                    >
                                        {IconComponent && <IconComponent size={10} />}
                                        {tag.tagName}
                                    </span>
                                );
                            })}
                            {item.tags?.length > 3 && (
                                <span className="text-[10px] font-bold text-gray-300 self-center">+${item.tags.length - 3}</span>
                            )}
                        </div>
                    </div>

                    <div className="mt-6 md:mt-0 flex items-end justify-between border-t border-gray-50 pt-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Price per night</span>
                            <div className="flex items-baseline gap-2">
                                {item.originalPrice > item.price && (
                                    <span className="text-sm text-gray-300 line-through font-bold">₩{item.originalPrice.toLocaleString()}</span>
                                )}
                                <span className="text-2xl font-black text-deep-gray">₩{item.price.toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 text-leaf-green font-bold text-xs">
                            <HiCheckCircle />
                            <span>예약 가능</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* 찜 버튼 */}
            <div className="absolute top-8 right-8 z-10">
                <WishToggleButton
                    accommodationId={item.id}
                    initialLiked={item.isWishlisted}
                    userId={userId}
                />
            </div>
        </div>
    );
}

export default AccommodationCard;
