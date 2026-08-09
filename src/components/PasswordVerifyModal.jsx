import React, { useState } from "react";
import useApiRequest from "@/api/useApiRequest";

export default function PasswordVerifyModal({ onSuccess, onClose }) {
    const [password, setPassword] = useState("");
    const { request, isLoading } = useApiRequest();

    const handleVerify = async () => {
        try {
            await request(
                {
                    method: "POST",
                    url: "/api/auth/verify-password",
                    data: { password }
                },
                {
                    label: "verifyPassword",
                    successMessage: "인증되었습니다!",
                    errorMessage: "비밀번호가 일치하지 않습니다.",
                    skipRedirect: true, // 🔥 리다이렉트 막기
                    onSuccess: () => {
                        onSuccess(true);
                        onClose();
                    }
                }
            );
        } catch (err) {
            console.error("비밀번호 인증 실패:", err);
        }
    };

    return (
        <div className="fixed inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white dark:bg-muted p-6 rounded-lg shadow-xl w-full max-w-sm border border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">비밀번호 확인</h3>
                <input
                    type="password"
                    placeholder="현재 비밀번호 입력"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleVerify();
                    }}
                    className="w-full border border-input bg-background px-4 py-2 rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-md text-sm font-medium bg-red-400 text-white hover:bg-red-700">
                        취소
                    </button>
                    <button
                        onClick={handleVerify}
                        disabled={isLoading("verifyPassword")}
                        className={`px-4 py-2 rounded-md text-sm font-semibold ${
                            isLoading("verifyPassword")
                                ? "bg-muted text-muted-foreground cursor-not-allowed"
                                : "bg-yellow-400 text-white hover:bg-yellow-600"
                        }`}
                    >
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
