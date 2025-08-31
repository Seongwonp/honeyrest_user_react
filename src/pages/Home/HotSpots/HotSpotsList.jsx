import Slider from "react-slick";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

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
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-blue-500"
        >
            <FaChevronLeft />
        </button>
    );

    const CustomNextArrow = ({ onClick }) => (
        <button
            onClick={onClick}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 text-gray-600 hover:text-blue-500"
        >
            <FaChevronRight />
        </button>
    );

    const sliderSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="relative max-w-screen-xl mx-auto mt-16 px-4 py-10" data-aos="fade-up">
            <Slider {...sliderSettings}>
                {popularCities.map(city => (
                    <div
                        key={city.regionId}
                        className="px-2"
                        onClick={() => handleClick(city.name)}
                    >
                        <div className="bg-white rounded-xl shadow hover:shadow-lg transition duration-300 overflow-hidden cursor-pointer">
                            <img
                                src={city.imgUrl || "/images/default-region.jpg"}
                                alt={city.name}
                                className="w-full h-[180px] sm:h-[160px] xs:h-[140px] object-cover"
                            />
                            <div className="p-3 text-center text-gray-800 font-semibold text-sm truncate">
                                {city.name}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default HotSpatsList;