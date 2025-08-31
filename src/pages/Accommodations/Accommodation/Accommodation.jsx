import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineArrowLeft,
    AiOutlineLeft,
    AiOutlineRight,
} from "react-icons/ai";
import {
    FaMapMarkerAlt,
    FaStar,
    FaThumbsDown,
    FaThumbsUp,
    FaUserFriends,
} from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import * as RiIcons from "react-icons/ri";
import * as MdIcons from "react-icons/md";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import WishToggleButton from "@/components/WishToggleButton.jsx";
import { useAuth } from "@/hooks/useAuth";
import GoogleMapView from "@/pages/Accommodations/Accommodation/GoogleMapView.jsx";

function Accommodation({ accommodationId, sectionRefs }) {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const { user } = useAuth();
    const userId = user?.userId;

    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = searchParams.get("guests");

    const [data, setData] = useState(null);
    const [isWished, setIsWished] = useState(false);
    const [activeSection, setActiveSection] = useState(null);
    const [reviewStates, setReviewStates] = useState([]);


    useEffect(() => {
        const params = { checkIn, checkOut };
        if (guests) params.guests = guests;
        if (userId) params.userId = userId;

        axios
            .get(`/api/accommodations/${accommodationId}`, { params })
            .then((res) => {
                setData(res.data);
                setIsWished(res.data.wished);
            })
            .catch((err) => console.error("숙소 상세 불러오기 실패:", err));
    }, [accommodationId, checkIn, checkOut, guests, userId]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.dataset.id || entry.target.id;
                        setActiveSection(sectionId);
                    }
                });
            },
            {
                threshold: 0.3,
                rootMargin: "-80px 0px -40% 0px",
            }
        );

        Object.values(sectionRefs.current).forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!data?.location) return;

        const { latitude, longitude } = data.location;

        window.initKakaoMap = () => {
            const mapContainer = document.getElementById("map");
            if (!mapContainer || !window.kakao || !window.kakao.maps) return;

            const mapOption = {
                center: new window.kakao.maps.LatLng(latitude, longitude),
                level: 3,
            };

            const map = new window.kakao.maps.Map(mapContainer, mapOption);

            const marker = new window.kakao.maps.Marker({
                position: new window.kakao.maps.LatLng(latitude, longitude),
                map: map,
            });

            const infoWindow = new window.kakao.maps.InfoWindow({
                content: `<div style="padding:5px;">${data.name}</div>`,
            });
            infoWindow.open(map, marker);
        };
    }, [data]);


    useEffect(() => {
        if (data?.reviews) {
            const initialStates = data.reviews.map((r) => ({
                reviewId: r.reviewId,
                isLiked: false,
                likeCount: r.likeCount ?? 0,
            }));
            setReviewStates(initialStates);
        }
    }, [data]);

    const SlickPrevArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} z-10 left-1`}
                style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "9999px",
                    width: 36,
                    height: 36,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                onClick={onClick}
                aria-label="이전 이미지"
                type="button"
            >
                <AiOutlineLeft className="text-xl text-gray-700" />
            </button>
        );
    };

    const SlickNextArrow = (props) => {
        const { className, style, onClick } = props;
        return (
            <button
                className={`${className} z-10 right-1`}
                style={{
                    ...style,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255,255,255,0.7)",
                    borderRadius: "9999px",
                    width: 36,
                    height: 36,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                }}
                onClick={onClick}
                aria-label="다음 이미지"
                type="button"
            >
                <AiOutlineRight className="text-xl text-gray-700" />
            </button>
        );
    };

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        accessibility: true,
        arrows: true,
        prevArrow: <SlickPrevArrow />,
        nextArrow: <SlickNextArrow />,
    };

    if (!data) return <div className="text-center py-20">로딩 중...</div>;

    return (
        <div className="w-full sm:max-w-6xl mx-auto bg-white rounded-lg shadow p-4 sm:p-6 md:p-8 lg:p-10 space-y-8 sm:space-y-10 md:space-y-12 px-2 sm:px-4 md:px-6 overflow-y-auto">
            {/* 뒤로가기 */}
            <div className="mb-4">
                <button
                    onClick={() => window.history.back()}
                    className="flex items-center px-3 py-1 bg-white rounded hover:bg-gray-300 text-gray-700"
                >
                    ← 뒤로가기
                </button>
            </div>

            {/* 이미지 슬라이더 */}
            <section className="w-full">
                <Slider {...sliderSettings}>
                    {data.images.map((src, i) => (
                        <div key={i} className="w-full" tabIndex="-1">
                            <img
                                src={src}
                                alt={`숙소 이미지 ${i + 1}`}
                                className="w-full h-40 sm:h-56 md:h-80 lg:h-96 xl:h-[38rem] object-cover rounded-md bg-white"
                            />
                        </div>
                    ))}
                </Slider>
            </section>

            {/* 숙소 정보 */}
            <header className="relative flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0 w-full">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-800">{data.name}</h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {data.category} · {data.address}
                    </p>
                    <div className="flex items-center gap-1 sm:gap-2 mt-1 text-xs sm:text-sm text-gray-600">
                        <FaStar className="text-yellow-500" />
                        <span>{data.rating.toFixed(1)}</span>
                        <span>· 리뷰 {data.reviewCount}개</span>
                    </div>
                </div>
                <div className="text-left sm:text-right mt-2 sm:mt-0">
                    <p className="text-lg sm:text-xl font-semibold text-yellow-600">
                        {data.price.toLocaleString()}원~
                    </p>
                    <WishToggleButton
                        accommodationId={accommodationId}
                        initialLiked={isWished}
                        userId={userId}
                    />
                </div>
            </header>

            {/* 태그 */}
            <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 w-full">
                <div className="flex flex-wrap gap-1 sm:gap-2 text-xs sm:text-sm text-gray-600">
                    {data.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded flex items-center gap-1">
              {tag.iconName &&
                  (FaIcons[tag.iconName] || RiIcons[tag.iconName] || MdIcons[tag.iconName]) &&
                  React.createElement(
                      FaIcons[tag.iconName] || RiIcons[tag.iconName] || MdIcons[tag.iconName],
                      { className: "text-yellow-500" }
                  )}
                            {tag.name}
            </span>
                    ))}
                </div>
                <div className="text-xs sm:text-sm text-gray-500">📍 {data.address}</div>
            </section>

            {/* 객실 선택 */}
            <section
                id="rooms"
                ref={(el) => (sectionRefs.current["rooms"] = el)}
                data-id="rooms"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2 flex items-center gap-2">
                    객실 선택
                    <span className="text-xs text-gray-500 font-normal">
            클릭하여 객실 정보를 확인해보세요! :)
          </span>
                </h2>

                <div className="flex flex-col gap-3 sm:gap-4 w-full">
                    {data.rooms.map((room, i) => {
                        const isAvailable = room.available;
                        const imageUrl =
                            room.images?.find((img) => img.includes("s_")) || room.images?.[0];

                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    if (isAvailable) {
                                        navigate(
                                            `/room/${room.roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`
                                        );
                                    }
                                }}
                                className={`w-full bg-white border border-gray-200 rounded-lg p-3 sm:p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center transition transform ${
                                    isAvailable
                                        ? "hover:scale-105 hover:shadow-lg cursor-pointer"
                                        : "opacity-50 grayscale brightness-90 cursor-not-allowed pointer-events-none"
                                }`}
                            >
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt={`${room.name} 이미지`}
                                        className="w-full sm:w-auto h-32 sm:h-40 md:h-45 object-cover rounded-lg shadow-sm mb-2 sm:mb-0"
                                    />
                                )}

                                <div className="flex-1 w-full">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                                        <span className="text-gray-700 font-semibold text-base">{room.name}</span>
                                        {isAvailable ? (
                                            <span className="text-yellow-600 font-semibold mt-1 sm:mt-0">
                        {room.price.toLocaleString()}원
                      </span>
                                        ) : (
                                            <span className="text-sm text-red-500 font-semibold mt-1 sm:mt-0">
                        예약 마감
                      </span>
                                        )}
                                    </div>

                                    {room.description && (
                                        <p className="text-base text-gray-500 mt-1">{room.description}</p>
                                    )}

                                    {room.standardOccupancy && room.maxOccupancy && (
                                        <p className="text-base text-gray-500 mt-1 flex items-center gap-1">
                                            <FaUserFriends className="text-gray-400" />
                                            기준 {room.standardOccupancy}명 / 최대 {room.maxOccupancy}명
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>
            {/* 숙소 소개 */}
            <section
                id="intro"
                ref={(el) => (sectionRefs.current["intro"] = el)}
                data-id="intro"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2">숙소 소개</h2>
                {data.intro.split("/").map((line, idx) => (
                    <p key={idx} className="text-base text-gray-700 mt-3">{line}</p>
                ))}
            </section>

            {/* 서비스 및 시설 */}
            <section
                id="facilities"
                ref={(el) => (sectionRefs.current["facilities"] = el)}
                data-id="facilities"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2">서비스 및 시설</h2>
                <ul className="list-disc list-inside text-sm text-gray-600">
                    {data.facilities.map((f, i) => (
                        <li key={i}>{f}</li>
                    ))}
                </ul>
            </section>

            {/* 숙소 이용 정보 */}
            <section
                id="usage"
                ref={(el) => (sectionRefs.current["usage"] = el)}
                data-id="usage"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2">숙소 이용 정보</h2>
                <p className="text-sm text-gray-600">{data.usage}</p>
            </section>

            {/* 취소 정책 */}
            {data.cancellationPolicies?.length > 0 && (
                <div className="cancellation-card bg-red-100 border border-red-300 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold mb-2">취소 규정</h4>
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-red-200">
                            <th className="border border-red-300 p-2">정책명</th>
                            <th className="border border-red-300 p-2">상세</th>
                        </tr>
                        </thead>
                        <tbody>
                        {data.cancellationPolicies.map((policy) => (
                            <tr key={policy.policyId}>
                                <td className="border border-red-300 p-2 font-medium">{policy.policyName}</td>
                                <td className="border border-red-300 p-2">{policy.detail}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <p className="text-sm text-gray-600 mt-2">
                        {data.name}에 대한 예약 취소 정책입니다. 각 정책을 확인하시고 예약을 진행해주세요!! :)
                    </p>
                </div>
            )}

            {/* 위치 */}
            <section
                id="location"
                ref={(el) => (sectionRefs.current["location"] = el)}
                data-id="location"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-2">위치</h2>
                <div className="w-full h-80 rounded-md shadow overflow-hidden">
                    {data.location && (
                        <GoogleMapView
                            lat={data.location.latitude}
                            lng={data.location.longitude}
                        />
                    )}
                </div>
                <div className="flex items-center mt-2 text-gray-600 text-sm">
                    <FaMapMarkerAlt className="mr-1 text-red-500" />
                    <span>{data.address}</span>
                </div>
            </section>

            {/* 리뷰 */}
            <section
                id="reviews"
                ref={(el) => (sectionRefs.current["reviews"] = el)}
                data-id="reviews"
                className="w-full"
            >
                <h2 className="text-lg font-bold mb-4">리뷰</h2>
                <div className="space-y-4 w-full">
                    {data.reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">아직 리뷰가 없습니다.</p>
                    ) : (
                        data.reviews.map((r, i) => {
                            const state = reviewStates.find((s) => s.reviewId === r.reviewId);
                            const isLiked = state?.isLiked ?? false;
                            const likeCount = state?.likeCount ?? 0;

                            const handleToggleLike = async () => {
                                try {
                                    const res = await fetch(`/api/review/${r.reviewId}/like?isLiked=${isLiked}`, {
                                        method: "POST",
                                    });
                                    const count = await res.json();
                                    setReviewStates((prev) =>
                                        prev.map((s) =>
                                            s.reviewId === r.reviewId
                                                ? { ...s, isLiked: !isLiked, likeCount: count }
                                                : s
                                        )
                                    );
                                } catch (err) {
                                    console.error("좋아요 토글 실패:", err);
                                }
                            };

                            return (
                                <div key={i} className="border rounded-lg p-4 bg-white shadow-sm space-y-3">
                                    {/* 이미지 */}
                                    {r.images?.length > 0 && (
                                        <div className="flex gap-2 flex-wrap">
                                            {r.images.map((url, idx) => (
                                                <img
                                                    key={idx}
                                                    src={url}
                                                    alt={`리뷰 이미지 ${idx + 1}`}
                                                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded border"
                                                />
                                            ))}
                                        </div>
                                    )}

                                    {/* 작성자 + 평점 */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <strong className="text-gray-800 text-sm sm:text-base">{r.nickname}</strong>
                                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                                <FaStar />
                                                <span>{r.rating}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400">
                {new Date(r.createdAt).toLocaleDateString()}
              </span>
                                    </div>

                                    {/* 본문 */}
                                    <p className="text-sm text-gray-700">{r.content}</p>

                                    {/* 좋아요 / 싫어요 */}
                                    <div className="flex items-center gap-4 mt-2">
                                        <button className="flex items-center gap-1 text-red-500 hover:underline text-sm">
                                            <FaThumbsDown />
                                            <span>싫어요</span>
                                        </button>
                                        <button
                                            onClick={handleToggleLike}
                                            className={`flex items-center gap-1 ${isLiked ? "text-blue-700" : "text-blue-600"} hover:underline text-sm`}
                                        >
                                            {isLiked ? <AiFillHeart /> : <FaThumbsUp />}
                                            <span>좋아요 {likeCount}</span>
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* 비슷한 숙소 */}
            {data.similar && (
                <section
                    id="similar"
                    ref={(el) => (sectionRefs.current["similar"] = el)}
                    data-id="similar"
                    className="w-full"
                >
                    <h2 className="text-lg font-bold mb-2">비슷한 숙소</h2>
                    <ul className="list-disc list-inside text-sm text-gray-600">
                        {data.similar.map((name, i) => (
                            <li key={i}>{name}</li>
                        ))}
                    </ul>
                </section>
            )}
        </div>
    );
}

export default Accommodation;