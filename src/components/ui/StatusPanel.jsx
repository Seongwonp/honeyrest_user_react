import { motion } from "framer-motion";
import { eyebrowClass } from "./styles";

// 아이콘 배경 톤
const TONES = {
    honey: "bg-honey-yellow/15 text-honey-yellow-dark",
    green: "bg-leaf-green/10 text-leaf-green-dark",
    red: "bg-red-50 text-red-400",
    gray: "bg-gray-100 text-gray-500",
};

// 결과/안내 화면 공통 패널 (에러 페이지, 결제 결과, 인증 결과 등)
function StatusPanel({ icon, tone = "honey", eyebrow, title, message, children, actions, role }) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <motion.div
                role={role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="w-full max-w-md bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-honey-yellow/5 p-8 sm:p-10 text-center"
            >
                {icon && (
                    <motion.div
                        initial={{ scale: 0.6, rotate: -8 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
                        className={`mx-auto mb-6 w-20 h-20 rounded-3xl flex items-center justify-center text-4xl ${TONES[tone] || TONES.honey}`}
                    >
                        {icon}
                    </motion.div>
                )}
                {eyebrow && <p className={`${eyebrowClass} mb-2`}>{eyebrow}</p>}
                <h1 className="text-2xl font-black text-deep-gray mb-3 break-keep">{title}</h1>
                {message && <p className="text-sm text-gray-400 leading-relaxed break-keep whitespace-pre-line">{message}</p>}
                {children}
                {actions && <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">{actions}</div>}
            </motion.div>
        </div>
    );
}

export default StatusPanel;
