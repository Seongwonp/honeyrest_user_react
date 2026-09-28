import { HiExclamationCircle } from "react-icons/hi";
import Button from "./Button";
import { cardClass } from "./styles";

// 목록 조회 실패 상태 (다시 시도 버튼 포함)
function ErrorState({
    title = "정보를 불러오지 못했습니다.",
    description = "잠시 후 다시 시도해 주세요.",
    onRetry,
    className = "",
}) {
    return (
        <div role="alert" className={`${cardClass} text-center py-16 px-6 ${className}`}>
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center text-2xl">
                <HiExclamationCircle />
            </div>
            <h3 className="text-lg font-black text-deep-gray mb-1 break-keep">{title}</h3>
            {description && <p className="text-sm text-gray-400 break-keep">{description}</p>}
            {onRetry && (
                <div className="mt-6 flex justify-center">
                    <Button variant="secondary" onClick={onRetry}>
                        다시 시도
                    </Button>
                </div>
            )}
        </div>
    );
}

export default ErrorState;
