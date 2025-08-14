import { useRef, useEffect, useState } from "react";
import { GoAlertFill } from "react-icons/go";
import { AnimatePresence, motion } from "framer-motion";
import Modal from "../../components/Modal";
import { BsChevronDoubleDown } from "react-icons/bs";
import 'weather-icons/css/weather-icons.css';

// 분리된 컴포넌트들
import HotPlacesSection from "./HotPlacesSection";
import EventSlider from "./EventSlider";
import PlaceList from "./PlaceList";
import DomesticSpots from "./DomesticSpots";
import SearchBox from "./SearchBox.jsx";
import WeatherWidget from "./Weather/WeatherWidget.jsx";

function Home() {
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);
    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("전체");
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
        console.log("Home 컴포넌트 마운트됨");

        if (!navigator.geolocation) {
            console.error("Geolocation API를 지원하지 않음");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                console.log("위치 성공:", pos.coords.latitude, pos.coords.longitude);
                setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            },
            (err) => {
                console.error("위치 실패:", err.code, err.message);
                setLocationError(true); // 실패 상태 설정
            },
            {
                timeout: 3000
            }
        );
    }, []);

    useEffect(() => {
        fetch("/api/banner/random")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.data) {
                    setRandomBanner(data.data);
                }
            });
    }, []);

    useEffect(() => {
        fetch("/api/event/activeList")
            .then((res) => res.json())
            .then((data) => {
                setEvents(data);
            });
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowScrollHint(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, []);

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

    const categories = [
        "전체", "호텔", "리조트", "펜션", "풀빌라", "모텔", "게스트하우스", "캠핑", "글램핑",
    ];

    const hotPlaces = ["부산", "경주", "남해", "강릉", "여수", "제주", "속초"];
    const domesticSpots = ["서울", "부산", "강릉", "여수", "제주", "속초", "전주", "남해"];

    const places = [
        {
            title: "세인트존스 호텔",
            location: "강릉 강문해변 앞",
            rating: 9.1,
            price: "316,800원",
            image: "/images/stjohns.jpg",
            category: "호텔",
        },
        {
            title: "라마다 프라자 여수",
            location: "여수 엑스포역 근처",
            rating: 9.2,
            price: "105,800원",
            image: "/images/ramada.jpg",
            category: "호텔",
        },
        {
            title: "힐튼 경주",
            location: "보문관광단지",
            rating: 9.4,
            price: "325,500원",
            image: "/images/hilton.jpg",
            category: "리조트",
        },
        {
            title: "경주 한옥 펜션",
            location: "경주 교촌마을 근처",
            rating: 8.9,
            price: "89,000원",
            image: "/images/hanok.jpg",
            category: "펜션",
        },
        {
            title: "남해 풀빌라 101",
            location: "남해 바닷가 앞",
            rating: 9.5,
            price: "450,000원",
            image: "/images/poolvilla.jpg",
            category: "풀빌라",
        },
        {
            title: "속초 모텔 24시",
            location: "속초 해변 근처",
            rating: 8.2,
            price: "55,000원",
            image: "/images/motel.jpg",
            category: "모텔",
        },
        {
            title: "제주 게스트하우스",
            location: "제주시 구좌읍",
            rating: 9.0,
            price: "39,000원",
            image: "/images/guesthouse.jpg",
            category: "게스트하우스",
        },
        {
            title: "강릉 캠핑존",
            location: "강릉 솔향기 캠핑장",
            rating: 8.7,
            price: "70,000원",
            image: "/images/camping.jpg",
            category: "캠핑",
        },
        {
            title: "여수 글램핑 리조트",
            location: "여수 바다뷰",
            rating: 9.3,
            price: "120,000원",
            image: "/images/glamping.jpg",
            category: "글램핑",
        },
    ];


    const filteredPlaces =
        selectedCategory === "전체"
            ? places
            : places.filter((place) => place.category === selectedCategory);

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

        console.log("검색 조건:", { location, checkIn, checkOut, guests });
    };

    return (
        <div className="bg-white min-h-screen">
            {/* 배너 영역 */}
            <div className="relative w-full h-[650px] overflow-hidden">
                {randomBanner?.imageUrl ? (
                    <img
                        src={randomBanner.imageUrl}
                        alt={randomBanner.title || "배너 이미지"}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <p className="text-gray-500">배너를 불러오는 중...</p>
                    </div>
                )}

                {/* 배너 텍스트 */}
                <div className="absolute top-12 w-full text-center z-10 flex justify-center gap-2">
          <span
              className="text-white text-2xl sm:text-4xl font-semibold drop-shadow-lg"
              data-aos="fade-right"
              data-aos-delay="100"
          >
            편안한 휴식을 위해,
          </span>
                    <span
                        className="text-white text-2xl sm:text-4xl font-semibold drop-shadow-lg"
                        data-aos="fade-left"
                        data-aos-delay="600"
                    >
            지금 떠나볼까요? 🌿
          </span>
                </div>

                {/* 검색창 */}
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

            <div className="px-4 md:px-10 mt-10">
                <div className="bg-gradient-to-r from-white  rounded-3xl p-8 w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

                    <HotPlacesSection
                        hotPlaces={hotPlaces}
                        isDropdownOpen={isDropdownOpen}
                        setIsDropdownOpen={setIsDropdownOpen}
                        verticalSliderSettings={verticalSliderSettings}
                    />

                    <WeatherWidget coords={coords} locationError={locationError} />
                </div>
            </div>

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

            {/* 이벤트 슬라이더 */}
            <EventSlider events={events} sliderSettings={sliderSettings} />

            {/* 추천 숙소 */}
            <PlaceList
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                filteredPlaces={filteredPlaces}
            />

            {/* 국내 여행지 */}
            <DomesticSpots domesticSpots={domesticSpots} />

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