// 공통 디자인 토큰 기반 클래스 문자열
// (Link, select, textarea 등 ui 컴포넌트로 감싸기 어려운 요소에서 재사용)

// 카드 컨테이너
export const cardClass = "bg-white rounded-[2rem] border border-gray-100 shadow-sm";

// 버튼 공통
const buttonBase =
    "inline-flex items-center justify-center gap-2 rounded-2xl font-black transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 focus-visible:outline-none focus-visible:ring-4";

export const buttonVariants = {
    primary: `${buttonBase} bg-honey-yellow text-deep-gray shadow-lg shadow-honey-yellow/20 hover:bg-honey-yellow-dark focus-visible:ring-honey-yellow/40`,
    secondary: `${buttonBase} bg-white text-deep-gray border border-gray-200 hover:border-honey-yellow hover:text-honey-yellow-dark focus-visible:ring-honey-yellow/30`,
    success: `${buttonBase} bg-leaf-green text-white shadow-lg shadow-leaf-green/20 hover:bg-leaf-green-dark focus-visible:ring-leaf-green/40`,
    dark: `${buttonBase} bg-deep-gray text-white hover:bg-black focus-visible:ring-deep-gray/30`,
    danger: `${buttonBase} bg-white text-red-500 border border-red-100 hover:bg-red-50 focus-visible:ring-red-200`,
    dangerSolid: `${buttonBase} bg-red-500 text-white shadow-lg shadow-red-500/20 hover:bg-red-600 focus-visible:ring-red-200`,
    ghost: `${buttonBase} text-gray-400 hover:text-deep-gray hover:bg-gray-50 focus-visible:ring-gray-200`,
};

export const buttonSizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
};

// 입력 필드
export const inputClass =
    "w-full min-w-0 bg-gray-50 border border-gray-100 rounded-2xl px-4 py-3 text-sm font-medium text-deep-gray placeholder:text-gray-300 outline-none transition-all focus:bg-white focus:border-honey-yellow focus:ring-4 focus:ring-honey-yellow/20 disabled:opacity-60 disabled:cursor-not-allowed";

// 입력 라벨 / 작은 대문자 라벨(eyebrow)
export const labelClass = "block text-xs font-bold text-gray-500 mb-2";
export const eyebrowClass = "text-[10px] font-bold text-gray-400 uppercase tracking-widest";

// 상태 배지
export const badgeClass = "inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black";
