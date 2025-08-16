
function KakaoLoginButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 bg-[#FEE500] hover:bg-[#FFD600] text-black font-bold py-2 rounded-lg transition"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="#3C1E1E"
            >
                <path d="M12 3C6.48 3 2 6.86 2 11.5c0 2.63 1.57 4.96 4.02 6.45-.17.61-.92 3.26-.95 3.45 0 .14.06.27.17.36.11.09.25.14.39.14.1 0 .2-.02.29-.07.03-.01 3.28-1.91 4.62-2.7.78.14 1.59.21 2.46.21 5.52 0 10-3.86 10-8.5S17.52 3 12 3z" />
            </svg>
            카카오 로그인
        </button>
    );
}

export default KakaoLoginButton;