import Slider from "react-slick";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";

function HotSpatsList({ userInfo, navigate }) {
    const [popularCities, setPopularCities] = useState([]);

    useEffect(() => {
        fetch("/api/region/popular")
            .then(res => res.json())
            .then(data => {
                const cities = data.filter(r => r.level === 2);
                setPopularCities(cities);
            })
            .catch(err => console.error("❌ 인기 여행지 불러오기 실패:", err));
    }, []);

    const handleClick = (regionName) => {
        const today = new Date().toISOString().split("T")[0];
        const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

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

    const sliderSettings = {
        dots: false,
        infinite: true,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1280,
                settings: { slidesToShow: 3 },
            },
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 640,
                settings: { slidesToShow: 1.2, arrows: false },
            },
        ],
    };

    return (
        <div className="relative" data-aos="fade-up">
            <Slider {...sliderSettings}>
                {popularCities.map((city, idx) => (
                    <div
                        key={city.regionId || idx}
                        className="px-3 py-4"
                        onClick={() => handleClick(city.name)}
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
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HotSpatsList;
