import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";
import { FaCheckCircle, FaTimesCircle, FaEnvelope } from "react-icons/fa";
import Card from "@/components/ui/Card.jsx";

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
        <div className="max-w-md mx-auto px-4 py-20">
            <Card className="text-center" padding="p-8 sm:p-10" role="status" aria-live="polite">
                {/* 애니메이션 아이콘 */}
                <div className={`mx-auto mb-5 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${
                    result === "success" ? "bg-leaf-green/10 text-leaf-green" :
                        result === "error" ? "bg-red-50 text-red-400" :
                            "bg-honey-yellow/10 text-honey-yellow-dark"
                }`}>
                    {result === "success" && <FaCheckCircle className="animate-bounce" />}
                    {result === "error" && <FaTimesCircle className="animate-pulse" />}
                    {result === null && <FaEnvelope />}
                </div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Email Verification</p>
                <h2 className="text-2xl font-black text-deep-gray mb-3">이메일 변경 인증</h2>
                <p className="text-sm font-bold text-gray-500">{status}</p>
            </Card>
        </div>
    );
}
