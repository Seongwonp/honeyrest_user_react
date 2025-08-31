import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import api from "@/api/axios";

export default function ReservationList() {
    const { user } = useOutletContext();
    const [reservations, setReservations] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 5, totalPages: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.userId) fetchReservations(pageInfo.page);
    }, [user, pageInfo.page]);

    const fetchReservations = async (page) => {
        try {
            const res = await api.get("/api/user/reservations", {
                params: { page, size: pageInfo.size },
            });

            setReservations(res.data.content);
            setPageInfo({
                page: res.data.page,
                size: res.data.size,
                totalPages: res.data.totalPages,
            });
        } catch (err) {
            console.error("❌ 예약 내역 조회 실패:", err);
        }
    };

    const handlePageChange = (nextPage) => {
        setPageInfo((prev) => ({ ...prev, page: nextPage }));
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">📋 나의 예약 내역</h2>

            {reservations.length === 0 ? (
                <p className="text-gray-500">예약 내역이 없습니다.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reservations.map((res) => (
                        <div
                            key={res.reservationId}
                            className="bg-white border rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
                            onClick={() =>
                                navigate(`/user/mypage/reservations/${res.reservationId}`)
                            }
                        >
                            <div className="flex gap-4 items-center p-4">
                                <img
                                    src={res.thumbnailUrl}
                                    alt="숙소 썸네일"
                                    className="w-32 h-32 object-cover rounded-md border"
                                />
                                <div className="flex-1 space-y-1">
                                    <p className="text-lg font-semibold text-gray-800">
                                        {res.accommodationName}
                                    </p>
                                    <p className="text-sm text-gray-600">{res.roomName}</p>
                                    <p className="text-sm text-gray-500">
                                        {res.checkIn} ~ {res.checkOut}
                                    </p>
                                    <p className="text-sm text-gray-700">
                                        예약번호:{" "}
                                        <span className="font-mono text-[#1E3A8A]">
                      {res.reservationCode}
                    </span>
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        상태:{" "}
                                        <span
                                            className={`font-semibold ${
                                                res.status === "CONFIRMED"
                                                    ? "text-green-600"
                                                    : res.status === "CANCELLED"
                                                        ? "text-red-500"
                                                        : "text-gray-500"
                                            }`}
                                        >
                      {res.status === "CONFIRMED"
                          ? "예약 완료"
                          : res.status === "CANCELLED"
                              ? "예약 취소됨"
                              : res.status}
                    </span>
                                    </p>
                                </div>
                                <div className="text-right text-[#FF9F00] font-bold text-lg whitespace-nowrap">
                                    {res.price.toLocaleString()}원
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* 페이징 */}
            <div className="flex justify-center items-center gap-4 mt-8">
                <button
                    disabled={pageInfo.page === 0}
                    onClick={() => handlePageChange(pageInfo.page - 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    이전
                </button>
                <span className="text-sm text-gray-600">
          {pageInfo.page + 1} / {pageInfo.totalPages}
        </span>
                <button
                    disabled={pageInfo.page + 1 >= pageInfo.totalPages}
                    onClick={() => handlePageChange(pageInfo.page + 1)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                >
                    다음
                </button>
            </div>
        </div>
    );
}