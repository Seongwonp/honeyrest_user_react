import { Component } from "react";
import { HiExclamationCircle } from "react-icons/hi";
import Button from "@/components/ui/Button.jsx";

// 렌더링 중 처리되지 않은 예외가 발생하면(예: location.state 누락, 예기치 못한 undefined 접근)
// 앱 전체가 백지 화면으로 남는 문제(P0-1)를 막기 위한 최후의 안전망.
export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("[ErrorBoundary] 처리되지 않은 오류:", error, errorInfo);
    }

    handleReload = () => {
        this.setState({ hasError: false });
        window.location.href = "/";
    };

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" className="min-h-screen bg-off-white flex items-center justify-center px-4 py-16">
                    <div className="w-full max-w-md bg-white rounded-[2rem] border border-gray-100 shadow-sm p-8 sm:p-10 text-center">
                        <div className="mx-auto mb-5 w-16 h-16 rounded-2xl bg-red-50 text-red-400 flex items-center justify-center text-3xl">
                            <HiExclamationCircle />
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Unexpected Error</p>
                        <h1 className="text-2xl font-black text-deep-gray mb-2 break-keep">
                            예기치 못한 오류가 발생했습니다
                        </h1>
                        <p className="text-sm text-gray-400 mb-8 break-keep">
                            페이지를 새로고침하거나 홈으로 돌아가 다시 시도해 주세요.
                        </p>
                        <Button onClick={this.handleReload} size="lg" fullWidth>
                            홈으로 돌아가기
                        </Button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
