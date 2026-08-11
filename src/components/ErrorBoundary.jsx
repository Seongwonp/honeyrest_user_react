import { Component } from "react";

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
                <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        예기치 못한 오류가 발생했습니다
                    </h1>
                    <p className="text-gray-500 mb-6">
                        페이지를 새로고침하거나 홈으로 돌아가 다시 시도해 주세요.
                    </p>
                    <button
                        onClick={this.handleReload}
                        className="px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded transition"
                    >
                        홈으로 돌아가기
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
