import React, { useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";
import useApiRequest from "@/api/useApiRequest";
import { toast } from "react-toastify";
import Dialog from "@/components/ui/Dialog.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";
import { inputClass, labelClass } from "@/components/ui/styles";

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
            toast.info("문의 등록은 로그인 후에 가능합니다.");
            return;
        }
        if (
            !title.trim() ||
            !content.trim() ||
            content.trim() ===
            "[문의 내용 작성 예시]\n1. 예약자 이름:\n2. 예약 날짜:\n3. 문의 내용:"
        ) {
            toast.error("제목과 내용을 모두 입력해주세요!");
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
        <Dialog
            onClose={onClose}
            className="max-w-xl"
            title={
                <span className="flex items-center gap-2">
                    <FaQuestionCircle className="text-honey-yellow-dark" /> 1:1 문의
                </span>
            }
        >
            <div className="space-y-4">
                <div>
                    <label htmlFor="inquiry-category" className={labelClass}>카테고리</label>
                    <select
                        id="inquiry-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={inputClass}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <Input
                    label="제목"
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <div>
                    <label htmlFor="inquiry-content" className={labelClass}>내용</label>
                    <textarea
                        id="inquiry-content"
                        placeholder="[문의 내용 작성 예시]\n1. 예약자 이름:\n2. 예약 날짜:\n3. 문의 내용:"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className={`${inputClass} h-48 resize-none overflow-y-auto`}
                    />
                </div>

                <Button
                    onClick={handleSubmit}
                    disabled={isLoading()}
                    size="lg"
                    fullWidth
                >
                    {isLoading() ? "등록중..." : "문의 등록"}
                </Button>

                <p className="text-xs text-gray-400 break-keep">
                    문의하신 내용과 답변은 마이페이지 → 1:1 문의 내역에서 확인 가능합니다.
                </p>
            </div>
        </Dialog>
    );
}

export default InquiryModal;
