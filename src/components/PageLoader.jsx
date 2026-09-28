// 지연 로딩(React.lazy) 페이지를 불러오는 동안 표시하는 공통 로딩 화면
function PageLoader() {
    return (
        <div className="flex items-center justify-center py-32" role="status" aria-label="페이지 불러오는 중">
            <div className="w-10 h-10 border-4 border-honey-yellow/30 border-t-honey-yellow rounded-full animate-spin" />
        </div>
    );
}

export default PageLoader;
