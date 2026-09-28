// 지연 로딩(React.lazy) 페이지를 불러오는 동안 표시하는 공통 로딩 화면
function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center gap-4 py-32" role="status" aria-label="페이지 불러오는 중">
            <div className="w-12 h-12 border-4 border-honey-yellow/20 border-t-honey-yellow rounded-full animate-spin" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading</p>
        </div>
    );
}

export default PageLoader;
