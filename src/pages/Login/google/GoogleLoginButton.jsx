function GoogleLoginButton({ onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 bg-white border border-[#DADCE0] hover:bg-gray-100 text-gray-800 font-bold text-sm py-3 rounded-2xl transition-all active:scale-95 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gray-200"
            style={{ fontFamily: 'Roboto, sans-serif' }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 48 48"
            >
                <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.7 1.23 9.2 3.25l6.85-6.85C35.3 2.6 29.95 0 24 0 14.95 0 7.1 5.8 3.4 14.1l8.1 6.3C13.2 13.1 18.2 9.5 24 9.5z"
                />
                <path
                    fill="#4285F4"
                    d="M46.1 24.5c0-1.6-.15-3.15-.45-4.65H24v9.1h12.5c-.55 2.95-2.2 5.45-4.7 7.15l7.3 5.65c4.25-3.9 6.7-9.65 6.7-17.25z"
                />
                <path
                    fill="#FBBC05"
                    d="M11.5 28.4c-.6-1.8-.95-3.7-.95-5.65s.35-3.85.95-5.65l-8.1-6.3C1.3 14.9 0 19.3 0 24s1.3 9.1 3.4 12.9l8.1-6.3z"
                />
                <path
                    fill="#34A853"
                    d="M24 48c6.5 0 11.95-2.15 15.9-5.85l-7.3-5.65c-2.05 1.4-4.7 2.2-8.6 2.2-5.8 0-10.8-3.6-12.9-8.7l-8.1 6.3C7.1 42.2 14.95 48 24 48z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Google로 로그인
        </button>
    );
}

export default GoogleLoginButton;