import React, { useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import api from '@/api/axios';
import Header from "../../components/Header.jsx";
import { FaEnvelopeOpenText } from "react-icons/fa";

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
            <div className="bg-white h-screen flex flex-col items-center justify-center px-4">
                <div className="bg-white border border-gray-200 rounded-lg shadow-md p-8 w-full max-w-md text-center" data-aos="fade-up">
                    <div className="flex justify-center mb-4 text-yellow-500 text-4xl">
                        <FaEnvelopeOpenText />
                    </div>

                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                        이메일 인증을 완료해 주세요 📧
                    </h2>

                    <p className="text-sm text-gray-600 mb-6">
                        가입하신 이메일 주소로 인증 메일을 보냈습니다.<br />
                        메일함을 확인하고 인증을 완료해 주세요.
                    </p>

                    <button
                        onClick={handleResend}
                        className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg mb-2"
                    >
                        인증 메일 다시 보내기
                    </button>

                    {resendStatus && (
                        <p className="text-sm text-gray-700 mt-2">{resendStatus}</p>
                    )}

                    <button
                        onClick={() => navigate("/login")}
                        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 rounded-lg mt-4"
                    >
                        로그인 페이지로 이동
                    </button>
                </div>
            </div>
        </>
    );
}

export default VerifyEmail;