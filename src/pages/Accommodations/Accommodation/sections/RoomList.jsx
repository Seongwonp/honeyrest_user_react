import { useNavigate } from "react-router-dom";
import { FaUserFriends } from "react-icons/fa";
import { HiInformationCircle, HiChevronRight } from "react-icons/hi";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";

const MotionDiv = motion.div;

// 객실 선택 목록 — 예약 가능한 객실만 클릭/키보드로 객실 상세 이동
function RoomList({ rooms, checkIn, checkOut, guests, sectionRefs }) {
    const navigate = useNavigate();

    return (
        <section id="rooms" ref={(el) => (sectionRefs.current["rooms"] = el)} className="space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-leaf-green/10 flex items-center justify-center">
                    <HiInformationCircle className="text-leaf-green text-xl" />
                </div>
                <h2 className="text-2xl font-black text-deep-gray">객실 선택</h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {rooms.map((room, i) => {
                    const isAvailable = room.available;
                    const imageUrl = room.images?.find((img) => img.includes("s_")) || room.images?.[0];
                    return (
                        <MotionDiv
                            key={room.roomId ?? i}
                            whileHover={isAvailable ? { y: -5 } : {}}
                            onClick={() => isAvailable && navigate(`/room/${room.roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}
                            // 키보드 접근: Enter / Space 로 객실 상세 이동
                            role="link"
                            tabIndex={isAvailable ? 0 : -1}
                            aria-disabled={!isAvailable || undefined}
                            onKeyDown={(e) => {
                                if (!isAvailable) return;
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault();
                                    navigate(`/room/${room.roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
                                }
                            }}
                            className={`flex flex-col md:flex-row gap-6 p-6 bg-white rounded-[2rem] border border-gray-100 shadow-sm transition-all duration-300 ${isAvailable ? "hover:shadow-2xl hover:shadow-leaf-green/5 cursor-pointer focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-leaf-green/30" : "opacity-40 grayscale pointer-events-none"}`}
                        >
                            <div className="w-full md:w-56 h-40 overflow-hidden rounded-2xl">
                                <SafeImage src={imageUrl} alt={room.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 flex flex-col justify-between py-2">
                                <div className="space-y-2">
                                    <h3 className="text-xl font-black text-deep-gray">{room.name}</h3>
                                    <div className="flex items-center gap-2 text-gray-400 text-sm font-bold uppercase tracking-wider">
                                        <FaUserFriends size={14} />
                                        <span>기준 {room.standardOccupancy}명 / 최대 {room.maxOccupancy}명</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-4">
                                    <p className="text-2xl font-black text-leaf-green">
                                        {isAvailable ? `₩${room.price.toLocaleString()}` : "예약 마감"}
                                    </p>
                                    {isAvailable && (
                                        <div className="flex items-center gap-2 text-sm font-bold text-gray-300">
                                            <span>객실 상세보기</span>
                                            <HiChevronRight />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </MotionDiv>
                    );
                })}
            </div>
        </section>
    );
}

export default RoomList;
