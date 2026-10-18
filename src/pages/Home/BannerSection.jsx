import SearchBox from "./searchBox/SearchBox.jsx";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";

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
        // 모바일은 검색창이 세로로 길어 히어로 문구를 덮으므로 검색창을 문구 아래 흐름에 두고, md 이상에서만 배너 하단에 걸친다
        <section className="relative w-full md:h-[700px]">
            {/* 배경 이미지 & 그라데이션 오버레이 */}
            <div className="absolute inset-0 overflow-hidden">
                {randomBanner?.imageUrl ? (
                    // 히어로 배경은 사진(글자 없는 이미지)을 전제로 화면을 꽉 채운다
                    <SafeImage
                        src={randomBanner.imageUrl}
                        alt={randomBanner.title || "Banner"}
                        className="w-full h-full object-cover object-center"
                    />
                ) : randomBanner ? (
                    // 배너가 없거나 불러오지 못한 경우: 기본 배경
                    <div className="w-full h-full bg-gradient-to-br from-honey-yellow/70 via-amber-200 to-leaf-green/40" />
                ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-off-white" />
            </div>

            {/* 메인 텍스트 영역 */}
            <div className="relative h-[420px] md:h-full max-w-7xl mx-auto px-6 flex flex-col justify-center items-center text-center z-20 pb-8 md:pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="space-y-4"
                >
                    <h1 className="text-white text-[2rem] sm:text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight break-keep">
                        세상에서 가장 <span className="text-honey-yellow">달콤한</span> 휴식<br/>
                        <span className="text-2xl sm:text-3xl md:text-5xl opacity-90">HoneyRest와 함께하세요.</span>
                    </h1>
                    <p className="text-white/90 text-base sm:text-lg md:text-xl font-medium drop-shadow-md break-keep">
                        전국 방방곡곡, 당신만을 위한 완벽한 숙소를 찾아드릴게요.
                    </p>
                </motion.div>
            </div>

            {/* 검색창 (배너 하단에 걸치도록 배치) */}
            <div className="relative md:absolute md:bottom-[-40px] left-0 w-full z-30 px-6 pb-2 md:pb-0">
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
