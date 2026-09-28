import { FaBed, FaCalendarAlt, FaUserFriends, FaMapMarkerAlt } from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";
import { cardClass, eyebrowClass } from "@/components/ui/styles";

// 숙소 및 객실 정보 요약 카드
function StaySummaryCard({ accommodationThumbnail, accommodationName, accommodationAddress, roomName, checkIn, checkOut, guests }) {
    return (
        <div className={`${cardClass} p-6`}>
            {/* 숙소 썸네일 및 정보 */}
            <div className="mb-6 flex items-center gap-4">
                <SafeImage
                    src={accommodationThumbnail}
                    alt="숙소 썸네일"
                    className="w-16 h-16 shrink-0 object-cover rounded-2xl"
                />
                <div className="min-w-0">
                    <h3 className="text-lg font-black text-deep-gray leading-tight break-keep">{accommodationName}</h3>
                    <p className="text-xs text-gray-400 flex items-start gap-1 mt-1">
                        <FaMapMarkerAlt className="shrink-0 mt-0.5"/> <span className="break-keep">{accommodationAddress}</span>
                    </p>
                </div>
            </div>

            {/* 객실 정보 */}
            <div className="mb-4">
                <p className={`${eyebrowClass} flex items-center gap-1.5`}>
                    <FaBed /> 객실명
                </p>
                <p className="text-sm font-bold text-deep-gray mt-1">{roomName}</p>
            </div>

            <div className="mb-4">
                <p className={`${eyebrowClass} flex items-center gap-1.5`}>
                    <FaCalendarAlt /> 체크인 / 체크아웃
                </p>
                <p className="text-sm font-bold text-deep-gray mt-1">{checkIn} ~ {checkOut}</p>
            </div>

            <div className="mb-4">
                <p className={`${eyebrowClass} flex items-center gap-1.5`}>
                    <FaUserFriends /> 인원
                </p>
                <p className="text-sm font-bold text-deep-gray mt-1">{guests}명</p>
            </div>
        </div>
    );
}

export default StaySummaryCard;
