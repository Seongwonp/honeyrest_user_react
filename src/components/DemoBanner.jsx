import { useState } from "react";
import { HiX } from "react-icons/hi";
import { ADMIN_URL } from "@/config/urls";

// 데모 안내 배너 (VITE_DEMO 빌드에서만). 닫으면 이번 탭에서는 다시 안 보인다
const DISMISS_KEY = "honeyrest:demo-banner-dismissed";

const readDismissed = () => {
    try {
        return sessionStorage.getItem(DISMISS_KEY) === "1";
    } catch {
        return false;
    }
};

export default function DemoBanner() {
    const [dismissed, setDismissed] = useState(readDismissed);

    if (dismissed) return null;

    const dismiss = () => {
        try {
            sessionStorage.setItem(DISMISS_KEY, "1");
        } catch {
            // 저장 실패는 무시
        }
        setDismissed(true);
    };

    return (
        <div
            role="status"
            data-testid="demo-banner"
            className="relative z-[101] bg-deep-gray text-white text-xs sm:text-sm"
        >
            <div className="max-w-6xl mx-auto px-4 py-2 pr-10 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center">
                <span className="font-bold">
                    데모 환경입니다 · 결제는 실제로 청구되지 않으며 데이터는 주기적으로 초기화됩니다
                </span>
                {ADMIN_URL && (
                    <a
                        href={`${ADMIN_URL}/auth/login`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-black text-honey-yellow underline underline-offset-4 whitespace-nowrap"
                    >
                        관리자 데모 열기
                    </a>
                )}
            </div>
            <button
                type="button"
                onClick={dismiss}
                aria-label="데모 안내 닫기"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/60"
            >
                <HiX />
            </button>
        </div>
    );
}
