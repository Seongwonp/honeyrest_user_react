import { HiChatBubbleLeftRight } from "react-icons/hi2";

function KakaoLoginButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-yellow-300 text-black font-medium py-2 rounded-lg transition"
        >
            <HiChatBubbleLeftRight className="text-2xl text-[#3C1E1E]" />
            카카오 로그인
        </button>
    );
}

export default KakaoLoginButton;