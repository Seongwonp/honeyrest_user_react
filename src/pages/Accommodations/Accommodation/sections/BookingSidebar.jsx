// 우측 고정 예약 위젯 (일정·인원 요약, 최저가, 객실 섹션으로 스크롤)
function BookingSidebar({ checkIn, checkOut, guests, price, onModify }) {
    return (
        <aside className="lg:col-span-4 sticky top-24">
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl space-y-8">
                <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stay Duration</p>
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-deep-gray tracking-tight">일정 및 인원</h3>
                        <button
                            onClick={onModify}
                            className="text-xs font-black text-honey-yellow-dark hover:underline"
                        >
                            Modify
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-2xl space-y-3">
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-400">Check-in</span>
                            <span className="font-black text-deep-gray">{checkIn}</span>
                        </div>
                        <div className="h-px bg-gray-200/50" />
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-400">Check-out</span>
                            <span className="font-black text-deep-gray">{checkOut}</span>
                        </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-2xl flex justify-between items-center text-sm">
                        <span className="font-bold text-gray-400">Guests</span>
                        <span className="font-black text-deep-gray">{guests}명</span>
                    </div>
                </div>

                <div className="pt-6 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Starts from</span>
                        <p className="text-3xl font-black text-leaf-green">₩{price.toLocaleString()}</p>
                    </div>
                    <button
                        onClick={() => document.getElementById('rooms').scrollIntoView({ behavior: 'smooth' })}
                        className="px-6 py-4 bg-honey-yellow text-deep-gray rounded-2xl font-black shadow-lg shadow-honey-yellow/20 hover:scale-105 active:scale-95 transition-all"
                    >
                        Book Now
                    </button>
                </div>
            </div>
        </aside>
    );
}

export default BookingSidebar;
