import React, {useEffect, useState} from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import api from "@/api/axios";
import {FaStar, FaTrash, FaPen, FaCommentDots, FaRegStar} from "react-icons/fa";
import SafeImage from "@/components/SafeImage.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import ListSkeleton from "@/components/ui/ListSkeleton.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import Pagination from "@/components/ui/Pagination.jsx";
import Button from "@/components/ui/Button.jsx";
import Dialog from "@/components/ui/Dialog.jsx";
import { cardClass, inputClass, labelClass } from "@/components/ui/styles";

// 세부 평점 항목
const RATING_FIELDS = [
    { label: "청결도", key: "cleanlinessRating" },
    { label: "서비스", key: "serviceRating" },
    { label: "시설", key: "facilitiesRating" },
    { label: "위치", key: "locationRating" },
];

export default function ReviewList() {
    const [reviews, setReviews] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [editingReview, setEditingReview] = useState(null);

    useEffect(() => {
        fetchReviews(page);
    }, [page]);

    const fetchReviews = async (pageNum) => {
        setLoading(true);
        setLoadError(false);
        try {
            const res = await api.get(`/api/user/reviews?page=${pageNum}&size=5`);
            setReviews(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("❌ 리뷰 목록 불러오기 실패:", err);
            setLoadError(true);
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
        } catch {
            toast.error("리뷰 삭제에 실패했습니다.");
        }
    };

    const isEditable = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        return now - created < 24 * 60 * 60 * 1000;
    };

    // 세부 평점 변경 시 종합 평점(평균) 재계산
    const handleRatingChange = (key, i) => {
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
    };

    const handleSave = async () => {
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
        } catch {
            toast.error("리뷰 수정에 실패했습니다.");
        }
    };

    return (
        <section>
            <SectionTitle
                eyebrow="Reviews"
                title="작성한 후기"
                description="내가 작성한 숙소 후기 목록이 여기에 표시됩니다."
            />

            {loading ? (
                <ListSkeleton rows={3} height="h-40" />
            ) : loadError ? (
                <ErrorState title="후기 목록을 불러오지 못했습니다." onRetry={() => fetchReviews(page)} />
            ) : reviews.length === 0 ? (
                <EmptyState
                    icon={<FaRegStar />}
                    title="아직 작성한 후기가 없습니다."
                    description="숙박을 마친 뒤 예약 상세에서 후기를 남길 수 있어요."
                />
            ) : (
                <ul className="space-y-4">
                    {reviews.map((r, index) => (
                        <motion.li
                            key={r.reviewId}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${cardClass} p-5 sm:p-6 space-y-4`}
                        >
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                                <strong className="text-lg font-black text-deep-gray leading-tight break-keep">{r.accommodationName}</strong>
                                <span className="text-xs font-bold text-gray-400">
                                    {new Date(r.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="inline-flex items-center gap-1 bg-honey-yellow/10 px-2 py-1 rounded-lg">
                                <FaStar className="text-honey-yellow" size={12}/>
                                <span className="text-xs font-black text-honey-yellow-dark">{r.rating}</span>
                            </div>
                            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line break-words">{r.content}</p>
                            {r.imageUrls && r.imageUrls.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {r.imageUrls.map((url, idx) => (
                                        <SafeImage kind="room"
                                            key={url}
                                            src={url}
                                            alt={`리뷰 이미지 ${idx + 1}`}
                                            className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl"
                                        />
                                    ))}
                                </div>
                            )}
                            {r.reply && (
                                <div className="bg-leaf-green/5 border border-leaf-green/20 p-4 rounded-2xl flex gap-3 items-start">
                                    <FaCommentDots className="text-leaf-green shrink-0 mt-0.5"/>
                                    <div className="min-w-0">
                                        <p className="text-[10px] font-bold text-leaf-green-dark uppercase tracking-widest mb-1">업체 담당자</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-line break-words">{r.reply}</p>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-50">
                                {isEditable(r.createdAt) && (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => setEditingReview({...r, newImages: []})}
                                    >
                                        <FaPen/>
                                        수정
                                    </Button>
                                )}
                                <Button
                                    variant="danger"
                                    size="sm"
                                    onClick={() => handleDelete(r.reviewId)}
                                >
                                    <FaTrash/>
                                    삭제
                                </Button>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}

            {!loading && !loadError && (
                <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}

            {/* 수정 모달 */}
            {editingReview && (
                <Dialog onClose={() => setEditingReview(null)} title="리뷰 수정" className="max-w-md">
                    <div className="space-y-5">
                        {/* 세부 평점 */}
                        <div className="space-y-3">
                            {RATING_FIELDS.map(({ label, key }) => (
                                <div key={key} className="flex items-center gap-2" role="group" aria-label={`${label} 평점`}>
                                    <span className="w-14 shrink-0 text-sm font-bold text-deep-gray">{label}</span>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <button
                                                type="button"
                                                key={i}
                                                onClick={() => handleRatingChange(key, i)}
                                                aria-label={`${label} ${i}점`}
                                                aria-pressed={i <= (editingReview[key] ?? 0)}
                                                className="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow"
                                            >
                                                <FaStar className={i <= editingReview[key] ? "text-honey-yellow" : "text-gray-200"} />
                                            </button>
                                        ))}
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">{editingReview[key] ?? 0}점</span>
                                </div>
                            ))}
                        </div>

                        {/* 종합 평점 */}
                        <div className="flex items-center gap-2 bg-honey-yellow/10 rounded-2xl px-4 py-3">
                            <span className="text-sm font-black text-deep-gray">종합 평점</span>
                            <div className="flex gap-0.5" aria-hidden="true">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <FaStar
                                        key={i}
                                        className={`${i <= Math.round(editingReview.rating ?? 0) ? "text-honey-yellow" : "text-gray-200"}`}
                                    />
                                ))}
                            </div>
                            <span className="text-sm font-black text-honey-yellow-dark">
                                {(isNaN(editingReview.rating) ? 0.0 : editingReview.rating).toFixed(1)}점
                            </span>
                        </div>

                        {/* 내용 */}
                        <div>
                            <label htmlFor="review-edit-content" className={labelClass}>내용</label>
                            <textarea
                                id="review-edit-content"
                                value={editingReview.content}
                                onChange={(e) =>
                                    setEditingReview((prev) => ({ ...prev, content: e.target.value }))
                                }
                                rows={5}
                                className={`${inputClass} resize-none`}
                                placeholder="리뷰 내용을 수정해주세요."
                            />
                        </div>

                        {/* 기존 이미지 */}
                        <div>
                            <p className={labelClass}>기존 이미지</p>
                            <div className="flex gap-2 flex-wrap">
                                {editingReview.imageUrls?.map((url, idx) => (
                                    <div key={url} className="relative">
                                        <SafeImage kind="room"
                                            src={url}
                                            alt={`이미지 ${idx + 1}`}
                                            className="w-20 h-20 object-cover rounded-2xl"
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setEditingReview((prev) => ({
                                                    ...prev,
                                                    imageUrls: prev.imageUrls.filter((_, i) => i !== idx),
                                                }))
                                            }
                                            aria-label={`이미지 ${idx + 1} 삭제`}
                                            className="absolute top-1 right-1 bg-deep-gray/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg hover:bg-red-500 transition-colors"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 새 이미지 추가 */}
                        <div>
                            <label htmlFor="review-edit-images" className={labelClass}>이미지 추가</label>
                            <input
                                id="review-edit-images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) =>
                                    setEditingReview((prev) => ({
                                        ...prev,
                                        newImages: Array.from(e.target.files),
                                    }))
                                }
                                className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-xl file:border-0 file:bg-honey-yellow/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-honey-yellow-dark hover:file:bg-honey-yellow/20"
                            />
                        </div>

                        {/* 저장 & 취소 버튼 */}
                        <div className="flex justify-end gap-2 pt-2">
                            <Button variant="secondary" onClick={() => setEditingReview(null)}>
                                취소
                            </Button>
                            <Button onClick={handleSave}>
                                저장
                            </Button>
                        </div>
                    </div>
                </Dialog>
            )}
        </section>
    );
}
