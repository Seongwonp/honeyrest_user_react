import React, { useState } from "react";
import useApiRequest from "@/api/useApiRequest";
import Dialog from "@/components/ui/Dialog.jsx";
import Input from "@/components/ui/Input.jsx";
import Button from "@/components/ui/Button.jsx";

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
        <Dialog onClose={onClose} title="비밀번호 확인" className="max-w-sm" closeOnBackdrop>
            <Input
                label="현재 비밀번호"
                type="password"
                placeholder="현재 비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleVerify();
                }}
                autoComplete="current-password"
            />
            <div className="flex justify-end gap-2 mt-6">
                <Button variant="secondary" onClick={onClose}>
                    취소
                </Button>
                <Button onClick={handleVerify} disabled={isLoading("verifyPassword")}>
                    확인
                </Button>
            </div>
        </Dialog>
    );
}
