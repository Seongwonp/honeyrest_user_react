import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { motion } from "framer-motion";
import api from "@/api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function WishToggleButton({ accommodationId, initialLiked, userId }) {
    const [isWished, setIsWished] = useState(initialLiked);
    const navigate = useNavigate();

    const handleToggle = async () => {
        if (!userId) {
            toast.info("로그인이 필요합니다.");
            return navigate("/login");
        }

        try {
            const res = await api.post("/api/wishList/toggle", {
                userId,
                accommodationId
            });
            setIsWished(res.data.liked);
        } catch (err) {
            console.error("찜 토글 실패:", err);
            toast.error("찜 처리 중 오류가 발생했습니다.");
        }
    };

    return (
        <motion.button
            type="button"
            onClick={handleToggle}
            aria-pressed={isWished}
            whileTap={{ scale: 0.9 }}
            className={`mt-2 inline-flex items-center gap-1 sm:gap-2 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-200 ${
                !userId
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-red-500 hover:scale-105 transition"
            }`}
            title={!userId ? "로그인 후 찜하기 가능" : isWished ? "찜 취소" : "찜하기"}
        >
            {isWished ? (
                <AiFillHeart className="text-2xl" />
            ) : (
                <AiOutlineHeart className="text-2xl" />
            )}
            <span className="text-xs sm:text-sm font-medium">
        {isWished ? "찜 취소" : "찜하기"}
      </span>
        </motion.button>
    );
}

export default WishToggleButton;