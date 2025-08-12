import { useState } from "react";
import Slider from "react-slick";
import Modal from "../components/Modal";
import "@fortawesome/fontawesome-free/css/all.min.css";

function Home() {
    const [location, setLocation] = useState("");
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [guests, setGuests] = useState(2);

    const [modalMessage, setModalMessage] = useState("");
    const [showModal, setShowModal] = useState(false);

    const bannerImages = [
        "/src/assets/images/banner1.png",
        "/src/assets/images/banner2.png",
        "/src/assets/images/banner3.png",
    ];

    const places = [
        {
            title: "세인트존스 호텔",
            location: "강릉 강문해변 앞",
            rating: 9.1,
            price: "316,800원",
            image: "/images/stjohns.jpg",
            delay: 100,
        },
        {
            title: "라마다 프라자 여수",
            location: "여수 엑스포역 근처",
            rating: 9.2,
            price: "105,800원",
            image: "/images/ramada.jpg",
            delay: 200,
        },
        {
            title: "힐튼 경주",
            location: "보문관광단지",
            rating: 9.4,
            price: "325,500원",
            image: "/images/hilton.jpg",
            delay: 300,
        },
    ];

    const sliderSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const handleSearch = () => {
        if (!location) {
            setModalMessage(
                <span>
                    <i className="fas fa-map-marker-alt text-red-500 mr-2"></i> 지역을 입력해주세요!
                </span>
            );
            setShowModal(true);
            return;
        }
        if (!checkIn) {
            setModalMessage(
                <span>
                    <i className="fas fa-calendar-alt text-blue-500 mr-2"></i> 체크인 날짜를 선택해주세요!
                </span>
            );
            setShowModal(true);
            return;
        }
        if (!checkOut) {
            setModalMessage(
                <span>
                    <i className="fas fa-calendar-alt text-blue-500 mr-2"></i> 체크아웃 날짜를 선택해주세요!
                </span>
            );
            setShowModal(true);
            return;
        }
        if (!guests) {
            setModalMessage(
                <span>
                    <i className="fas fa-users text-gray-700 mr-2"></i> 인원 수를 선택해주세요!
                </span>
            );
            setShowModal(true);
            return;
        }

        console.log("검색 조건:", { location, checkIn, checkOut, guests });
    };

    return (
        <div className="bg-[#FFF9C4] min-h-screen">
            {/* 광고 슬라이드 */}
            <div className="w-full">
                <Slider {...sliderSettings}>
                    {bannerImages.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`Banner ${idx + 1}`}
                            className="w-full h-[650px] object-cover"
                        />
                    ))}
                </Slider>
            </div>

            {/* 검색창 + 추천 숙소 */}
            <div className="w-full px-4 py-10">
                <div className="max-w-screen-2xl mx-auto">
                    {/* 검색창 */}
                    <div className="bg-white rounded-xl shadow-md p-6 mb-10" data-aos="fade-down">
                        <h2 className="text-2xl font-bold text-[#4B5563] mb-2 text-center">숙소 검색하기 🔍</h2>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            원하는 지역과 날짜를 선택하면 숙소를 빠르게 찾아드릴게요!
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fas fa-map-marker-alt text-red-500 mr-2"></i> 지역
                                </label>
                                <input
                                    type="text"
                                    placeholder="예: 강릉, 여수, 경주"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="border rounded-md px-4 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fas fa-calendar-alt text-blue-500 mr-2"></i> 체크인
                                </label>
                                <input
                                    type="date"
                                    value={checkIn}
                                    onChange={(e) => setCheckIn(e.target.value)}
                                    className="border rounded-md px-4 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fas fa-calendar-alt text-blue-500 mr-2"></i> 체크아웃
                                </label>
                                <input
                                    type="date"
                                    value={checkOut}
                                    onChange={(e) => setCheckOut(e.target.value)}
                                    className="border rounded-md px-4 py-2 w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <i className="fas fa-users text-gray-700 mr-2"></i> 인원 수
                                </label>
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
                        </div>

                        <button
                            onClick={handleSearch}
                            className="mt-6 w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-3 rounded-md transition flex items-center justify-center gap-2"
                        >
                            <span className="shake-on-hover">🔍</span> 검색하기
                        </button>
                    </div>

                    {/* 추천 숙소 */}
                    <h2 className="text-3xl font-bold text-[#4B5563] mb-8 text-center" data-aos="fade-down">
                        오늘의 추천 숙소 🏨
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {places.map((place, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                                data-aos="fade-up"
                                data-aos-delay={place.delay}
                            >
                                <img src={place.image} alt={place.title} className="w-full h-48 object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-[#4B5563]">{place.title}</h3>
                                    <p className="text-sm text-gray-500">{place.location}</p>
                                    <div className="flex justify-between items-center mt-3">
                                        <span className="text-yellow-600 font-bold">{place.price}</span>
                                        <span className="text-sm text-gray-700">⭐ {place.rating}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 모달 */}
            {showModal && (
                <Modal
                    message={modalMessage}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}

export default Home;