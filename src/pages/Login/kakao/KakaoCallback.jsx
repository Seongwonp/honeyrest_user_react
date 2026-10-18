import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { SWAL_CONFIRM_OPTIONS } from "@/config/swal";
import useApiRequest from "/src/api/useApiRequest";
import { useAuth } from "@/hooks/useAuth";
import { PROVIDERS } from "@/auth/provider";

function KakaoCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);
    const { request, isLoading } = useApiRequest();
    const { login } = useAuth();

    useEffect(() => {
        const code = searchParams.get("code");
        const autoLogin = searchParams.get("autoLogin") === "true";

        if (!code || calledRef.current) return;
        calledRef.current = true;

        request(
            {
                method: "GET",
                url: `/api/auth/kakao/callback?code=${code}`,
            },
            {
                label: 'kakao',
                // 실패 안내는 아래 onError 의 Swal 로 하므로 공통 토스트는 끈다
                silent: true,
                onSuccess: (res) => {
                    const { accessToken, user } = res;
                    // 저장(자동 로그인 여부에 따른 저장소 선택)과 공유 상태 반영은 AuthContext.login 이 담당
                    login({ token: accessToken, user: { ...user, provider: PROVIDERS.KAKAO }, autoLogin });

                    Swal.fire({
                        title: `${user.name}님 환영합니다!`,
                        text: "HoneyRest에 오신 것을 환영해요 🍯",
                        icon: "success",
                        confirmButtonText: "확인",
                        ...SWAL_CONFIRM_OPTIONS,
                    }).then(() => {
                        navigate("/", { replace: true });
                    });
                },
                onError: () => {
                    Swal.fire({ ...SWAL_CONFIRM_OPTIONS, title: "로그인 실패", text: "카카오 로그인 중 오류가 발생했습니다.", icon: "error" });
                    navigate("/login");
                },
            }
        ).catch(() => {
            // 실패 처리는 onError 에서 완료됨
        });
    }, [searchParams, navigate, request, login]);

    return (
        <div className="text-center mt-20 text-gray-600">
            {isLoading('kakao') ? "로그인 처리 중입니다..." : "카카오 로그인 처리 중입니다..."}
        </div>
    );
}

export default KakaoCallback;