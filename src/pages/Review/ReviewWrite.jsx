import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { toast } from "react-toastify";
import { FaStar, FaTrash } from "react-icons/fa";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import Button from "@/components/ui/Button.jsx";
import { inputClass, labelClass } from "@/components/ui/styles";

export default function ReviewWrite() {
    const { reservationId } = useParams();
    const navigate = useNavigate();

    const [content, setContent] = useState("");
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const [cleanlinessRating, setCleanlinessRating] = useState(0);
    const [serviceRating, setServiceRating] = useState(0);
    const [facilitiesRating, setFacilitiesRating] = useState(0);
    const [locationRating, setLocationRating] = useState(0);
    const [rating, setRating] = useState(0); // 종합 평점 (자동 계산)

    useEffect(() => {
        const scores = [cleanlinessRating, serviceRating, facilitiesRating, locationRating].filter((v) => v > 0);
        if (scores.length > 0) {
            const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
            setRating(parseFloat(avg.toFixed(1)));
        } else {
            setRating(0);
        }
    }, [cleanlinessRating, serviceRating, facilitiesRating, locationRating]);

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files);
        if (images.length + files.length > 5) {
            toast.error("이미지는 최대 5장까지 업로드 가능합니다.");
            return;
        }

        const uploaded = await Promise.all(
            files.map(async (file) => {
                const formData = new FormData();
                formData.append("file", file);
                const res = await api.post("/api/files/upload?folder=reviews", formData);
                return res.data;
            })
        );
        setImages((prev) => [...prev, ...uploaded]);
    };

    const handleImageDelete = async (imgUrl) => {
        await api.delete("/api/files", { params: { folder: "reviews", imgUrl } });
        setImages((prev) => prev.filter((url) => url !== imgUrl));
    };

    const handleSubmit = async () => {
        if (rating === 0 || content.length < 20) {
            toast.error("모든 평점을 입력하고 최소 20자 이상의 리뷰를 작성해주세요.");
            return;
        }

        setLoading(true);
        try {
            await api.post("/api/review/write", {
                reservationId,
                rating,
                content,
                imageUrls: images,
                cleanlinessRating,
                serviceRating,
                facilitiesRating,
                locationRating,
            });
            navigate("/user/mypage/reservations");
        } catch {
            toast.error("리뷰 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const renderRatingSelector = (label, value, setter) => (
        <div className="flex items-center gap-2" role="group" aria-label={`${label} 평점`}>
            <span className="w-16 sm:w-24 shrink-0 text-sm font-bold text-deep-gray">{label}</span>
            <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        type="button"
                        key={i}
                        onClick={() => setter(i)}
                        aria-label={`${label} ${i}점`}
                        aria-pressed={i <= value}
                        className="p-1 rounded-md transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow"
                    >
                        <FaStar className={`text-lg ${i <= value ? "text-honey-yellow" : "text-gray-200"}`} />
                    </button>
                ))}
            </div>
            <span className="text-xs font-bold text-gray-400">{value}점</span>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <SectionTitle eyebrow="Write a Review" title="리뷰 작성" className="mb-0" />

            <Card className="space-y-6">
                {/* 세부 평점 */}
                <div className="space-y-3">
                    {renderRatingSelector("청결도", cleanlinessRating, setCleanlinessRating)}
                    {renderRatingSelector("서비스", serviceRating, setServiceRating)}
                    {renderRatingSelector("시설", facilitiesRating, setFacilitiesRating)}
                    {renderRatingSelector("위치", locationRating, setLocationRating)}
                </div>

                {/* 종합 평점 */}
                <div className="flex items-center justify-between rounded-2xl bg-honey-yellow/10 px-4 py-3 text-sm" aria-live="polite">
                    <strong className="font-black text-deep-gray">종합 평점</strong>
                    <span className="font-black text-honey-yellow-dark">{rating}점 <span className="text-xs font-bold text-gray-400">(자동 계산)</span></span>
                </div>

                {/* 텍스트 */}
                <div>
                    <label htmlFor="review-write-content" className={labelClass}>후기 내용 (20자 이상)</label>
                    <textarea
                        id="review-write-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={6}
                        placeholder="숙소는 어땠나요? 다른 사용자에게 도움이 될 수 있도록 솔직한 후기를 남겨주세요."
                        className={`${inputClass} resize-none`}
                    />
                    <p className="mt-1 text-right text-xs font-bold text-gray-300">{content.length}자</p>
                </div>

                {/* 이미지 업로드 */}
                <div className="space-y-3">
                    <label htmlFor="review-write-images" className={labelClass}>사진 (최대 5장)</label>
                    <input
                        id="review-write-images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-xl file:border-0 file:bg-honey-yellow/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-honey-yellow-dark hover:file:bg-honey-yellow/20"
                    />
                    <div className="flex gap-2 flex-wrap">
                        {images.map((url) => (
                            <div key={url} className="relative">
                                <img src={url} alt="preview" className="w-24 h-24 object-cover rounded-2xl" />
                                <button
                                    type="button"
                                    onClick={() => handleImageDelete(url)}
                                    aria-label="이미지 삭제"
                                    className="absolute top-1 right-1 bg-white/90 rounded-full p-1.5 text-xs shadow hover:bg-white"
                                >
                                    <FaTrash className="text-red-500" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            {/* 제출 */}
            <Button onClick={handleSubmit} disabled={loading} size="lg" fullWidth>
                {loading ? "등록 중..." : "리뷰 등록"}
            </Button>
        </div>
    );
}
