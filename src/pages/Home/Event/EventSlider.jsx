import Slider from "react-slick";
import { MdCelebration } from "react-icons/md";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { motion } from "framer-motion";
import SafeImage from "@/components/SafeImage.jsx";
import { useViewportWidth, pickByWidth } from "@/hooks/useViewportWidth";

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
    const width = useViewportWidth();
    // 이벤트 수보다 많은 칸을 잡으면 카드가 좁게 찌그러지므로 보여 줄 수를 이벤트 수로 제한한다.
    // (react-slick 의 responsive 옵션은 처음 열 때 적용되지 않아 너비별 값을 직접 계산한다)
    const perView = Math.max(1, Math.min(events.length, pickByWidth(width, [[639, 1], [1023, 2]], 3)));
    const sliding = events.length > perView;
    const sliderSettings = {
        dots: sliding,
        infinite: sliding,
        speed: 800,
        slidesToShow: perView,
        slidesToScroll: 1,
        autoplay: sliding,
        arrows: sliding && width >= 640,
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />,
    };

    if (events.length === 0) return null;

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

            {/* key: 한 화면 슬라이드 수가 바뀌면 슬라이더를 새로 만들어 트랙 폭을 다시 계산한다 */}
            <Slider key={perView} {...sliderSettings} className="event-slider">
                {events.map((event) => (
                    <a
                        key={event.eventId}
                        href={`/events/${event.eventId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-4 cursor-pointer rounded-[2rem] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30"
                    >
                        <motion.div 
                            whileHover={{ y: -8 }}
                            className="bg-white rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                        >
                            {/* 이벤트 이미지는 글자가 들어간 디자인 배너라 잘리면 안 된다 → object-contain + 배경색 */}
                            <div className="aspect-[16/9] overflow-hidden bg-honey-yellow/10">
                                <SafeImage
                                    kind="event"
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="p-5">
                                <p className="text-xs font-bold text-honey-yellow uppercase tracking-widest mb-1">Event</p>
                                <h3 className="text-sm font-bold text-deep-gray truncate">
                                    {event.title}
                                </h3>
                            </div>
                        </motion.div>
                    </a>
                ))}
            </Slider>
        </section>
    );
}

export default EventSlider;
