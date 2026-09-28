import Slider from "react-slick";
import { FaUserCircle, FaStar } from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";

function ReviewSlider({ reviews }) {
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 4000,
        speed: 600,
        cssEase: "ease-in-out",
    };

    if (!Array.isArray(reviews) || reviews.length === 0) {
        return <p className="text-gray-500 text-sm">아직 등록된 리뷰가 없습니다.</p>;
    }

    return (
        <Slider {...settings} className="overflow-hidden">
            {reviews.map((review, idx) => {
                const rawRating = parseFloat(review.rating);
                const safeRating = Number.isFinite(rawRating) && rawRating > 0
                    ? Math.round(rawRating)
                    : 0;

                const author = review.authorName || review.nickname || "익명 사용자";
                const content = review.content || "리뷰 내용이 없습니다.";
                const images = Array.isArray(review.images) ? review.images : [];

                return (
                    <div key={review.reviewId || idx} className="bg-gray-50 rounded-lg p-4 mb-2 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <FaUserCircle className="text-gray-400 text-xl" />
                            <span className="text-sm font-semibold text-gray-700">{author}</span>
                            <span className="flex items-center text-yellow-500 text-sm ml-auto">
                                {[...Array(safeRating)].map((_, i) => (
                                    <FaStar key={i} />
                                ))}
                                {rawRating && (
                                    <span className="ml-1 text-xs text-gray-500">
                                        {rawRating.toFixed(1)}점
                                    </span>
                                )}
                            </span>
                        </div>

                        <p className="text-sm text-gray-700">{content}</p>

                        {images.length > 0 && (
                            <div className="mt-3 flex gap-2 overflow-x-auto">
                                {images.map((url, i) => (
                                    <SafeImage kind="room"
                                        key={i}
                                        src={url}
                                        alt={`리뷰 이미지 ${i + 1}`}
                                        className="w-20 h-20 object-cover rounded border"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </Slider>
    );
}

export default ReviewSlider;