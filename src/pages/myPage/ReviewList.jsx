import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import api from "@/api/axios";
import {FaStar, FaTrash, FaPen, FaCommentDots} from "react-icons/fa";

export default function ReviewList() {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        fetchReviews(page);
    }, [page]);

    const fetchReviews = async (pageNum) => {
        setLoading(true);
        try {
            const res = await api.get(`/api/user/reviews?page=${pageNum}&size=5`);
            setReviews(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("❌ 리뷰 목록 불러오기 실패:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm("정말 삭제하시겠습니까?\n삭제하면 되돌릴 수 없습니다.");
        if (!confirmed) return;
        try {
            await api.delete(`/api/user/reviews/${reviewId}`);
            fetchReviews(page);
        } catch (err) {
            alert("리뷰 삭제에 실패했습니다.");
        }
    };

    const isEditable = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        return now - created < 24 * 60 * 60 * 1000;
    };

    return (
        <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">작성한 후기</h2>
            <p className="text-gray-600">내가 작성한 숙소 후기 목록이 여기에 표시됩니다.</p>

            {loading ? (
                <p className="text-center text-gray-500 mt-6">불러오는 중...</p>
            ) : reviews.length === 0 ? (
                <p className="text-sm text-gray-500 mt-6">아직 작성한 후기가 없습니다.</p>
            ) : (
                <div className="space-y-4 mt-6">
                    {reviews.map((r) => (
                        <div key={r.reviewId}
                             className="border rounded-lg p-4 bg-white shadow-sm space-y-4 sm:space-y-3">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <strong className="text-base text-gray-800">{r.accommodationName}</strong>
                                <span className="text-xs text-gray-500">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700">{r.content}</p>
                            <div className="flex items-center gap-1 text-yellow-500 text-sm">
                                <FaStar/>
                                <span>{r.rating}</span>
                            </div>
                            {r.imageUrls && r.imageUrls.length > 0 && (
                                <div className="flex gap-2 flex-wrap pt-2">
                                    {r.imageUrls.map((url, idx) => (
                                        <img
                                            key={idx}
                                            src={url}
                                            alt={`리뷰 이미지 ${idx + 1}`}
                                            className="w-24 h-24 object-cover rounded border"
                                        />
                                    ))}
                                </div>
                            )}
                            {r.reply && (
                                <div
                                    className="bg-gray-50 border-l-4 border-blue-400 p-3 rounded-md flex gap-2 items-start mt-2">
                                    <FaCommentDots className="text-blue-500 mt-1"/>
                                    <div>
                                        <p className="text-sm text-gray-700 whitespace-pre-line">{r.reply}</p>
                                        <p className="text-xs text-gray-500 mt-1">업체 담당자</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col sm:flex-row gap-2 pt-2">
                                {isEditable(r.createdAt) && (
                                    <button
                                        onClick={() => setEditingReview({...r, newImages: []})}
                                        className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                                    >
                                        <FaPen/>
                                        수정
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(r.reviewId)}
                                    className="text-sm text-red-500 hover:underline flex items-center gap-1"
                                >
                                    <FaTrash/>
                                    삭제
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {totalPages > 1 && (
                <div className="flex flex-wrap justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                        disabled={page === 0}
                        className="px-2 sm:px-4 py-1 sm:py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition"
                        aria-label="이전 페이지"
                    >
                        이전
                    </button>
                    <div className="flex flex-wrap gap-1 sm:gap-2 mx-2">
                        {Array.from({ length: totalPages }, (_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setPage(idx)}
                                className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded border text-sm focus:outline-none transition
                                    ${page === idx
                                        ? "bg-blue-600 text-white border-blue-600 font-semibold"
                                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50"}`}
                                aria-current={page === idx ? "page" : undefined}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={page + 1 >= totalPages}
                        className="px-2 sm:px-4 py-1 sm:py-2 text-sm bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50 transition"
                        aria-label="다음 페이지"
                    >
                        다음
                    </button>
                </div>
            )}

            {/* 수정 모달 */}
            {editingReview && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm backdrop-saturate-150">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md space-y-5">
                        <h3 className="text-lg font-bold text-gray-800">리뷰 수정</h3>

                        {/* 세부 평점 */}
                        <div className="space-y-3">
                            {[
                                { label: "청결도", key: "cleanlinessRating" },
                                { label: "서비스", key: "serviceRating" },
                                { label: "시설", key: "facilitiesRating" },
                                { label: "위치", key: "locationRating" },
                            ].map(({ label, key }) => (
                                <div key={key} className="flex items-center gap-2">
                                    <span className="text-sm text-gray-700">{label}</span>
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <FaStar
                                            key={i}
                                            className={`cursor-pointer ${i <= editingReview[key] ? "text-yellow-400" : "text-gray-300"}`}
                                            onClick={() => {
                                                const updated = { ...editingReview, [key]: i };
                                                const ratings = [
                                                    updated.cleanlinessRating,
                                                    updated.serviceRating,
                                                    updated.facilitiesRating,
                                                    updated.locationRating,
                                                ].filter((r) => typeof r === "number" && !isNaN(r));
                                                const avg = ratings.length > 0
                                                    ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1))
                                                    : 0.0;
                                                setEditingReview({ ...updated, rating: avg });
                                            }}
                                        />
                                    ))}
                                    <span className="text-sm text-gray-500">{editingReview[key] ?? 0}점</span>
                                </div>
                            ))}
                        </div>

                        {/* 종합 평점 */}
                        <div className="flex items-center gap-2 pt-2">
                            <span className="text-sm text-gray-700">종합 평점</span>
                            {[1, 2, 3, 4, 5].map((i) => (
                                <FaStar
                                    key={i}
                                    className={`${i <= Math.round(editingReview.rating ?? 0) ? "text-yellow-400" : "text-gray-300"}`}
                                />
                            ))}
                            <span className="text-sm text-gray-500">
          {(isNaN(editingReview.rating) ? 0.0 : editingReview.rating).toFixed(1)}점
        </span>
                        </div>

                        {/* 내용 */}
                        <textarea
                            value={editingReview.content}
                            onChange={(e) =>
                                setEditingReview((prev) => ({ ...prev, content: e.target.value }))
                            }
                            rows={5}
                            className="w-full border rounded p-2 text-sm"
                            placeholder="리뷰 내용을 수정해주세요."
                        />

                        {/* 기존 이미지 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">기존 이미지</label>
                            <div className="flex gap-2 flex-wrap">
                                {editingReview.imageUrls?.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        <img
                                            src={url}
                                            alt={`이미지 ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded border"
                                        />
                                        <button
                                            onClick={() =>
                                                setEditingReview((prev) => ({
                                                    ...prev,
                                                    imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
                                                }))
                                            }
                                            className="absolute top-0 right-0 bg-black bg-opacity-60 text-white text-xs px-1 rounded-bl"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 새 이미지 추가 */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">이미지 추가</label>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setEditingReview((prev) => ({
                                        ...prev,
                                        newImages: Array.from(e.target.files),
                                    }))
                                }
                                className="text-sm"
                            />
                        </div>

                        {/* 저장 & 취소 버튼 */}
                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                onClick={() => setEditingReview(null)}
                                className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
                            >
                                취소
                            </button>
                            <button
                                onClick={async () => {
                                    const formData = new FormData();
                                    formData.append(
                                        "review",
                                        new Blob(
                                            [JSON.stringify({
                                                reservationId: editingReview.reservationId,
                                                rating: editingReview.rating,
                                                cleanlinessRating: editingReview.cleanlinessRating,
                                                serviceRating: editingReview.serviceRating,
                                                facilitiesRating: editingReview.facilitiesRating,
                                                locationRating: editingReview.locationRating,
                                                content: editingReview.content,
                                                imageUrls: editingReview.imageUrls,
                                            })],
                                            { type: "application/json" }
                                        )
                                    );

                                    editingReview.newImages?.forEach((file) =>
                                        formData.append("newImages", file)
                                    );

                                    try {
                                        await api.post(
                                            `/api/user/reviews/${editingReview.reviewId}/update`,
                                            formData,
                                            { headers: { "Content-Type": "multipart/form-data" } }
                                        );
                                        setEditingReview(null);
                                        fetchReviews(page);
                                    } catch (err) {
                                        alert("리뷰 수정에 실패했습니다.");
                                    }
                                }}
                                className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}