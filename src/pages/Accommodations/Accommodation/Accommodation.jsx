import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Accommodation() {
    const dummy = {
        name: "제주 바다뷰 호텔",
        category: "호텔",
        address: "제주도 서귀포시",
        price: 120000,
        isWished: false,
        images: ["/img1.jpg", "/img2.jpg", "/img3.jpg"],
        tags: ["바다뷰", "조식 포함", "무료 주차"],
        location: { lat: 33.450701, lng: 126.570667 },
        rooms: [
            { name: "스탠다드룸", price: 120000 },
            { name: "디럭스룸", price: 150000 },
        ],
        intro: "제주 바다를 품은 감성 숙소입니다.",
        facilities: ["Wi-Fi", "에어컨", "TV", "욕조"],
        usage: "체크인 15:00 / 체크아웃 11:00",
        company: "제주호텔주식회사",
        reviews: [
            { user: "성원", comment: "뷰가 미쳤어요", rating: 5 },
            { user: "민지", comment: "조식 맛있어요", rating: 4.5 },
        ],
        similar: ["부산 오션뷰", "강릉 스카이호텔"],
    };

    const [isWished, setIsWished] = useState(dummy.isWished);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-12">
            {/* 이미지 슬라이더 */}
            <section>
                <Slider {...sliderSettings}>
                    {dummy.images.map((src, i) => (
                        <div key={i}>
                            <img
                                src={src}
                                alt={`숙소 이미지 ${i + 1}`}
                                className="w-full h-64 object-cover rounded-md"
                            />
                        </div>
                    ))}
                </Slider>
            </section>

            {/* 헤더 */}
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{dummy.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {dummy.category} · {dummy.address}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-semibold text-yellow-600">
                        {dummy.price.toLocaleString()}원~
                    </p>
                    <button
                        onClick={() => setIsWished(!isWished)}
                        className="mt-2 px-3 py-1 text-sm border rounded hover:bg-yellow-100 transition"
                    >
                        {isWished ? "찜 취소" : "찜하기"}
                    </button>
                </div>
            </header>

            {/* 태그 + 위치 */}
            <section className="flex justify-between items-center">
                <div className="flex gap-2 text-sm text-gray-600">
                    {dummy.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded">{tag}</span>
                    ))}
                </div>
                <div className="text-sm text-gray-500">📍 {dummy.address}</div>
            </section>

            {/* 객실 선택 */}
            <section>
                <h2 className="text-lg font-bold mb-2">객실 선택</h2>
                <div className="space-y-2">
                    {dummy.rooms.map((room, i) => (
                        <div key={i} className="flex justify-between items-center border p-3 rounded">
                            <span className="text-gray-700">{room.name}</span>
                            <span className="text-yellow-600 font-semibold">{room.price.toLocaleString()}원</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* 숙소 소개 */}
            <section>
                <h2 className="text-lg font-bold mb-2">숙소 소개</h2>
                <p className="text-sm text-gray-700">{dummy.intro}</p>
            </section>

            {/* 서비스 및 시설 */}
            <section>
                <h2 className="text-lg font-bold mb-2">서비스 및 시설</h2>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {dummy.facilities.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </section>

            {/* 숙소 이용 정보 */}
            <section>
                <h2 className="text-lg font-bold mb-2">숙소 이용 정보</h2>
                <p className="text-sm text-gray-600">{dummy.usage}</p>
            </section>

            {/* 회사 정보 */}
            <section>
                <h2 className="text-lg font-bold mb-2">회사 정보</h2>
                <p className="text-sm text-gray-600">{dummy.company}</p>
            </section>

            {/* 위치 */}
            <section>
                <h2 className="text-lg font-bold mb-2">위치</h2>
                <div className="text-sm text-gray-600">
                    지도 API 연결 예정 (lat: {dummy.location.lat}, lng: {dummy.location.lng})
                </div>
            </section>

            {/* 리뷰 */}
            <section>
                <h2 className="text-lg font-bold mb-2">리뷰</h2>
                <div className="space-y-2">
                    {dummy.reviews.map((r, i) => (
                        <div key={i} className="border p-3 rounded text-sm text-gray-700">
                            <p><strong>{r.user}</strong> ⭐ {r.rating}</p>
                            <p>{r.comment}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 비슷한 숙소 */}
            <section>
                <h2 className="text-lg font-bold mb-2">비슷한 숙소</h2>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {dummy.similar.map((name, i) => <li key={i}>{name}</li>)}
                </ul>
            </section>


        </div>


    );
}

export default Accommodation;