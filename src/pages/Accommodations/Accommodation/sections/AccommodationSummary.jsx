import React from "react";
import { HiLocationMarker, HiStar } from "react-icons/hi";
import WishToggleButton from "@/components/WishToggleButton.jsx";
import { getTagIcon } from "@/utils/tagIcons";

// 숙소 기본 정보 (카테고리·주소, 이름, 평점, 리뷰 수, 찜, 태그)
function AccommodationSummary({ data, accommodationId, isWished, userId }) {
    return (
        <header className="space-y-6">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-leaf-green">
                    <HiLocationMarker />
                    <span className="text-xs font-black uppercase tracking-widest">{data.category} · {data.address}</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-deep-gray tracking-tight leading-tight">
                    {data.name}
                </h1>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
                <div className="flex items-center gap-2 px-4 py-2 bg-honey-yellow/10 rounded-2xl">
                    <HiStar className="text-honey-yellow text-xl" />
                    <span className="text-lg font-black text-honey-yellow-dark">{data.rating.toFixed(1)}</span>
                </div>
                <div className="h-4 w-px bg-gray-200" />
                <p className="text-sm font-bold text-gray-400">리뷰 <span className="text-deep-gray">{data.reviewCount}개</span></p>
                <div className="h-4 w-px bg-gray-200" />
                <div className="flex items-center gap-2">
                    <WishToggleButton
                        accommodationId={accommodationId}
                        initialLiked={isWished}
                        userId={userId}
                    />
                    <span className="text-sm font-bold text-gray-400">관심 숙소 등록</span>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-4">
                {data.tags.map((tag, i) => (
                    <span key={tag.mapId ?? tag.tagId ?? tag.name ?? i} className="px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-2 text-xs font-bold text-gray-500">
                        {getTagIcon(tag.iconName) &&
                            React.createElement(getTagIcon(tag.iconName), { className: "text-honey-yellow" })}
                        {tag.name}
                    </span>
                ))}
            </div>
        </header>
    );
}

export default AccommodationSummary;
