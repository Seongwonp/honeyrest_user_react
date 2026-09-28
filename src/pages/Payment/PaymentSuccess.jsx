import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiXCircle } from "react-icons/hi";
import api from "@/api/axios";
import StatusPanel from "@/components/ui/StatusPanel.jsx";
import Button from "@/components/ui/Button.jsx";

// 결제 승인 결과를 저장하는 sessionStorage 키 접두사
const CONFIRM_KEY_PREFIX = "paymentConfirm:";

// 같은 탭 안에서 컴포넌트가 다시 마운트되더라도(StrictMode 이중 실행 등)
// 동일 주문에 대해 진행 중인 승인 요청을 공유하기 위한 모듈 단위 캐시
const inFlightConfirms = new Map();

const readStored = (key) => {
    try {
        const raw = sessionStorage.getItem(key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeStored = (key, value) => {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
        // 저장 실패는 무시 (ref 가드로 현재 화면의 중복 요청은 이미 막고 있음)
    }
};

const readReservationDraft = () => {
    try {
        return JSON.parse(sessionStorage.getItem("reservationInfo"));
    } catch {
        return null;
    }
};

const hasAccessToken = () =>
    !!(localStorage.getItem("accessToken") || sessionStorage.getItem("accessToken"));

// 서버 에러 응답(ApiResponse: { success, message, data })에서 사용자에게 보여줄 메시지를 꺼낸다.
const extractErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return "결제 승인 중 문제가 발생했습니다. 고객센터에 문의해주세요.";
};

// 실제 승인 요청. 서버가 응답한 결과(성공/실패)는 sessionStorage에 저장해
// 새로고침·뒤로가기로 다시 들어와도 승인 API를 재호출하지 않는다.
const confirmOnce = (storageKey, body, isMember) => {
    if (inFlightConfirms.has(storageKey)) {
        return inFlightConfirms.get(storageKey);
    }

    const promise = api
        .post("/api/payment/toss/confirm", body, { skipRedirect: true })
        .then((response) => {
            const result = response.data;
            if (result?.status === "FAILED") {
                const outcome = {
                    ok: false,
                    isMember,
                    message: result.raw?.message || "결제 승인에 실패했습니다.",
                };
                writeStored(storageKey, outcome);
                return outcome;
            }
            const outcome = { ok: true, isMember, result };
            writeStored(storageKey, outcome);
            // 승인이 확정된 뒤에만 예약 임시 정보를 지운다.
            sessionStorage.removeItem("reservationInfo");
            return outcome;
        })
        .catch((err) => {
            console.error("결제 승인 실패:", err);
            const outcome = {
                ok: false,
                isMember,
                httpStatus: err?.response?.status ?? null,
                message: extractErrorMessage(err),
            };
            // 서버가 응답한 경우(409 매진, 5xx 결제 취소 등)만 결과를 저장한다.
            // 네트워크 오류처럼 응답이 없으면 결과를 알 수 없으므로 저장하지 않는다.
            if (err?.response) {
                writeStored(storageKey, outcome);
            }
            return outcome;
        })
        .finally(() => {
            inFlightConfirms.delete(storageKey);
        });

    inFlightConfirms.set(storageKey, promise);
    return promise;
};

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [outcome, setOutcome] = useState(null);
    const requestedRef = useRef(false);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    // 마운트 여부 추적: StrictMode의 가상 언마운트→재마운트 이후에도 결과를 반영하고,
    // 사용자가 페이지를 떠난 뒤에는 이동/상태 변경을 하지 않기 위함
    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        // StrictMode 이중 실행 / 재렌더링 시 중복 호출 방지
        if (requestedRef.current) return;
        requestedRef.current = true;

        const finish = (next) => {
            if (!mountedRef.current) return;
            if (next.ok) {
                // 완료 페이지로 교체 이동해 뒤로가기로 이 페이지에 다시 머무르지 않게 한다.
                navigate("/reservation/complete", { state: next.result, replace: true });
                return;
            }
            setOutcome(next);
        };

        if (!paymentKey || !orderId || !amount) {
            finish({ ok: false, isMember: hasAccessToken(), message: "결제 정보가 누락되었습니다." });
            return;
        }

        const storageKey = `${CONFIRM_KEY_PREFIX}${orderId}:${paymentKey}`;

        // 이미 처리된 결과가 있으면 재호출하지 않고 그대로 보여준다.
        const stored = readStored(storageKey);
        if (stored) {
            finish(stored);
            return;
        }

        const reservationInfo = readReservationDraft();
        if (!reservationInfo) {
            finish({ ok: false, isMember: hasAccessToken(), message: "예약 정보가 누락되었습니다. 예약 내역을 확인해주세요." });
            return;
        }

        const isMember = !!reservationInfo.userId || hasAccessToken();
        const body = {
            paymentKey,
            orderId,
            amount,
            reservationInfo: { ...reservationInfo, reservationCode: orderId },
        };

        confirmOnce(storageKey, body, isMember).then(finish);
        // 최초 마운트 시 한 번만 실행한다 (ref로 재실행 차단)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (outcome && !outcome.ok) {
        const reservationsPath = outcome.isMember ? "/user/mypage/reservations" : "/reservation/lookup";
        return (
            <StatusPanel
                role="alert"
                icon={<HiXCircle />}
                tone="red"
                eyebrow="Payment Failed"
                title="결제 승인에 실패했습니다"
                message={outcome.message}
                actions={
                    <>
                        <Button onClick={() => navigate(reservationsPath, { replace: true })}>
                            예약 내역으로
                        </Button>
                        <Button variant="secondary" onClick={() => navigate("/", { replace: true })}>
                            홈으로
                        </Button>
                    </>
                }
            >
                {outcome.httpStatus && (
                    <p className="mt-3 text-xs font-bold text-gray-300">오류 코드: {outcome.httpStatus}</p>
                )}
            </StatusPanel>
        );
    }

    return (
        <StatusPanel
            role="status"
            icon={<div className="w-10 h-10 border-4 border-honey-yellow/20 border-t-honey-yellow rounded-full animate-spin" />}
            eyebrow="Processing"
            title="결제 승인 중입니다..."
            message="잠시만 기다려주세요. 예약 정보를 확인하고 있습니다."
        />
    );
}
