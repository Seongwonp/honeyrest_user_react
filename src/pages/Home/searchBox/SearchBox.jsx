import { useState } from "react";
import { HiOutlineSearch, HiLocationMarker } from "react-icons/hi";
import { FiCalendar, FiUsers, FiMinus, FiPlus } from "react-icons/fi";
import { differenceInCalendarDays } from "date-fns";
import DateRangeModal from "./DateRangeModal";
import { motion, AnimatePresence } from "framer-motion";

function SearchBox({
                       location,
                       setLocation,
                       checkIn,
                       setCheckIn,
                       checkOut,
                       setCheckOut,
                       guests,
                       setGuests,
                       today,
                       handleSearch,
                   }) {
    const [showCalendar, setShowCalendar] = useState(false);
    const [isGuestOpen, setIsGuestOpen] = useState(false);

    const safeCheckIn = checkIn ? new Date(checkIn) : null;
    const safeCheckOut = checkOut ? new Date(checkOut) : null;

    const nights =
        safeCheckIn && safeCheckOut && !isNaN(safeCheckIn) && !isNaN(safeCheckOut)
            ? Math.max(1, differenceInCalendarDays(safeCheckOut, safeCheckIn))
            : 0;

    return (
        <div className="relative">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-white rounded-3xl md:rounded-full shadow-2xl p-2 md:p-3 flex flex-col md:flex-row items-stretch gap-2 md:gap-0 border border-gray-100"
            >
                {/* 지역 검색 */}
                <div className="flex-1 flex items-center gap-3 px-6 py-3 md:py-0 md:border-r border-gray-100 group">
                    <HiLocationMarker className="text-honey-yellow text-2xl shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Location</p>
                        <input
                            type="text"
                            placeholder="어디로 떠나시나요?"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-transparent text-sm md:text-base font-semibold text-deep-gray outline-none placeholder-gray-300"
                        />
                    </div>
                </div>

                {/* 날짜 선택 */}
                <button
                    type="button"
                    onClick={() => setShowCalendar(true)}
                    aria-haspopup="dialog"
                    className="flex-1 text-left flex items-center gap-3 px-6 py-3 md:py-0 md:border-r border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                >
                    <FiCalendar className="text-honey-yellow text-2xl shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="flex-1 block">
                        <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Check-in / Out</span>
                        <span className={`block text-sm md:text-base font-semibold ${checkIn ? 'text-deep-gray' : 'text-gray-300'}`}>
                            {checkIn && checkOut ? `${checkIn} - ${checkOut} (${nights}박)` : '날짜를 선택하세요'}
                        </span>
                    </span>
                </button>

                {/* 인원 선택 */}
                <div className="flex-1 relative">
                    <button
                        type="button"
                        onClick={() => setIsGuestOpen(!isGuestOpen)}
                        aria-expanded={isGuestOpen}
                        className="w-full h-full text-left flex items-center gap-3 px-6 py-3 md:py-0 cursor-pointer hover:bg-gray-50/50 transition-colors group"
                    >
                        <FiUsers className="text-honey-yellow text-2xl shrink-0 group-hover:scale-110 transition-transform" />
                        <span className="flex-1 block">
                            <span className="block text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">Guests</span>
                            <span className="block text-sm md:text-base font-semibold text-deep-gray">
                                {guests}명
                            </span>
                        </span>
                    </button>

                    <AnimatePresence>
                        {isGuestOpen && (
                            <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsGuestOpen(false)} />
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    className="absolute top-full mt-4 right-0 md:left-0 w-[240px] bg-white rounded-2xl shadow-2xl p-6 border border-gray-100 z-50"
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-bold text-deep-gray">인원수</p>
                                            <p className="text-xs text-gray-400">최대 10명</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                <FiMinus size={14} />
                                            </button>
                                            <span className="font-bold text-lg min-w-[20px] text-center">{guests}</span>
                                            <button
                                                type="button"
                                                onClick={() => setGuests(prev => Math.min(10, prev + 1))}
                                                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-600 transition-colors"
                                            >
                                                <FiPlus size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* 검색 버튼 */}
                <div className="p-2">
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto h-full px-8 py-4 md:py-0 bg-honey-yellow hover:bg-honey-yellow-dark text-deep-gray font-bold rounded-2xl md:rounded-full transition-all flex items-center justify-center gap-2 shadow-lg shadow-honey-yellow/20 active:scale-95"
                    >
                        <HiOutlineSearch className="text-xl" />
                        <span className="md:hidden lg:inline">검색하기</span>
                    </button>
                </div>
            </motion.div>

            {/* 날짜 선택 모달 */}
            <DateRangeModal
                isOpen={showCalendar}
                onClose={() => setShowCalendar(false)}
                onSelect={({ checkIn, checkOut }) => {
                    setCheckIn(checkIn);
                    setCheckOut(checkOut);
                }}
                startDate={checkIn || today}
                endDate={checkOut || today}
            />
        </div>
    );
}

export default SearchBox;
