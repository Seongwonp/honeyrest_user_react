import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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

function Home() {
    const navigate = useNavigate();
    const locationPath = useLocation();

    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [userInfo, setUserInfo] = useState(null);

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
        const storedUser =
            localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo");
        setUserInfo(storedUser ? JSON.parse(storedUser) : null);
    }, [locationPath.pathname]);

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
        const timer = setTimeout(() => setShowScrollHint(false), 3000);
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
                <span className="flex items-center gap-2 text-black">
        <GoAlertFill className="text-yellow-300" />
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
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
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
            {/* 인트로 모달 */}
            <IntroModal />


            {/* 배너 영역 */}
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

            {/* 핫플레이스 + 날씨 */}
            <div className="px-4 md:px-10 mt-10">
                <div className="bg-gradient-to-r from-white rounded-3xl p-8 w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center justify-center">
                    <div className="rounded-2xl overflow-hidden shadow-lg col-span-1 md:col-span-2 h-[400px] md:h-[500px]">
                        <video
                            src="/src/assets/videos/video2.mp4"
                            autoPlay
                            loop
                            muted
                            playsInline
                            className="w-full h-full  rounded-2xl"
                            style={{ aspectRatio: "16/9" }}
                        />
                    </div>
                    <div className="md:col-span-1 flex flex-col gap-3 scale-90">
                        <HotPlacesSection
                            isDropdownOpen={isDropdownOpen}
                            setIsDropdownOpen={setIsDropdownOpen}
                            verticalSliderSettings={verticalSliderSettings}
                            navigate={navigate}
                            userInfo={userInfo}
                        />
                        <WeatherWidget coords={coords} locationError={locationError} />
                    </div>
                </div>
            </div>

            {/* 스크롤 힌트 */}
            {showScrollHint && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center text-gray-600 text-lg mt-10"
                >
                    <span className="block mb-5">👇 아래로 스크롤해서 이벤트와 추천 숙소를 확인해보세요!</span>
                    <BsChevronDoubleDown className="mx-auto text-yellow-300 animate-bounce text-3xl" />
                </motion.div>
            )}

            {/* 🔥 인기 여행지 */}
            <HotSpots userInfo={userInfo} navigate={navigate} />

            {/* 🎉 이벤트 슬라이더 */}
            <EventSlider events={events} sliderSettings={sliderSettings} />

            {/* 🏡 추천 숙소 리스트 */}
            <PlaceList />

            {/* 📍 국내 여행지 펼침형 */}
            <DomesticSpots userInfo={userInfo} navigate={navigate} />

            {/* 모달 */}
            <AnimatePresence>
                {showModal && (
                    <>
                        <div className="fixed inset-0 bg-black/40 z-40" />
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Modal message={modalMessage} onClose={() => setShowModal(false)} />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Home;