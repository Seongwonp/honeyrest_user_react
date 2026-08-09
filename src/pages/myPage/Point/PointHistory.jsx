import React, { useEffect, useState } from "react";
import useApiRequest from "@/api/useApiRequest";
import { FaArrowLeft, FaArrowRight, FaHistory, FaCoins } from "react-icons/fa";

function PointHistory() {
    const [currentPoint, setCurrentPoint] = useState(0);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(10);

    const { request } = useApiRequest();

    const fetchPointHistory = (pageNumber = 0) => {
        request(
            {
                url: "/api/user/point-history",
                method: "GET",
                params: { page: pageNumber, size },
            },
            {
                onSuccess: (data) => {
                    setCurrentPoint(data.currentPoint);
                    setHistory(data.history);
                    setTotalPages(data.totalPages);
                    setPage(data.page);
                    setSize(data.size);
                },
                onError: (err) => console.error("포인트 히스토리 조회 실패:", err),
            }
        );
    };

    useEffect(() => {
        fetchPointHistory();
    }, []);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchPointHistory(newPage);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-3 text-yellow-600">
                <FaCoins /> 포인트 현황
            </h1>

            <div className="bg-yellow-50 p-5 rounded-lg mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center shadow-inner border border-yellow-300">
                <span className="text-lg font-medium">현재 포인트:</span>
                <span className="font-extrabold text-3xl text-yellow-600">{currentPoint.toLocaleString()}</span>
            </div>

            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <FaHistory /> 포인트 내역
            </h2>

            {history.length === 0 ? (
                <p className="text-gray-500 text-center py-10">포인트 내역이 없습니다.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-sm border border-gray-200">
                        <thead className="bg-yellow-100 border-b border-yellow-300">
                            <tr>
                                <th className="text-left px-6 py-3 font-semibold text-yellow-700 uppercase tracking-wide">내역</th>
                                <th className="text-center px-6 py-3 font-semibold text-yellow-700 uppercase tracking-wide">포인트</th>
                                <th className="text-center px-6 py-3 font-semibold text-yellow-700 uppercase tracking-wide">잔액</th>
                                <th className="text-center px-6 py-3 font-semibold text-yellow-700 uppercase tracking-wide">날짜 및 시간</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.map((item, idx) => (
                                <tr
                                    key={idx}
                                    className={`${idx % 2 === 0 ? "bg-white" : "bg-yellow-50"} transition-colors duration-200`}
                                >
                                    <td className="px-6 py-4 border-b border-gray-100 text-gray-800">{item.reason}</td>
                                    <td
                                        className={`px-6 py-4 border-b border-gray-100 text-center font-semibold ${
                                            item.amount > 0 ? "text-red-600" : "text-blue-600"
                                        }`}
                                    >
                                        {item.amount > 0 ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100 text-center text-gray-700 font-medium">
                                        {item.balance.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100 text-center text-gray-600">
                                        {new Date(item.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mt-6">
                    <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-yellow-200 text-yellow-800 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        aria-label="이전 페이지"
                    >
                        <FaArrowLeft />
                        이전
                    </button>
                    {Array.from({ length: totalPages }).map((_, idx) => (
                        <button
                            key={idx}
                            className={`px-4 py-2 rounded-md font-semibold transition ${
                                idx === page
                                    ? "bg-yellow-500 text-white shadow-lg"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                            }`}
                            onClick={() => handlePageChange(idx)}
                            aria-current={idx === page ? "page" : undefined}
                        >
                            {idx + 1}
                        </button>
                    ))}
                    <button
                        className="flex items-center gap-1 px-4 py-2 rounded-md bg-yellow-200 text-yellow-800 hover:bg-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                        aria-label="다음 페이지"
                    >
                        다음
                        <FaArrowRight />
                    </button>
                </div>
            )}
        </div>
    );
}

export default PointHistory;
