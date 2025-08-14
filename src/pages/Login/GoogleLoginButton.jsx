import { FaGoogle } from "react-icons/fa";

function GoogleLoginButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition"
        >
            <FaGoogle />
            구글로 로그인
        </button>
    );
}

export default GoogleLoginButton;