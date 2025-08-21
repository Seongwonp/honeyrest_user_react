import { useState } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { FiCalendar } from "react-icons/fi";
import { FaUserFriends } from "react-icons/fa";
import { format, differenceInCalendarDays } from "date-fns";
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
                       handleSearch
                   }) {
    const [showCalendar, setShowCalendar] = useState(false);

    const safeCheckIn = checkIn ? new Date(checkIn) : null;
    const safeCheckOut = checkOut ? new Date(checkOut) : null;

    const nights =
        safeCheckIn && safeCheckOut && !isNaN(safeCheckIn) && !isNaN(safeCheckOut)
            ? Math.max(1, differenceInCalendarDays(safeCheckOut, safeCheckIn))
            : 0;

    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                }}
                className="bg-white rounded-xl shadow-md px-6 py-6 w-full max-w-4xl mx-auto"
                data-aos="fade-up"
                data-aos-delay="1100"
            >
                <h2 className="text-2xl font-bold text-gray-700 mb-2 text-center">숙소 검색하기 🏡</h2>
                <p className="text-base text-gray-500 text-center mb-4">
                    원하는 지역과 날짜를 선택하면 숙소를 빠르게 찾아드릴게요! ✈️
                </p>

                <div className="flex flex-wrap gap-4">
                    {/* 지역 입력 */}
                    <div className="flex items-center border rounded-md px-4 py-2 flex-1 min-w-[200px] bg-white">
                        <HiOutlineSearch className="text-xl text-gray-500 mr-2" />
                        <input
                            type="text"
                            placeholder="지역 또는 도시명을 입력하세요"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full text-base text-left outline-none bg-transparent"
                        />
                    </div>

                    {/* 날짜 선택 */}
                    <div
                        onClick={() => setShowCalendar(true)}
                        className="flex-1 border rounded-md px-4 py-2 cursor-pointer bg-white hover:bg-gray-50 transition min-w-[400px]"
                    >
                        <div className="flex items-center mb-1">
                            <FiCalendar className="text-xl text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">날짜 선택</span>
                        </div>
                        <span className="text-base font-semibold text-center w-full block">
                            {checkIn && checkOut ? `${checkIn} ~ ${checkOut} (${nights}박)` : "날짜를 선택해주세요"}
                        </span>
                    </div>

                    {/* 인원 선택 */}
                    <div className="flex-1 border rounded-md px-4 py-2 min-w-[200px]">
                        <div className="flex items-center mb-1">
                            <FaUserFriends className="text-xl text-gray-500 mr-2" />
                            <span className="text-sm text-gray-500">인원수 선택</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md font-bold"
                            >
                                −
                            </button>
                            <span className="text-base font-semibold">
                {guests >= 10 ? "10+명" : `${guests}명`}
              </span>
                            <button
                                type="button"
                                onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
                                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md font-bold"
                            >
                                ＋
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="mt-5 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-md transition flex items-center justify-center gap-2 text-lg"
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