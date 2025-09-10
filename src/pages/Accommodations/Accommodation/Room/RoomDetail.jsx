import React, { useEffect, useState } from "react";
import {
    FaArrowLeft, FaListUl, FaUserFriends, FaCalendarAlt, FaBan,
    FaMapMarkerAlt, FaClock
} from "react-icons/fa";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import dayjs from "dayjs";
import axios from "axios";
import RoomImageViewer from "./RoomImageViewer";
import ReviewSlider from "./ReviewSlider";
import { useAuth } from "@/hooks/useAuth"; // 추가

export default function RoomDetail() {
    const navigate = useNavigate();
    const { roomId } = useParams();
    const [searchParams] = useSearchParams();
    const { user } = useAuth(); // 안전한 인증 정보
    const userId = user?.userId || null; // URL에서 제거 내부 상태로 관리

    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    const guests = Number(searchParams.get("guests")) || 2;
    const [roomDetail, setRoomDetail] = useState(null);

    useEffect(() => {
        axios.get(`/api/room/${roomId}`, {
            params: { checkIn, checkOut, guests }
        }).then(res => {
            setRoomDetail(res.data);
        }).catch(err => {
            console.error("객실 상세 조회 실패:", err);
        });
    }, [roomId, checkIn, checkOut, guests]);

    if (!roomDetail) {
        return <div className="text-center py-20 text-gray-500">객실 정보를 불러오는 중입니다...</div>;
    }

    const nights = dayjs(checkOut).diff(dayjs(checkIn), "day");
    const totalPrice = nights > 0 ? nights * roomDetail.price : roomDetail.price;

    const handleReserve = (e) => {
        e.preventDefault();
        if (!roomDetail.available) return;

        navigate("/reserve", {
            state: {
                roomId: roomDetail.roomId,
                checkIn,
                checkOut,
                guests,
                totalPrice,
                userId
            }
        });
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 pb-32">
            {/* 뒤로가기 */}
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition mb-6"
            >
                <FaArrowLeft className="text-lg" />
                <span>뒤로가기</span>
            </button>

            {/* 이미지 */}
            <RoomImageViewer images={roomDetail.images} />

            {/* 숙소 정보 */}
            <div className="mt-6 flex items-center gap-4">
                <img
                    src={roomDetail.accommodationThumbnail}
                    alt="숙소 썸네일"
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                />
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{roomDetail.accommodationName}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        <FaMapMarkerAlt /> {roomDetail.accommodationAddress}
                    </p>
                </div>
            </div>

            {/* 룸 정보 */}
            <div className="mt-6 border-b border-gray-200 pb-6">
                <h2 className="text-3xl font-bold text-gray-900">{roomDetail.name}</h2>
                <div className="flex items-center gap-6 mt-3 text-gray-700">
          <span className="text-xl font-semibold text-yellow-600">
            {roomDetail.price.toLocaleString()}원 / 1박
          </span>
                    <span className="flex items-center gap-2 text-base">
            <FaUserFriends /> 기준 {roomDetail.standardOccupancy}명 / 최대 {roomDetail.maxOccupancy}명
          </span>
                </div>
                <div className="mt-2 text-sm text-gray-500">
                    이 객실의 <span className="font-semibold text-gray-700">기준 인원은 {roomDetail.standardOccupancy}명</span>이며,
                    초과 시 <span className="font-semibold text-red-500">추가 요금</span>이 발생할 수 있습니다.<br/>
                    초과 1인당 <strong className="text-red-500">{roomDetail.extraPersonFee.toLocaleString()}원</strong>
                </div>

                {/* 예약 가능 여부 시각화 */}
                <div className="mt-4 text-sm">
          <span className={`font-semibold ${roomDetail.available ? "text-green-600" : "text-red-500"}`}>
            {roomDetail.available ? "예약 가능" : "예약 불가"}
          </span>
                </div>
            </div>

            {/* 숙소 소개 */}
            {roomDetail.intro && (
                <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 p-4 text-gray-700 text-sm leading-relaxed">
                    {roomDetail.intro}
                </div>
            )
            }

            {/* 침대 정보 */}
            {roomDetail.bedInfo?.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-semibold text-xl mb-3 text-gray-800">침대 구성</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {roomDetail.bedInfo.map((bed, idx) => (
                            <li key={idx}>{bed}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 편의시설 */}
            <div className="mt-8">
                <h3 className="font-semibold text-xl mb-4 text-gray-800 flex items-center gap-2">
                    <FaListUl className="text-yellow-600" />
                    편의시설
                </h3>
                <ul className="list-disc list-inside text-gray-600 text-sm leading-relaxed">
                    {roomDetail.amenities.map((label, idx) => (
                        <li key={idx}>{label}</li>
                    ))}
                </ul>
            </div>

            {/* 상세 설명 */}
            <div className="mt-8">
                <h3 className="font-semibold text-xl mb-3 text-gray-800">상세 설명</h3>
                <div className="text-gray-600 leading-relaxed text-base space-y-2">
                    {roomDetail.description.split("\n\n").map((desc, idx) => (
                        <p key={idx}>{desc.trim()}</p>
                    ))}
                </div>
            </div>

            {/* 리뷰 섹션 */}
            <div className="mt-10">
                <h3 className="font-semibold text-xl mb-3 text-gray-800">
                    리뷰 <span className="text-sm text-gray-500">({roomDetail.reviewCount}개)</span>
                </h3>
                <ReviewSlider reviews={roomDetail.reviews} />
            </div>

            {/* 체크인/체크아웃 시간 */}
            <div className="mt-6 text-sm text-gray-500 flex gap-4 items-center">
                <FaClock className="text-gray-400" />
                체크인 {dayjs(roomDetail.checkInTime).format("HH:mm")} / 체크아웃 {dayjs(roomDetail.checkOutTime).format("HH:mm")}
            </div>

            {/* 예약 바 */}
            <form
                className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-md px-6 py-6 z-50"
                onSubmit={handleReserve}
            >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 text-sm text-gray-700">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-center">
            <span className="font-semibold text-base text-gray-900">
              총 {nights}박 / {totalPrice.toLocaleString()}원
            </span>
                        <span className="flex items-center gap-1"><FaCalendarAlt /> {checkIn} ~ {checkOut}</span>
                        <span className="flex items-center gap-1"><FaUserFriends /> {guests}명</span>
                    </div>
                    {roomDetail.available ? (
                        <button
                            type="button"
                            onClick={async (e) => {
                                e.preventDefault();

                                const isLoggedIn = !!userId;

                                try {
                                    const response = await axios.get("/api/reserve/form-info", {
                                        params: {
                                            roomId: roomDetail.roomId,
                                            checkIn,
                                            checkOut,
                                            guests,
                                            ...(isLoggedIn && { userId }) // 로그인된 경우에만 포함
                                        }
                                    });

                                    const targetPath = isLoggedIn ? "/reserve" : "/reserve/guest";

                                    navigate(targetPath, {
                                        state: {
                                            ...response.data,
                                            roomId: roomDetail.roomId,
                                            checkIn,
                                            checkOut,
                                            guests,
                                            totalPrice
                                        }
                                    });
                                } catch (err) {
                                    console.error("예약 정보 불러오기 실패:", err);
                                    alert("예약 정보를 불러오는 데 문제가 발생했습니다. 다시 시도해주세요.");
                                }
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-lg px-6 py-3 transition focus:outline-none focus:ring-4 focus:ring-yellow-300"
                        >
                            예약하기
                        </button>
                    ) : (
                        <button
                            disabled
                            className="bg-gray-300 text-gray-500 font-semibold rounded-lg px-6 py-3 cursor-not-allowed"
                        >
                            <FaBan className="inline mr-2" /> 예약 불가 - 다른 날짜를 선택해주세요!
                        </button>
                    )}
                </div>
                {guests > roomDetail.standardOccupancy && (
                    <div className="text-xs text-red-500 text-center mt-2 leading-relaxed">
                        기준 인원 <strong>{roomDetail.standardOccupancy}명</strong>을 초과하셨습니다.
                        추가 인원 요금은 <strong>기본 숙박 요금에 포함되어</strong> 함께 결제됩니다.<br />
                        (기준 인원 {roomDetail.standardOccupancy}명 + 추가 인원 {guests - roomDetail.standardOccupancy}명 × {roomDetail.extraPersonFee.toLocaleString()}원)
                    </div>
                )}
            </form>
        </div>
    );
}