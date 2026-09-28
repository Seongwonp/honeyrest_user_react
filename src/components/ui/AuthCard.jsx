import { motion } from "framer-motion";
import { eyebrowClass } from "./styles";

// 로그인 / 회원가입 / 비밀번호 재설정 등 인증 화면 공통 카드 레이아웃
function AuthCard({ logo, eyebrow, title, description, children, maxWidth = "max-w-md" }) {
    return (
        <div className="min-h-screen bg-off-white flex items-center justify-center px-4 py-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-honey-yellow/5 w-full ${maxWidth} p-6 sm:p-10`}
            >
                <div className="text-center mb-8">
                    {logo && (
                        <div className="mx-auto mb-4 w-16 h-16 rounded-2xl bg-honey-yellow/10 flex items-center justify-center">
                            <img src={logo} alt="HoneyRest 로고" className="h-11 object-contain" />
                        </div>
                    )}
                    {eyebrow && <p className={`${eyebrowClass} mb-1`}>{eyebrow}</p>}
                    <h1 className="text-2xl font-black text-deep-gray break-keep">{title}</h1>
                    {description && <p className="mt-2 text-sm text-gray-400 break-keep">{description}</p>}
                </div>
                {children}
            </motion.div>
        </div>
    );
}

export default AuthCard;
