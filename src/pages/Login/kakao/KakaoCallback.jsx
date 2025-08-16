// src/pages/KakaoCallback.jsx
import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);

    useEffect(() => {
        const code = searchParams.get("code");
        if (!code || calledRef.current) return;

        calledRef.current = true;

        const fetchToken = async () => {
            try {
                const res = await axios.get(`/api/auth/kakao/callback?code=${code}`);
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
                console.error("카카오 로그인 실패", err);
                Swal.fire("로그인 실패", "카카오 로그인 중 오류가 발생했습니다.", "error");
                navigate("/login");
            }
        };

        fetchToken();
    }, [searchParams, navigate]);

    return <div className="text-center mt-20 text-gray-600">카카오 로그인 처리 중입니다...</div>;
}

export default KakaoCallback;