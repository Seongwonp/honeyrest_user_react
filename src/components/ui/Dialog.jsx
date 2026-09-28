import { useEffect, useId, useRef } from "react";
import { motion } from "framer-motion";
import { HiX } from "react-icons/hi";

const FOCUSABLE =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

// 접근성 대화상자 래퍼
// - role="dialog" + aria-modal, 제목과 aria-labelledby 연결
// - Escape 로 닫기, 열릴 때 대화상자에 초기 포커스, 닫힐 때 이전 포커스 복원
// - Tab 이동을 대화상자 내부로 제한
function Dialog({
    onClose,
    title,
    titleId,
    children,
    className = "max-w-lg",
    closeOnBackdrop = false,
    showBackdrop = true,
    showClose = true,
}) {
    const panelRef = useRef(null);
    const onCloseRef = useRef(onClose);
    const autoId = useId();
    const labelId = titleId || (title ? `${autoId}-title` : undefined);

    // 최신 onClose 참조 유지 (리스너 재등록 방지)
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const previouslyFocused = document.activeElement;
        panelRef.current?.focus();

        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                e.stopPropagation();
                onCloseRef.current?.();
                return;
            }
            if (e.key !== "Tab" || !panelRef.current) return;
            const nodes = panelRef.current.querySelectorAll(FOCUSABLE);
            if (nodes.length === 0) {
                e.preventDefault();
                return;
            }
            const first = nodes[0];
            const last = nodes[nodes.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement === panelRef.current)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            if (previouslyFocused && typeof previouslyFocused.focus === "function") {
                previouslyFocused.focus();
            }
        };
    }, []);

    return (
        <motion.div
            className={`fixed inset-0 z-[130] flex items-center justify-center p-4 ${showBackdrop ? "bg-deep-gray/40 backdrop-blur-sm" : ""}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onMouseDown={(e) => {
                if (closeOnBackdrop && e.target === e.currentTarget) onClose?.();
            }}
        >
            <motion.div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={labelId}
                tabIndex={-1}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                transition={{ duration: 0.25 }}
                className={`relative w-full max-h-[90vh] overflow-y-auto bg-white rounded-[2rem] shadow-2xl p-6 sm:p-8 outline-none ${className}`}
            >
                {showClose && onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="닫기"
                        className="absolute top-5 right-5 w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-deep-gray transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30"
                    >
                        <HiX size={18} />
                    </button>
                )}
                {title && (
                    <h2 id={labelId} className="text-xl font-black text-deep-gray mb-5 pr-8 break-keep">
                        {title}
                    </h2>
                )}
                {children}
            </motion.div>
        </motion.div>
    );
}

export default Dialog;
