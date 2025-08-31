import Slider from "react-slick";

import { MdCelebration } from "react-icons/md";

function EventSlider({ events }) {
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 640, settings: { slidesToShow: 1 } },
        ],
    };

    return (
        <div className="max-w-screen-xl mx-auto mt-12 px-4 py-10" data-aos="fade-up">
            <div className="flex items-center gap-2 mb-4">
                <MdCelebration className="text-yellow-500 text-2xl" />
                <h2 className="text-2xl font-bold text-[#4B5563]">진행 중인 이벤트</h2>
            </div>

            <Slider {...sliderSettings}>
                {events.map((event) => (
                    <div
                        key={event.eventId}
                        className="p-2 cursor-pointer"
                        onClick={() => window.open(event.targetUrl, "_blank")}
                    >
                        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                            <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-full h-[220px] object-cover sm:h-[180px] xs:h-[160px]"
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

export default EventSlider;;