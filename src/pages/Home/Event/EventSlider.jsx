import Slider from "react-slick";
import { MdCelebration } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";

function PrevArrow(props) {
    const { onClick } = props;
    return (
        <button
            onClick={onClick}
            className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow transition-all active:scale-90"
        >
            <FaChevronLeft size={14} />
        </button>
    );
}

function NextArrow(props) {
    const { onClick } = props;
    return (
        <button
            onClick={onClick}
            className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/80 backdrop-blur-md shadow-lg rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow transition-all active:scale-90"
        >
            <FaChevronRight size={14} />
        </button>
    );
}

function EventSlider({ events }) {
    const sliderSettings = {
        dots: true,
        infinite: events.length > 4,
        speed: 800,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        arrows: true,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
        responsive: [
            { breakpoint: 1280, settings: { slidesToShow: 3 } },
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1.1, arrows: false } },
        ],
    };

    return (
        <section className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-honey-yellow/20 flex items-center justify-center">
                        <MdCelebration className="text-honey-yellow-dark text-xl" />
                    </div>
                    <h2 className="text-2xl font-black text-deep-gray tracking-tight">특별한 이벤트</h2>
                </div>
                <button className="text-sm font-bold text-gray-400 hover:text-honey-yellow transition-colors">
                    전체보기
                </button>
            </div>

            <Slider {...sliderSettings} className="event-slider">
                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="px-3 py-4 cursor-pointer focus:outline-none"
                        onClick={() => window.open(`/events/${event.eventId}`, '_blank')}
                    >
                        <motion.div 
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            <div className="h-[300px] overflow-hidden">
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-bold text-honey-yellow uppercase tracking-widest mb-1">Event</p>
                                <h3 className="text-sm font-bold text-deep-gray truncate">
                                    {event.title}
                                </h3>
                            </div>
                        </motion.div>
                    </div>
                ))}
            </Slider>
        </section>
    );
}

export default EventSlider;
