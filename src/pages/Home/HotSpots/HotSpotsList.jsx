import Slider from "react-slick";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";
import api from "@/api/axios";
import { todayLocal, addDays } from "@/utils/date";
import { useViewportWidth, pickByWidth } from "@/hooks/useViewportWidth";

function HotSpatsList({ userInfo, navigate }) {
    const [popularCities, setPopularCities] = useState([]);

    useEffect(() => {
        // 장식용 요청: 실패 시 목록만 비워 두고 조용히 넘어간다
        api.get("/api/region/popular", { skipRedirect: true })
            .then(({ data }) => {
                const cities = (Array.isArray(data) ? data : []).filter(r => r.level === 2);
                setPopularCities(cities);
            })
            .catch(err => console.error("❌ 인기 여행지 불러오기 실패:", err));
    }, []);

    const handleClick = (regionName) => {
        const today = todayLocal();
        const tomorrow = addDays(today, 1);

        const params = new URLSearchParams({
            location: regionName,
            checkIn: today,
            checkOut: tomorrow,
            guests: "2",
            page: "0",
        });

        if (userInfo?.userId) {
            params.set("userId", userInfo.userId);
        }

        navigate(`/accommodations?${params.toString()}`);
    };

    const CustomPrevArrow = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow transition-all border border-gray-50 active:scale-90"
        >
            <FaChevronLeft />
        </button>
    );

    const CustomNextArrow = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow transition-all border border-gray-50 active:scale-90"
        >
            <FaChevronRight />
        </button>
    );

    // react-slick 의 responsive 옵션은 처음 열 때 적용되지 않아(휴대폰에서 4장이 찌그러짐) 너비별 값을 직접 계산한다
    const width = useViewportWidth();
    const perView = Math.max(1, Math.min(popularCities.length || 1, pickByWidth(width, [[639, 1], [1023, 2], [1279, 3]], 4)));
    const sliding = popularCities.length > perView;
    const sliderSettings = {
        dots: false,
        infinite: sliding,
        speed: 800,
        slidesToShow: perView,
        slidesToScroll: 1,
        arrows: sliding && width >= 640,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        // 모바일은 화살표 대신 다음 카드가 살짝 보이게 해 넘길 수 있음을 알린다
        centerMode: width < 640 && sliding,
        centerPadding: "28px",
    };

    return (
        <div className="relative" data-aos="fade-up">
            <Slider key={perView} {...sliderSettings}>
                {popularCities.map((city, idx) => (
                    <button
                        type="button"
                        key={city.regionId || idx}
                        className="block w-full text-left px-3 py-4 rounded-[2rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30"
                        onClick={() => handleClick(city.name)}
                        aria-label={`${city.name} 숙소 보기`}
                    >
                        <motion.div 
                            whileHover={{ y: -10 }}
                            className="bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-honey-yellow/10 transition-all duration-500 overflow-hidden cursor-pointer border border-gray-50"
                        >
                            <div className="relative h-[240px] overflow-hidden">
                                <SafeImage
                                    src={city.imgUrl}
                                    alt={city.name}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-6 left-6">
                                    <p className="text-white font-black text-2xl drop-shadow-md">{city.name}</p>
                                    <p className="text-white/80 text-xs font-bold uppercase tracking-widest mt-1">Explore Now</p>
                                </div>
                            </div>
                        </motion.div>
                    </button>
                ))}
            </Slider>
        </div>
    );
}

export default HotSpatsList;
