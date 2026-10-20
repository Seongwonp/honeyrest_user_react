import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HiXCircle } from "react-icons/hi";
import api from "@/api/axios";
import { getAccessToken } from "@/auth/authStorage";
import StatusPanel from "@/components/ui/StatusPanel.jsx";
import Button from "@/components/ui/Button.jsx";

const CONFIRM_KEY_PREFIX = "paymentConfirm:";

// 재마운트(StrictMode 등)돼도 같은 주문의 승인 요청을 공유
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
        // 무시 (현재 화면 중복 요청은 ref 로 막음)
    }
};

const readReservationDraft = () => {
    try {
        return JSON.parse(sessionStorage.getItem("reservationInfo"));
    } catch {
        return null;
    }
};

const hasAccessToken = () => !!getAccessToken();

const extractErrorMessage = (err) => {
    const data = err?.response?.data;
    if (typeof data === "string" && data.trim()) return data;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    return "결제 승인 중 문제가 발생했습니다. 고객센터에 문의해주세요.";
};

// 서버 응답 결과를 저장해 새로고침·뒤로가기 때 승인 API 를 다시 부르지 않는다
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
            // 승인이 확정된 뒤에만 임시 예약 정보를 지운다
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
            // 응답이 있을 때만 저장 (네트워크 오류는 결과를 알 수 없음)
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

    // 페이지를 떠난 뒤에는 이동/상태 변경을 하지 않기 위한 마운트 여부
    const mountedRef = useRef(false);
    useEffect(() => {
        mountedRef.current = true;
        return () => { mountedRef.current = false; };
    }, []);

    useEffect(() => {
        if (requestedRef.current) return;
        requestedRef.current = true;

        const finish = (next) => {
            if (!mountedRef.current) return;
            if (next.ok) {
                // replace 로 이동해 뒤로가기로 돌아오지 않게
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
