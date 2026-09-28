import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { SWAL_CONFIRM_OPTIONS } from "@/config/swal";
import useApiRequest from "/src/api/useApiRequest";
import { useAuth } from "@/hooks/useAuth";

function GoogleCallback() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const calledRef = useRef(false);
    const { request, isLoading } = useApiRequest();
    const { loadUser } = useAuth();

    useEffect(() => {
        const code = searchParams.get("code");
        const autoLogin = searchParams.get("autoLogin") === "true";

        if (!code || calledRef.current) return;
        calledRef.current = true;

        request(
            {
                method: "GET",
                url: `/api/auth/google/callback?code=${code}`,
            },
            {
                label: 'google',
                errorMessage: '구글 로그인 실패!',
                onSuccess: (res) => {
                    const { accessToken, user } = res;
                    const userWithProvider = { ...user, provider: 'google' };
                    const storage = autoLogin ? localStorage : sessionStorage;

                    storage.setItem("accessToken", accessToken);
                    storage.setItem("userInfo", JSON.stringify(userWithProvider));
                    // 같은 탭의 Header 등에 로그인 상태를 즉시 반영
                    loadUser();

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
                    Swal.fire({ ...SWAL_CONFIRM_OPTIONS, title: "로그인 실패", text: "구글 로그인 중 오류가 발생했습니다.", icon: "error" });
                    navigate("/login");
                },
            }
        );
    }, [searchParams, navigate, request, loadUser]);

    return (
        <div className="h-screen flex items-center justify-center bg-white">
            <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {isLoading('google') ? "로그인 처리 중입니다..." : "구글 로그인 처리 중입니다..."}
                </h2>
                <p className="text-sm text-gray-500">
                    잠시만 기다려주세요 🍃
                </p>
            </div>
        </div>
    );
}

export default GoogleCallback;