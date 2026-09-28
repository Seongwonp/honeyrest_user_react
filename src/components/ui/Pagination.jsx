import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

// 공통 페이지네이션 (page 는 0부터 시작)
// 페이지 수가 많으면 현재 페이지 주변 최대 5개 번호만 노출
function Pagination({ page, totalPages, onChange, className = "" }) {
    if (!totalPages || totalPages <= 1) return null;

    const windowSize = 5;
    let start = Math.max(0, page - Math.floor(windowSize / 2));
    const end = Math.min(totalPages, start + windowSize);
    start = Math.max(0, end - windowSize);
    const pages = Array.from({ length: end - start }, (_, i) => start + i);

    const arrowClass =
        "w-10 h-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:shadow-lg hover:text-deep-gray disabled:opacity-20 disabled:hover:shadow-none transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-leaf-green/30";

    return (
        <nav aria-label="페이지 이동" className={`flex justify-center items-center gap-2 sm:gap-4 pt-8 ${className}`}>
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page === 0}
                className={arrowClass}
                aria-label="이전 페이지"
            >
                <HiChevronLeft />
            </button>
            <div className="flex gap-1.5 sm:gap-2">
                {pages.map((i) => (
                    <button
                        type="button"
                        key={i}
                        onClick={() => onChange(i)}
                        aria-current={i === page ? "page" : undefined}
                        className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-sm font-black transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-leaf-green/30 ${
                            i === page
                                ? "bg-leaf-green text-white shadow-lg shadow-leaf-green/20"
                                : "bg-white text-gray-400 border border-gray-100 hover:border-leaf-green/30"
                        }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page + 1 >= totalPages}
                className={arrowClass}
                aria-label="다음 페이지"
            >
                <HiChevronRight />
            </button>
        </nav>
    );
}

export default Pagination;
