import SearchBox from "./searchBox/SearchBox.jsx";

function BannerSection({
                           randomBanner,
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
        <div className="relative w-full min-h-[700px] sm:min-h-[750px] md:min-h-[800px] overflow-hidden">
            {/* 배경 이미지 */}
            {randomBanner?.imageUrl ? (
                <img
                    src={randomBanner.imageUrl}
                    alt={randomBanner.title || "배너 이미지"}
                    className="absolute inset-0 w-full h-full object-cover z-0"
                />
            ) : (
                <div className="absolute inset-0 w-full h-full bg-gray-100 flex items-center justify-center z-0">
                    <p className="text-gray-500">배너를 불러오는 중...</p>
                </div>
            )}

            {/* 오버레이 */}
            <div className="absolute inset-0 bg-black/30 z-10" />

            {/* 텍스트 */}
            <div className="absolute top-[8%] w-full z-20 px-4 text-center flex flex-col sm:flex-row justify-center items-center gap-4">
        <span
            className="text-white text-2xl sm:text-4xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
            data-aos="fade-right"
            data-aos-delay="100"
        >
          편안한 휴식을 위해,
        </span>
                <span
                    className="text-white text-2xl sm:text-4xl font-semibold drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]"
                    data-aos="fade-left"
                    data-aos-delay="600"
                >
          지금 떠나볼까요? 🌿
        </span>
            </div>

            {/* 검색창 */}
            <div className="absolute top-[28%] sm:top-[42%] md:top-[38%] w-full px-4 z-30">
                <div className="max-w-6xl mx-auto">
                    <SearchBox
                        location={location}
                        setLocation={setLocation}
                        checkIn={checkIn}
                        setCheckIn={setCheckIn}
                        checkOut={checkOut}
                        setCheckOut={setCheckOut}
                        guests={guests}
                        setGuests={setGuests}
                        handleSearch={handleSearch}
                        today={today}
                        getTomorrow={getTomorrow}
                    />
                </div>
            </div>
        </div>
    );
}

export default BannerSection;