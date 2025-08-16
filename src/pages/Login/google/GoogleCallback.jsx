// src/pages/google/GoogleCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code || calledRef.current) return;

        calledRef.current = true;

        const fetchToken = async () => {
            try {
                const res = await axios.get(`/api/auth/google/callback?code=${code}`);
                const { accessToken, user } = res.data;

                localStorage.setItem("accessToken", accessToken);
                localStorage.setItem("userInfo", JSON.stringify(user));

                Swal.fire({
                    title: `${user.name}님 환영합니다!`,
                    text: "HoneyRest에 오신 것을 환영해요 🍯",
                    icon: "success",
                    confirmButtonText: "확인",
                    confirmButtonColor: "#FDD835",
                }).then(() => {
                    navigate("/", { replace: true });
                });
            } catch (err) {
                console.error("구글 로그인 실패", err);
                Swal.fire("로그인 실패", "구글 로그인 중 오류가 발생했습니다.", "error");
                navigate("/login");
            }
        };

        fetchToken();
    }, [searchParams, navigate]);

    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    구글 로그인 처리 중입니다...
                </h2>
                <p className="text-sm text-gray-500">
                    잠시만 기다려주세요 🍃
                </p>
            </div>
        </div>
    );
}

export default GoogleCallback;