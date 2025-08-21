

import React, { useState } from "react";

// Mock Data
const mockRoom = {
  id: 1,
  name: "오션뷰 디럭스룸",
  price: 120000,
  maxGuests: 4,
  images: [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
  ],
  amenities: [
    { icon: "🛏️", label: "퀸 베드 2개" },
    { icon: "🚿", label: "개별 욕실" },
    { icon: "📶", label: "무료 Wi-Fi" },
    { icon: "🌊", label: "오션뷰" },
    { icon: "☕", label: "커피포트" },
    { icon: "🧺", label: "세탁기" },
  ],
  description:
    "아름다운 바다 전망을 자랑하는 오션뷰 디럭스룸입니다. 넓은 공간과 쾌적한 침구, 다양한 편의시설로 여행의 피로를 풀어보세요. 가족, 친구, 연인 모두에게 완벽한 선택입니다.",
};

function ImageSlider({ images }) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((current - 1 + images.length) % images.length);
  const next = () => setCurrent((current + 1) % images.length);
  return (
    <div className="relative w-full h-56 sm:h-72 md:h-96 bg-gray-100 overflow-hidden rounded-lg">
      <img
        src={images[current]}
        alt={`room-${current}`}
        className="object-cover w-full h-full transition-all duration-300"
      />
      {images.length > 1 && (
        <>
          <button
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow md:text-2xl text-lg"
            onClick={prev}
          >
            ◀
          </button>
          <button
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow md:text-2xl text-lg"
            onClick={next}
          >
            ▶
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <span
                key={i}
                className={`block w-2 h-2 rounded-full ${
                  i === current ? "bg-blue-500" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function RoomDetail() {
  // 예약 관련 state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // 예약 버튼 클릭 핸들러 (데모용)
  const handleReserve = (e) => {
    e.preventDefault();
    alert(
      `예약 정보\n체크인: ${checkIn}\n체크아웃: ${checkOut}\n인원: ${guests}명`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-6">
      {/* 이미지 슬라이더 */}
      <ImageSlider images={mockRoom.images} />

      {/* 룸 정보 헤더 */}
      <div className="mt-5 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">{mockRoom.name}</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="text-lg font-semibold text-blue-600">
              {mockRoom.price.toLocaleString()}원/박
            </span>
            <span className="text-gray-500 text-base">
              최대 {mockRoom.maxGuests}인
            </span>
          </div>
        </div>
      </div>

      {/* 편의시설 */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">편의시설</h3>
        <div className="flex flex-wrap gap-4">
          {mockRoom.amenities.map((a, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1 text-sm"
            >
              <span className="text-xl">{a.icon}</span>
              <span>{a.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 상세 설명 */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">상세 설명</h3>
        <p className="text-gray-700">{mockRoom.description}</p>
      </div>

      {/* 예약 영역 */}
      <form
        className="mt-8 p-4 bg-white border rounded-lg shadow flex flex-col sm:flex-row gap-4 items-stretch sm:items-end"
        onSubmit={handleReserve}
      >
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-medium text-sm">체크인</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-medium text-sm">체크아웃</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="border rounded px-2 py-1"
            required
          />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <label className="font-medium text-sm">인원</label>
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: mockRoom.maxGuests }, (_, i) => i + 1).map(
              (num) => (
                <option key={num} value={num}>
                  {num}명
                </option>
              )
            )}
          </select>
        </div>
        <button
          type="submit"
          className="mt-3 sm:mt-0 sm:ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded"
        >
          예약하기
        </button>
      </form>
    </div>
  );
}