// 목록 로딩 스켈레톤
function ListSkeleton({ rows = 3, height = "h-28", className = "" }) {
    return (
        <div className={`space-y-4 ${className}`} role="status" aria-live="polite" aria-label="목록을 불러오는 중">
            {Array.from({ length: rows }, (_, i) => (
                <div key={i} className={`w-full ${height} bg-gray-100 animate-pulse rounded-[2rem]`} />
            ))}
            <span className="sr-only">불러오는 중...</span>
        </div>
    );
}

export default ListSkeleton;
