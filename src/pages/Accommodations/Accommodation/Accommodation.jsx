import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import {AiFillHeart, AiOutlineHeart, AiOutlineArrowLeft} from "react-icons/ai";
import {FaMapMarkerAlt, FaStar, FaUserFriends} from "react-icons/fa";
import {motion} from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


function Accommodation({ accommodationId, sectionRefs }) {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const userId = searchParams.get("userId") || localStorage.getItem("userId");
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");

    const [data, setData] = useState(null);
    const [isWished, setIsWished] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
        axios
            .get(`/api/accommodations/${accommodationId}`, {
                params: {userId, checkIn, checkOut},
            })
            .then((res) => {
                setData(res.data);
                setIsWished(res.data.wished);
            });
    }, [accommodationId, userId, checkIn, checkOut]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.dataset.id || entry.target.id;
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: "-80px 0px -40% 0px", // 네비바 높이만큼 보정
            }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    const handleWishToggle = () => {
        if (!userId) return alert("로그인이 필요합니다");

        const url = isWished ? `/api/wishlist/${accommodationId}` : `/api/wishlist`;
        const method = isWished ? "delete" : "post";

        axios({method, url, data: {userId, accommodationId}}).then(() =>
            setIsWished(!isWished)
        );
    };

    // Kakao Map 초기화 로직 (API 키 연결 후 바로 작동 가능)
    useEffect(() => {
        if (!data?.location) return;

        const { latitude, longitude } = data.location;

        window.initKakaoMap = () => {
            const mapContainer = document.getElementById("map");
            if (!mapContainer || !window.kakao || !window.kakao.maps) return;

            const mapOption = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            // 마커 표시
            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(latitude, longitude),
                map: map
            });

            // 정보창 표시 (예시)
            const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${data.name}</div>`
            });
            infoWindow.open(map, marker);
        };
    }, [data]);



    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        accessibility: true,
        focusOnSelect: false
    };

    if (!data) return <div className="text-center py-20">로딩 중...</div>;

    return (
        <div className="w-full sm:max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 sm:space-y-10 md:space-y-12 px-2 sm:px-4 md:px-6 overflow-y-auto">
            {/* 모바일 백 버튼 */}
            <div
                className="block md:hidden fixed top-4 left-4 z-50"
                onClick={() => window.history.back()}
                role="button"
                tabIndex={0}
                aria-label="뒤로가기"
                style={{ cursor: "pointer" }}
            >
                <AiOutlineArrowLeft className="text-3xl text-gray-700 bg-white rounded-full shadow p-1" />
            </div>
            {/* 이미지 슬라이더 */}
            <section className="w-full">
                <Slider {...sliderSettings}>
                    {data.images.map((src, i) => (
                        <div key={i} className="w-full" tabIndex="-1">
                            <img
                                src={src}
                                alt={`숙소 이미지 ${i + 1}`}
                                className="w-full h-40 sm:h-56 md:h-80 lg:h-96 xl:h-[38rem] object-cover rounded-md"
                            />
                        </div>
                    ))}
                </Slider>
            </section>

            {/* 헤더 */}
            <header className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 w-full">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{data.name}</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {data.category} · {data.address}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                        <FaStar className="text-yellow-500"/>
                        <span>{data.rating.toFixed(1)}</span>
                        <span>· 리뷰 {data.reviewCount}개</span>
                    </div>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-lg sm:text-xl font-semibold text-yellow-600">
                        {data.price.toLocaleString()}원~
                    </p>

                    <motion.div
                        onClick={handleWishToggle}
                        disabled={!userId}
                        whileTap={{scale: 0.9}}
                        className={`mt-2 inline-flex items-center gap-1 sm:gap-2 cursor-pointer ${
                            !userId
                                ? "text-gray-300 cursor-not-allowed"
                                : "text-red-500 hover:scale-105 transition"
                        }`}
                        title={!userId ? "로그인 후 찜하기 가능" : isWished ? "찜 취소" : "찜하기"}
                    >
                        {isWished ? (
                            <AiFillHeart className="text-2xl"/>
                        ) : (
                            <AiOutlineHeart className="text-2xl"/>
                        )}
                        <span className="text-xs sm:text-sm font-medium">
                            {isWished ? "찜 취소" : "찜하기"}
                        </span>
                    </motion.div>
                </div>
            </header>

            {/* 태그 + 위치 */}
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full">
                <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    {data.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded">
                            {tag.name}
                        </span>
                    ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">📍 {data.address}</div>
            </section>

            {/* 객실 선택 */}
            <section
                id="rooms"
                ref={(el) => (sectionRefs.current["rooms"] = el)}
                data-id="rooms"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                    객실 선택
                    <span className="text-xs text-gray-500 font-normal">
                        클릭하여 객실 정보를 확인해보세요! :)
                    </span>
                </h2>
                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                    {data.rooms.map((room, i) => (
                        <div
                            key={i}
                            className={`w-full bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center transition transform hover:scale-105 hover:shadow-lg ${
                                room.available
                                    ? ""
                                    : "opacity-50 grayscale brightness-90 pointer-events-none"
                            }`}
                        >
                            {room.images && room.images.length > 0 && (
                                <img
                                    src={room.images.find((img) => img.includes("s_")) || room.images[0]}
                                    alt={`${room.name} 이미지`}
                                    className="w-full sm:w-auto h-32 sm:h-40 md:h-45 object-cover rounded-lg shadow-sm mb-2 sm:mb-0"
                                />
                            )}
                            <div className="flex-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                    <span className="text-gray-700 font-semibold text-base">{room.name}</span>
                                    {room.available ? (
                                        <span className="text-yellow-600 font-semibold mt-1 sm:mt-0">
                                            {room.price.toLocaleString()}원
                                        </span>
                                    ) : (
                                        <span className="text-sm text-red-500 font-semibold mt-1 sm:mt-0">
                                            예약 마감
                                        </span>
                                    )}
                                </div>

                                {room.description && (
                                    <p className="text-base text-gray-500 mt-1">{room.description}</p>
                                )}

                                {room.standardOccupancy && room.maxOccupancy && (
                                    <p className="text-base text-gray-500 mt-1 flex items-center gap-1">
                                        <FaUserFriends className="text-gray-400" />
                                        기준 {room.standardOccupancy}명 / 최대 {room.maxOccupancy}명
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

                    {/* 숙소 소개 */}
                    <section
                        id="intro"
                        ref={(el) => (sectionRefs.current["intro"] = el)}
                        data-id="intro"
                        className="w-full"
                    >
                        <h2 className="text-lg font-bold mb-2">숙소 소개</h2>
                        {data.intro.split("/").map((line, idx) => (
                            <p key={idx} className="text-base text-gray-700 mt-3">{line}</p>
                        ))}
                    </section>

                    {/* 서비스 및 시설 */}
                    <section
                        id="facilities"
                        ref={(el) => (sectionRefs.current["facilities"] = el)}
                        data-id="facilities"
                        className="w-full"
                    >
                        <h2 className="text-lg font-bold mb-2">서비스 및 시설</h2>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                            {data.facilities.map((f, i) => (
                                <li key={i}>{f}</li>
                            ))}
                        </ul>
                    </section>

                    {/* 숙소 이용 정보 */}
                    <section
                        id="usage"
                        ref={(el) => (sectionRefs.current["usage"] = el)}
                        data-id="usage"
                        className="w-full"
                    >
                        <h2 className="text-lg font-bold mb-2">숙소 이용 정보</h2>
                        <p className="text-sm text-gray-600">{data.usage}</p>
                    </section>

                    {/* 위치 */}
                    <section
                        id="location"
                        ref={(el) => (sectionRefs.current["location"] = el)}
                        data-id="location"
                        className="w-full"
                    >
                        <h2 className="text-lg font-bold mb-2">위치</h2>
                        <div id="map" className="w-full h-80 rounded-md shadow" />
                        <div className="flex items-center mt-2 text-gray-600 text-sm">
                            <FaMapMarkerAlt className="mr-1 text-red-500" />
                            <span>{data.address}</span>
                        </div>
                    </section>

                    {/* 리뷰 */}
                    <section
                        id="reviews"
                        ref={(el) => (sectionRefs.current["reviews"] = el)}
                        data-id="reviews"
                        className="w-full"
                    >
                        <h2 className="text-lg font-bold mb-2">리뷰</h2>
                        <div className="space-y-2 w-full">
                            {data.reviews.length === 0 ? (
                                <p className="text-sm text-gray-500">아직 리뷰가 없습니다.</p>
                            ) : (
                                data.reviews.map((r, i) => (
                                    <div key={i} className="border p-3 rounded text-sm text-gray-700 space-y-1 w-full">
                                        <div className="flex items-center gap-2">
                                            <strong>{r.userName}</strong>
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <FaStar />
                                                <span>{r.rating}</span>
                                            </div>
                                        </div>
                                        <p>{r.content}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>

                    {/* 비슷한 숙소 */}
                    {data.similar && (
                        <section
                            id="similar"
                            ref={(el) => (sectionRefs.current["similar"] = el)}
                            data-id="similar"
                            className="w-full"
                        >
                            <h2 className="text-lg font-bold mb-2">비슷한 숙소</h2>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                                {data.similar.map((name, i) => (
                                    <li key={i}>{name}</li>
                                ))}
                            </ul>
                        </section>
                    )}
        </div>
    );
}

export default Accommodation;
