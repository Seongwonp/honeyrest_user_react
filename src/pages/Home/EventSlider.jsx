import Slider from "react-slick";

function EventSlider({ events, sliderSettings }) {
    return (
        <div className="max-w-screen-xl mx-auto mt-20 px-4 py-10" data-aos="fade-up">
            <h2 className="text-2xl font-bold text-[#4B5563] mb-4">진행 중인 이벤트</h2>
            <Slider {...sliderSettings}>
                {events.map((event) => (
                    <div key={event.eventId} className="cursor-pointer" onClick={() => window.open(event.targetUrl, "_blank")}>
                        <img
                            src={event.imageUrl}
                            alt={event.title}
                            className="w-full h-[600px] object-cover rounded-xl"
                            data-aos="zoom-in"
                        />
                        <div className="mt-2 text-center text-[#4B5563] font-semibold">
                            {event.title}
                        </div>
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default EventSlider;