//  react-router-dom 기반으로 수정
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/api/axios";

export default function VerifyEmailChange() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState("처리 중...");

    useEffect(() => {
        if (!token) return;

        axios.post("/api/user/email/verify-change", null, {
            params: { token }
        })
            .then(() => {
                setStatus("✅ 이메일 변경이 완료되었습니다.");
            })
            .catch(() => {
                setStatus("❌ 이메일 변경에 실패했습니다.");
            });
    }, [token]);

    return (
        <div className="max-w-md mx-auto py-20 text-center">
            <h2 className="text-xl font-bold mb-4">🔐 이메일 변경 인증</h2>
            <p>{status}</p>
        </div>
    );
}