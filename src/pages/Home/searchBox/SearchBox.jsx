import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { differenceInCalendarDays } from "date-fns";
import DateRangeModal from "./DateRangeModal";

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

    const safeCheckIn = checkIn ? new Date(checkIn) : null;
    const safeCheckOut = checkOut ? new Date(checkOut) : null;

    const nights =
        safeCheckIn && safeCheckOut && !isNaN(safeCheckIn) && !isNaN(safeCheckOut)
            ? Math.max(1, differenceInCalendarDays(safeCheckOut, safeCheckIn))
            : 0;

    return (
        <div className="relative z-30 px-4 max-sm:px-2">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="w-full max-w-4xl mx-auto px-4 py-6 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg space-y-6"
                data-aos="fade-up"
                data-aos-delay="1100"
            >
                {/* 타이틀 */}
                <h2 className="text-xl sm:text-2xl font-bold text-neutral-900 text-center">숙소 검색하기 🐝</h2>
                <p className="text-sm sm:text-base text-gray-600 text-center">
                    원하는 지역과 날짜를 선택하면 숙소를 빠르게 찾아드릴게요! ✈️
                </p>

                {/* 입력 필드들 */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    {/* 지역 입력 */}
                    <div className="flex items-center border rounded-lg px-4 py-3 bg-white shadow-sm flex-1">
                        <HiOutlineSearch className="text-2xl text-yellow-400 mr-3" />
                        <input
                            type="text"
                            placeholder="지역 또는 도시명을 입력하세요"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full text-base outline-none bg-transparent placeholder-gray-400"
                        />
                    </div>

                    {/* 날짜 선택 */}
                    <div
                        onClick={() => setShowCalendar(true)}
                        className="flex-1 border rounded-lg px-4 py-3 bg-white shadow-sm cursor-pointer hover:bg-gray-50 transition"
                    >
                        <div className="flex items-center mb-1">
                            <FiCalendar className="text-2xl text-yellow-400 mr-3" />
                            <span className="text-sm text-gray-500">날짜 선택</span>
                        </div>
                        <span className="text-base font-semibold block">
              {checkIn && checkOut
                  ? `${checkIn} ~ ${checkOut} (${nights}박)`
                  : "날짜를 선택해주세요"}
            </span>
                    </div>

                    {/* 인원 선택 */}
                    <div className="flex-1 border rounded-lg px-4 py-3 bg-white shadow-sm">
                        <div className="flex items-center mb-1">
                            <FaUserFriends className="text-2xl text-yellow-400 mr-3" />
                            <span className="text-sm text-gray-500">인원수 선택</span>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                            <button
                                type="button"
                                onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg font-bold text-base"
                            >
                                −
                            </button>
                            <span className="text-base font-semibold">
                {guests >= 10 ? "10+명" : `${guests}명`}
              </span>
                            <button
                                type="button"
                                onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-lg font-bold text-base"
                            >
                                ＋
                            </button>
                        </div>
                    </div>
                </div>

                {/* 검색 버튼 */}
                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-bold py-3 rounded-lg shadow-md transition flex items-center justify-center gap-2 text-lg"
                >
                    <HiOutlineSearch className="text-xl icon-shake" />
                    검색하기
                </button>
            </form>

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