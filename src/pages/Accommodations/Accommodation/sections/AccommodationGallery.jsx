import Slider from "react-slick";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SafeImage from "@/components/SafeImage.jsx";

// 슬라이더 좌/우 화살표 (react-slick 이 onClick 을 주입)
const SlickArrow = ({ direction, onClick }) => (
    <button
        onClick={onClick}
        className={`absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center text-deep-gray hover:text-honey-yellow shadow-xl transition-all active:scale-90 ${direction === 'left' ? 'left-6' : 'right-6'}`}
    >
        {direction === 'left' ? <AiOutlineLeft /> : <AiOutlineRight />}
    </button>
);

const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    prevArrow: <SlickArrow direction="left" />,
    nextArrow: <SlickArrow direction="right" />,
};

// 숙소 이미지 갤러리 슬라이더
function AccommodationGallery({ images }) {
    return (
        <section className="px-6">
            <div className="rounded-[3rem] overflow-hidden shadow-2xl shadow-gray-200">
                <Slider {...sliderSettings}>
                    {images.map((src, i) => (
                        <div key={src || i} className="h-[400px] md:h-[600px]">
                            <SafeImage
                                src={src}
                                alt={`Gallery ${i + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </Slider>
            </div>
        </section>
    );
}

export default AccommodationGallery;
