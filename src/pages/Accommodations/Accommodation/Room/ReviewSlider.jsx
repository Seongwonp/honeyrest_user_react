import Slider from "react-slick";
import { FaUserCircle, FaStar } from "react-icons/fa";

function ReviewSlider({ reviews }) {
    const settings = {
        dots: false,
        infinite: false,
        vertical: true,
        verticalSwiping: true,
        slidesToShow: 3,
        slidesToScroll: 1,
        swipeToSlide: true,
        arrows: false,
    };

    if (!reviews || reviews.length === 0) {
        return <p className="text-gray-500 text-sm">아직 등록된 리뷰가 없습니다.</p>;
    }

    return (
        <Slider {...settings} className="max-h-[300px] overflow-hidden">
            {reviews.map((review, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-2 shadow-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <FaUserCircle className="text-gray-400 text-xl" />
                        <span className="text-sm font-semibold text-gray-700">{review.authorName}</span>
                        <span className="flex items-center text-yellow-500 text-sm ml-auto">
              {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} />
              ))}
            </span>
                    </div>
                    <p className="text-sm text-gray-700">{review.content}</p>
                </div>
            ))}
        </Slider>
    );
}

export default ReviewSlider;