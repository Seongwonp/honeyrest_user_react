import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoAlertFill } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../components/Modal";
import { BsChevronDoubleDown } from "react-icons/bs";
import 'weather-icons/css/weather-icons.css';

import HotPlacesSection from "./HotPlacesSection";
import EventSlider from "./Event/EventSlider";
import PlaceList from "./PlaceList/PlaceList";
import DomesticSpots from "./DomesticSpotsList/DomesticSpots";
import SearchBox from "./searchBox/SearchBox.jsx";
import WeatherWidget from "./Weather/WeatherWidget.jsx";
import HotSpots from "@/pages/Home/HotSpots/HotSpots.jsx";
import BannerSection from "@/pages/Home/BannerSection.jsx";
import IntroModal from "@/components/IntroModal.jsx";
import LazyVideo from "@/components/LazyVideo.jsx";
import { useAuth } from "@/hooks/useAuth";

function Home() {
    const navigate = useNavigate();

    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    // 로그인 사용자 정보는 AuthProvider 공유 상태에서 가져온다
    const { user: userInfo } = useAuth();

    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showScrollHint, setShowScrollHint] = useState(true);

    const [randomBanner, setRandomBanner] = useState(null);
    const [events, setEvents] = useState([]);
    const today = new Date().toISOString().split("T")[0];
    const getTomorrow = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split("T")[0];
    };

    const [coords, setCoords] = useState(null);
    const [locationError, setLocationError] = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
            () => setLocationError(true),
            { timeout: 3000 }
        );
    }, []);

    useEffect(() => {
        fetch("/api/banner/random")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) setRandomBanner(data.data);
            });
    }, []);

    useEffect(() => {
        fetch("/api/event/activeList")
            .then((res) => res.json())
            .then((data) => setEvents(data));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => setShowScrollHint(false), 5000);
        return () => clearTimeout(timer);
    }, []);


    const handleSearch = () => {
        if (!location || !checkIn || !checkOut || !guests) {
            const message = !location
                ? "지역을 입력해주세요!"
                : !checkIn
                    ? "체크인 날짜를 선택해주세요!"
                    : !checkOut
                        ? "체크아웃 날짜를 선택해주세요!"
                        : "인원 수를 선택해주세요!";

            setModalMessage(
                <span className="flex items-center gap-2 text-black font-bold">
                    <GoAlertFill className="text-honey-yellow text-xl" />
                    {message}
                </span>
            );
            setShowModal(true);
            return;
        }

        const params = new URLSearchParams();
        params.set("location", location);
        params.set("checkIn", checkIn);
        params.set("checkOut", checkOut);
        params.set("guests", guests.toString());
        params.set("page", "0");

        navigate(`/accommodations?${params.toString()}`);
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
    };

    const verticalSliderSettings = {
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        infinite: true,
        arrows: false,
        dots: false,
        pauseOnHover: false,
        speed: 500,
    };


    return (
        <div className="bg-white min-h-screen">
            <IntroModal />

            {/* 1. Hero Banner */}
            <BannerSection
                randomBanner={randomBanner}
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

            {/* 2. Main Content Grid */}
            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12 space-y-24">
                
                {/* 비디오 & 트렌드 & 날씨 섹션 */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* 비디오 카드 */}
                    <div className="lg:col-span-8 rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200 h-[400px] md:h-[500px] relative group">
                        {/* 약 14MB 영상 → 뷰포트에 들어올 때만 로드 (LazyVideo) */}
                        <LazyVideo
                            src="/videos/video2.mp4"
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                            <p className="text-white font-bold text-xl md:text-2xl drop-shadow-md">
                                당신이 꿈꾸던 여행, 지금 시작됩니다.
                            </p>
                        </div>
                    </div>

                    {/* 사이드 위젯 */}
                    <div className="lg:col-span-4 space-y-6">
                        <HotPlacesSection
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            verticalSliderSettings={verticalSliderSettings}
                            navigate={navigate}
                            userInfo={userInfo}
                        />
                        <WeatherWidget coords={coords} locationError={locationError} />
                    </div>
                </section>

                {/* 🔥 인기 여행지 */}
                <HotSpots userInfo={userInfo} navigate={navigate} />

                {/* 🎉 이벤트 슬라이더 */}
                <EventSlider events={events} sliderSettings={sliderSettings} />

                {/* 🏡 추천 숙소 리스트 */}
                <PlaceList />

                {/* 📍 국내 여행지 펼침형 */}
                <DomesticSpots userInfo={userInfo} navigate={navigate} />

            </main>

            {/* 스크롤 힌트 */}
            <AnimatePresence>
                {showScrollHint && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
                    >
                        <span className="text-deep-gray/60 text-xs font-bold tracking-widest uppercase">Scroll Down</span>
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            <BsChevronDoubleDown className="text-honey-yellow text-xl" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 모달 */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" 
                            onClick={() => setShowModal(false)}
                        />
                        <motion.div
                            className="fixed inset-0 z-[210] flex items-center justify-center pointer-events-none"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        >
                            <div className="pointer-events-auto">
                                <Modal message={modalMessage} onClose={() => setShowModal(false)} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;
