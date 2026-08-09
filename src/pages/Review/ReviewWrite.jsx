import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axios";
import { FaStar, FaTrash } from "react-icons/fa";

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
            alert("이미지는 최대 5장까지 업로드 가능합니다.");
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
            alert("모든 평점을 입력하고 최소 20자 이상의 리뷰를 작성해주세요.");
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
            alert("리뷰 등록에 실패했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const renderRatingSelector = (label, value, setter) => (
        <div className="flex items-center gap-2">
            <span className="w-24 text-sm text-gray-700">{label}</span>
            {[1, 2, 3, 4, 5].map((i) => (
                <FaStar
                    key={i}
                    className={`cursor-pointer ${i <= value ? "text-yellow-400" : "text-gray-300"}`}
                    onClick={() => setter(i)}
                />
            ))}
            <span className="text-sm text-gray-500">{value}점</span>
        </div>
    );

    return (
        <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">📝 리뷰 작성</h2>

            {/* 세부 평점 */}
            <div className="space-y-3">
                {renderRatingSelector("청결도", cleanlinessRating, setCleanlinessRating)}
                {renderRatingSelector("서비스", serviceRating, setServiceRating)}
                {renderRatingSelector("시설", facilitiesRating, setFacilitiesRating)}
                {renderRatingSelector("위치", locationRating, setLocationRating)}
            </div>

            {/* 종합 평점 */}
            <div className="mt-4 text-sm text-gray-600">
                <strong>종합 평점:</strong> {rating}점 (자동 계산)
            </div>

            {/* 텍스트 */}
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder="숙소는 어땠나요? 다른 사용자에게 도움이 될 수 있도록 솔직한 후기를 남겨주세요."
                className="w-full border rounded p-3 text-sm"
            />

            {/* 이미지 업로드 */}
            <div className="space-y-2">
                <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
                <div className="flex gap-2 flex-wrap">
                    {images.map((url) => (
                        <div key={url} className="relative">
                            <img src={url} alt="preview" className="w-24 h-24 object-cover rounded border" />
                            <button
                                onClick={() => handleImageDelete(url)}
                                className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs"
                            >
                                <FaTrash className="text-red-500" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* 제출 */}
            <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-2 rounded font-semibold ${
                    loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#FF9F00] hover:bg-[#e68a00] text-white"
                }`}
            >
                {loading ? "등록 중..." : "리뷰 등록"}
            </button>
        </div>
    );
}
