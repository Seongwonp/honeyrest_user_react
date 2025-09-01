import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function VerifyEmailChange() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const newEmail = searchParams.get("newEmail");

    const [status, setStatus] = useState("처리 중...");
    const [result, setResult] = useState(null); // 'success' | 'error' | null

    useEffect(() => {
        if (!token || !newEmail) return;

        axios.post("/api/user/email/verify-change", null, {
            params: { token, newEmail }
        })
            .then(() => {
                setStatus("✅ 이메일 변경이 완료되었습니다.");
                setResult("success");
            })
            .catch(() => {
                setStatus("❌ 이메일 변경에 실패했습니다.");
                setResult("error");
            });
    }, [token, newEmail]);

    return (
        <div className="relative max-w-md mx-auto py-20 text-center">
            {/* 애니메이션 아이콘 */}
            {result === "success" && (
                <FaCheckCircle className="absolute top-10 left-1/2 transform -translate-x-1/2 text-green-500 animate-bounce text-5xl" />
            )}
            {result === "error" && (
                <FaTimesCircle className="absolute top-10 left-1/2 transform -translate-x-1/2 text-red-500 animate-pulse text-5xl" />
            )}

            <h2 className="text-xl font-bold mb-4">🔐 이메일 변경 인증</h2>
            <p className="text-lg">{status}</p>
        </div>
    );
}