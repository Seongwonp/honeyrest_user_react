import { HiOutlineSearch } from "react-icons/hi";

function SearchBox({
                       location,
                       setLocation,
                       checkIn,
                       setCheckIn,
                       checkOut,
                       setCheckOut,
                       guests,
                       setGuests,
                       handleSearch,
                       today,
                       getTomorrow,
                   }) {
    return (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div
                className="bg-white rounded-xl shadow-md p-8 w-full max-w-4xl mx-auto"
                data-aos="fade-up"
                data-aos-delay="1100"
            >
                <h2 className="text-2xl font-bold text-[#4B5563] mb-2 text-center">숙소 검색하기 🏡</h2>
                <p className="text-sm text-gray-500 text-center mb-6">
                    원하는 지역과 날짜를 선택하면 숙소를 빠르게 찾아드릴게요! ✈️
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <input
                        type="text"
                        placeholder="지역 (예: 강릉, 여수)"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                    <input
                        type="date"
                        value={checkIn}
                        min={today}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                    <input
                        type="date"
                        value={checkOut}
                        min={checkIn ? getTomorrow(checkIn) : today}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="border rounded-md px-4 py-2 w-full"
                    />
                    <div className="flex items-center border rounded-md px-2 py-2 w-full justify-between">
                        <button
                            onClick={() => setGuests((prev) => Math.max(1, prev - 1))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md font-bold"
                        >
                            −
                        </button>
                        <span className="text-lg font-semibold">
              {guests >= 10 ? "10+명" : `${guests}명`}
            </span>
                        <button
                            onClick={() => setGuests((prev) => Math.min(10, prev + 1))}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md font-bold"
                        >
                            ＋
                        </button>
                    </div>
                </div>

                <button
                    onClick={handleSearch}
                    className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-md transition flex items-center justify-center gap-2"
                >
                    <HiOutlineSearch className="text-xl icon-shake" />
                    검색하기
                </button>
            </div>
        </div>
    );
}

export default SearchBox;