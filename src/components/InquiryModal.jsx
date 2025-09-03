import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import useApiRequest from "@/api/useApiRequest";

function InquiryModal({ onClose, accommodationId, userId }) {
    const { request, isLoading } = useApiRequest();

    const [category, setCategory] = useState("예약/결제");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(
        "[문의 내용 작성 예시]\n1. 예약자 이름:\n2. 예약 날짜:\n3. 문의 내용:"
    );

    const categories = ["예약/결제", "시설문의", "기타"];

    const handleSubmit = async () => {
        if (!userId) {
            alert("문의 등록은 로그인 후에 가능합니다.");
            return;
        }
        if (
            !title.trim() ||
            !content.trim() ||
            content.trim() ===
            "[문의 내용 작성 예시]\n1. 예약자 이름:\n2. 예약 날짜:\n3. 문의 내용:"
        ) {
            alert("제목과 내용을 모두 입력해주세요!");
            return;
        }

        try {
            await request(
                {
                    url: "/api/user/inquiries",  // 올바른 API 주소
                    method: "POST",
                    data: { title, content, category, accommodationId, userId },
                },
                {
                    successMessage: "문의가 정상적으로 등록되었습니다!",
                }
            );
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 w-full max-w-xl space-y-5 relative shadow-lg">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    aria-label="Close modal"
                >
                    ✖
                </button>

                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <FaQuestionCircle /> 1:1 문의
                </h2>

                <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                            {cat}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <textarea
                    placeholder="[문의 내용 작성 예시]\n1. 예약자 이름:\n2. 예약 날짜:\n3. 문의 내용:"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 h-48 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <button
                    onClick={handleSubmit}
                    disabled={isLoading()}
                    className={`w-full py-2 rounded-md text-white transition ${
                        isLoading()
                            ? "bg-blue-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    }`}
                >
                    {isLoading() ? "등록중..." : "문의 등록"}
                </button>

                <p className="text-sm text-gray-500 mt-2">
                    문의하신 내용과 답변은 마이페이지 → 1:1 문의 내역에서 확인 가능합니다.
                </p>
            </div>
        </div>
    );
}

export default InquiryModal;