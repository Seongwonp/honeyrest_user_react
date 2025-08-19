import { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Accommodation({ accommodationId }) {
    const [data, setData] = useState(null);
    const [isWished, setIsWished] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        axios.get(`/api/accommodations/${accommodationId}`, {
            params: { userId }
        }).then(res => {
            setData(res.data);
            setIsWished(res.data.wished);
        });
    }, [accommodationId]);

    const handleWishToggle = () => {
        const userId = localStorage.getItem("userId");
        if (!userId) return alert("로그인이 필요합니다");

        const url = isWished
            ? `/api/wishlist/${accommodationId}`
            : `/api/wishlist`;

        const method = isWished ? "delete" : "post";

        axios({ method, url, data: { userId, accommodationId } })
            .then(() => setIsWished(!isWished));
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };

    if (!data) return <div className="text-center py-20">로딩 중...</div>;

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-10 space-y-12">
            {/* 이미지 슬라이더 */}
            <section>
                <Slider {...sliderSettings}>
                    {data.images.map((src, i) => (
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
                    <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">
                        {data.category} · {data.address}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-semibold text-yellow-600">
                        {data.price.toLocaleString()}원~
                    </p>
                    <button
                        onClick={handleWishToggle}
                        className="mt-2 px-3 py-1 text-sm border rounded hover:bg-yellow-100 transition"
                    >
                        {isWished ? "찜 취소" : "찜하기"}
                    </button>
                </div>
            </header>

            {/* 태그 + 위치 */}
            <section className="flex justify-between items-center">
                <div className="flex gap-2 text-sm text-gray-600">
                    {data.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded">{tag.name}</span>
                    ))}
                </div>
                <div className="text-sm text-gray-500">📍 {data.address}</div>
            </section>

            {/* 객실 선택 */}
            <section>
                <h2 className="text-lg font-bold mb-2">객실 선택</h2>
                <div className="space-y-2">
                    {data.rooms.map((room, i) => (
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
                <p className="text-sm text-gray-700">{data.intro}</p>
            </section>

            {/* 서비스 및 시설 */}
            <section>
                <h2 className="text-lg font-bold mb-2">서비스 및 시설</h2>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {data.facilities.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
            </section>

            {/* 숙소 이용 정보 */}
            <section>
                <h2 className="text-lg font-bold mb-2">숙소 이용 정보</h2>
                <p className="text-sm text-gray-600">{data.usage}</p>
            </section>

            {/* 회사 정보 */}
            <section>
                <h2 className="text-lg font-bold mb-2">회사 정보</h2>
                <p className="text-sm text-gray-600">{data.company.name}</p>
            </section>

            {/* 위치 */}
            <section>
                <h2 className="text-lg font-bold mb-2">위치</h2>
                <div className="text-sm text-gray-600">
                    지도 API 연결 예정 (lat: {data.location.latitude}, lng: {data.location.longitude})
                </div>
            </section>

            {/* 리뷰 */}
            <section>
                <h2 className="text-lg font-bold mb-2">리뷰</h2>
                <div className="space-y-2">
                    {data.reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">아직 리뷰가 없습니다.</p>
                    ) : (
                        data.reviews.map((r, i) => (
                            <div key={i} className="border p-3 rounded text-sm text-gray-700">
                                <p><strong>{r.userName}</strong> ⭐ {r.rating}</p>
                                <p>{r.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            {/* 비슷한 숙소 */}
            {data.similar && (
                <section>
                    <h2 className="text-lg font-bold mb-2">비슷한 숙소</h2>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {data.similar.map((name, i) => <li key={i}>{name}</li>)}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default Accommodation;