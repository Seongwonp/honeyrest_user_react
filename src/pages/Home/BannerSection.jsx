import SearchBox from "./searchBox/SearchBox.jsx";
import { motion } from "framer-motion";

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
        <section className="relative w-full h-[600px] md:h-[700px] overflow-hidden">
            {/* 배경 이미지 & 그라데이션 오버레이 */}
            <div className="absolute inset-0">
                {randomBanner?.imageUrl ? (
                    <img
                        src={randomBanner.imageUrl}
                        alt={randomBanner.title || "Banner"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-off-white" />
            </div>

            {/* 메인 텍스트 영역 */}
            <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center z-20 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <h1 className="text-white text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
                        세상에서 가장 <span className="text-honey-yellow">달콤한</span> 휴식<br/>
                        <span className="text-3xl md:text-5xl opacity-90">HoneyRest와 함께하세요.</span>
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl font-medium drop-shadow-md">
                        전국 방방곡곡, 당신만을 위한 완벽한 숙소를 찾아드릴게요.
                    </p>
                </motion.div>
            </div>

            {/* 검색창 (배너 하단에 걸치도록 배치) */}
            <div className="absolute bottom-[-40px] left-0 w-full z-30 px-6">
                <div className="max-w-5xl mx-auto">
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
        </section>
    );
}

export default BannerSection;
