import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import api from '@/api/axios';
import Header from "../../components/Header.jsx";
import { FaEnvelopeOpenText, FaPaperPlane } from "react-icons/fa";
import StatusPanel from "@/components/ui/StatusPanel.jsx";
import Button from "@/components/ui/Button.jsx";

function VerifyEmail() {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || localStorage.getItem('signupEmail');
    const [resendStatus, setResendStatus] = useState(null);

    const handleResend = () => {
        if (!email) {
            setResendStatus("이메일 정보가 없습니다.");
            return;
        }

        api.post('/api/user/email/resend', { email })
            .then(() => setResendStatus("인증 메일이 다시 전송되었습니다."))
            .catch(() => setResendStatus("재전송 중 오류가 발생했습니다."));
    };

    return (
        <>
            <Header />
            <StatusPanel
                icon={<FaEnvelopeOpenText />}
                eyebrow="Email Verification"
                title="이메일 인증을 완료해 주세요"
                message={"가입하신 이메일 주소로 인증 메일을 보냈습니다.\n메일함을 확인하고 인증을 완료해 주세요."}
                actions={
                    <>
                        <Button onClick={handleResend}>
                            <FaPaperPlane />
                            인증 메일 다시 보내기
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/login")}>
                            로그인 페이지로 이동
                        </Button>
                    </>
                }
            >
                {email && (
                    <p className="mt-4 text-sm font-black text-deep-gray bg-off-white rounded-2xl px-4 py-3 break-all">{email}</p>
                )}
                {resendStatus && (
                    <p role="status" className="mt-4 text-sm font-bold text-gray-500">{resendStatus}</p>
                )}
            </StatusPanel>
        </>
    );
}

export default VerifyEmail;
