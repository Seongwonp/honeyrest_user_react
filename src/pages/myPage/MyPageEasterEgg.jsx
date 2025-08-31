import { motion } from "framer-motion";
import {
    FaGhost,
    FaRegLaughWink,
    FaUserSecret,
    FaBug,
    FaRegQuestionCircle,
    FaRegGrinSquint,
    FaRegGrinTongueWink,
    FaRegSurprise,
} from "react-icons/fa";

function MyPageEasterEgg() {
    const phrases = [
        "여긴 아무것도 없어요... 진짜 아무것도...",
        "근데 왜 들어오셨죠? 👻",
        "혹시... 숨겨진 기능을 찾으시는 건가요?",
        "이건 그냥 개발자의 장난입니다 😎",
        "돌아가세요... 아직은 아무것도 없답니다.",
        "이 페이지는 사실... 아무 목적도 없습니다.",
        "당신은 지금 아무것도 없는 공간을 보고 계십니다.",
        "이건 버그가 아니라... 의도입니다. (진짜)",
        "혹시... 관리자세요? 아니면 그냥 호기심?",
        "이걸 본 사람은... 전설이 됩니다.",
        "개발자가 사라졌어요... 디버그 중이라네요 🐛",
        "이 페이지는 너무 조용해서... 콘솔도 안 울려요.",
        "마이페이지인데... 마이 없어요.",
        "이건 마이페이지가 아니라... 마이페이크입니다.",
        "여긴 진짜 아무것도 없는데... 왜 이렇게 뿌듯하죠?",
        "이 페이지는 무(無)에서 유(有)를 창조하려다 실패했습니다.",
        "이건 UX가 아니라... 유머입니다.",
        "404는 아니지만... 느낌은 404입니다.",
        "이 페이지는 개발자의 심심함으로 만들어졌습니다.",
    ];

    const icons = [
        <FaGhost className="text-4xl text-gray-400 animate-bounce" />,
        <FaRegLaughWink className="text-4xl text-yellow-400 animate-spin" />,
        <FaUserSecret className="text-4xl text-indigo-500 animate-pulse" />,
        <FaBug className="text-4xl text-red-400 animate-bounce" />,
        <FaRegQuestionCircle className="text-4xl text-green-500 animate-ping" />,
        <FaRegGrinSquint className="text-4xl text-pink-400 animate-pulse" />,
        <FaRegGrinTongueWink className="text-4xl text-orange-400 animate-spin" />,
        <FaRegSurprise className="text-4xl text-blue-400 animate-bounce" />,
    ];

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center text-gray-500 text-sm mt-20 flex flex-col items-center gap-3"
        >
            {randomIcon}
            <p className="italic">{randomPhrase}</p>
            <motion.div
                initial={{ rotate: -5 }}
                animate={{ rotate: 5 }}
                transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
                className="text-xs text-gray-400"
            >
                (이건 진짜 아무것도 없어요오... 근데 웃기죠? ㅎㅎ)
            </motion.div>
        </motion.div>
    );
}

export default MyPageEasterEgg;