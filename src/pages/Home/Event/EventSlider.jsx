import Slider from "react-slick";
import { MdCelebration } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// 🔧 커스텀 화살표 컴포넌트
function PrevArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} absolute left-[-40px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
            style={{ ...style }}
            onClick={onClick}
        >
            <FaChevronLeft className="text-gray-500 hover:text-yellow-500 text-3xl" />
        </div>
    );
}

function NextArrow(props) {
    const { className, style, onClick } = props;
    return (
        <div
            className={`${className} absolute right-[-40px] top-1/2 transform -translate-y-1/2 z-10 cursor-pointer`}
            style={{ ...style }}
            onClick={onClick}
        >
            <FaChevronRight className="text-gray-500 hover:text-yellow-500 text-3xl" />
        </div>
    );
}

function EventSlider({ events }) {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2, slidesToScroll: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        ],
    };

    return (
        <div className="relative max-w-screen-xl mx-auto mt-12 px-4 py-10" data-aos="fade-up">
            <div className="flex items-center gap-2 mb-4">
                <MdCelebration className="text-yellow-500 text-2xl" />
                <h2 className="text-2xl font-bold text-[#4B5563]">진행 중인 이벤트</h2>
            </div>

            <Slider {...sliderSettings}>
                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="p-2 flex justify-center cursor-pointer"
                        onClick={() => window.open(`/events/${event.eventId}`, '_blank')}
                    >
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300 max-w-[300px] w-full">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-[260px] object-cover sm:h-[220px] xs:h-[200px]"
                            />
                            <div className="p-3 text-center text-[#4B5563] font-semibold text-sm truncate">
                                {event.title}
                            </div>
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default EventSlider;