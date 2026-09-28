import { FaCalendarAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import DateRangeModal from "@/pages/Home/searchBox/DateRangeModal.jsx";

const MotionDiv = motion.div;

/**
 * 일정·인원 변경 모달 + 중첩 날짜 선택 모달
 * - 모든 상태(임시 체크인/아웃, 인원, 모달 표시 여부)는 부모(Accommodation)가 소유
 */
function StayChangeModal({
    isOpen,
    onClose,
    isDateRangeOpen,
    setIsDateRangeOpen,
    tempCheckIn,
    tempCheckOut,
    tempGuests,
    setTempCheckIn,
    setTempCheckOut,
    setTempGuests,
    isChangeReady,
    onApply,
}) {
    return (
        <>
            {/* Change Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" />
                        <MotionDiv initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="fixed inset-0 z-[210] flex items-center justify-center p-6">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 max-w-md w-full space-y-8 relative">
                                <div className="text-center space-y-2">
                                    <h2 className="text-2xl font-black text-deep-gray tracking-tight">예약 정보 변경</h2>
                                    <p className="text-sm text-gray-400 font-medium">원하시는 일정과 인원을 다시 선택해 주세요.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Date Range</label>
                                        <button onClick={() => setIsDateRangeOpen(true)} className="w-full flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-honey-yellow/30 transition-all">
                                            <span className="font-bold text-deep-gray">{tempCheckIn && tempCheckOut ? `${tempCheckIn} - ${tempCheckOut}` : "날짜 선택"}</span>
                                            <FaCalendarAlt className="text-honey-yellow" />
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest px-2">Guests Count</label>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                            <button onClick={() => setTempGuests(prev => Math.max(1, parseInt(prev) - 1))} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all font-bold text-xl text-deep-gray">−</button>
                                            <span className="text-xl font-black text-deep-gray">{tempGuests}명</span>
                                            <button onClick={() => setTempGuests(prev => Math.min(10, parseInt(prev) + 1))} className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center hover:bg-gray-100 active:scale-90 transition-all font-bold text-xl text-deep-gray">＋</button>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={onApply}
                                    className="w-full py-4 bg-honey-yellow text-deep-gray rounded-2xl font-black shadow-lg shadow-honey-yellow/20 hover:bg-honey-yellow-dark transition-all disabled:opacity-30"
                                    disabled={!isChangeReady}
                                >
                                    변경 사항 적용하기
                                </button>
                                <button onClick={onClose} className="absolute top-6 right-6 text-gray-300 hover:text-deep-gray transition-colors">Close</button>
                            </div>
                        </MotionDiv>
                    </>
                )}
            </AnimatePresence>

            {/* Date Range Modal (Nested) */}
            <AnimatePresence>
                {isDateRangeOpen && (
                    <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
                        <MotionDiv initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDateRangeOpen(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
                        <MotionDiv initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="relative bg-white rounded-[2.5rem] shadow-2xl p-6">
                            <DateRangeModal
                                isOpen={isDateRangeOpen}
                                onClose={() => setIsDateRangeOpen(false)}
                                onSelect={({ checkIn: ni, checkOut: no }) => { setTempCheckIn(ni); setTempCheckOut(no); setIsDateRangeOpen(false); }}
                                startDate={tempCheckIn}
                                endDate={tempCheckOut}
                            />
                        </MotionDiv>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}

export default StayChangeModal;
