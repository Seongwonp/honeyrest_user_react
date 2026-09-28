import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiHeart, HiLocationMarker, HiChevronRight } from "react-icons/hi";
import useApiRequest from "@/api/useApiRequest";
import WishToggleButton from "@/components/WishToggleButton";
import { useAuth } from "@/hooks/useAuth"; // ✅ 인증 훅 추가
import SafeImage from "@/components/SafeImage.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import ListSkeleton from "@/components/ui/ListSkeleton.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import Button from "@/components/ui/Button.jsx";
import { cardClass, eyebrowClass } from "@/components/ui/styles";

function MyWishList() {
    const { user } = useAuth(); // ✅ 사용자 정보 가져오기
    const userId = user?.userId;

    const { request } = useApiRequest();
    const [wishlist, setWishlist] = useState([]);
    // loading | error | ready
    const [status, setStatus] = useState("loading");

    const fetchWishlist = useCallback(() => {
        setStatus("loading");
        request(
            {
                method: "GET",
                url: "/api/user/wishlist?page=0&size=12",
            },
            {
                label: "wishlist",
                onSuccess: (data) => {
                    setWishlist(data.content);
                    setStatus("ready");
                },
                errorMessage: "찜 목록을 불러오지 못했습니다.",
            }
        ).catch(() => setStatus("error"));
    }, [request]);

    useEffect(() => {
        if (userId) fetchWishlist();
    }, [userId, fetchWishlist]);

    if (!userId) {
        return (
            <section>
                <SectionTitle eyebrow="Wishlist" title="내 찜 목록" />
                <EmptyState
                    icon={<HiHeart />}
                    title="로그인 후 찜 목록을 확인할 수 있습니다."
                    action={<Button as={Link} to="/login">로그인</Button>}
                />
            </section>
        );
    }

    return (
        <section>
            <SectionTitle eyebrow="Wishlist" title="내 찜 목록" />

            {status === "loading" ? (
                <ListSkeleton rows={3} height="h-32" />
            ) : status === "error" ? (
                <ErrorState title="찜 목록을 불러오지 못했습니다." onRetry={fetchWishlist} />
            ) : wishlist.length === 0 ? (
                <EmptyState
                    icon={<HiHeart />}
                    title="찜한 숙소가 없습니다."
                    description="마음에 드는 숙소의 하트를 눌러 저장해 보세요."
                    action={<Button as={Link} to="/">숙소 둘러보기</Button>}
                />
            ) : (
                <ul className="space-y-4">
                    {wishlist.map((item, index) => (
                        <motion.li
                            key={item.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${cardClass} relative flex items-center gap-4 p-4 sm:p-5 hover:shadow-2xl hover:shadow-leaf-green/5 transition-all duration-500`}
                        >
                            <Link
                                to={`/accommodations/${item.id}`}
                                className="group flex flex-1 min-w-0 items-center gap-4 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30"
                            >
                                <div className="w-24 h-20 sm:w-32 sm:h-24 shrink-0 overflow-hidden rounded-2xl">
                                    <SafeImage
                                        src={item.thumbnail}
                                        alt={item.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                </div>
                                <div className="flex-1 min-w-0 space-y-1">
                                    <p className={`${eyebrowClass} flex items-center gap-1`}>
                                        <HiLocationMarker className="shrink-0" />
                                        <span className="truncate">{item.mainRegion} · {item.subRegion}</span>
                                    </p>
                                    <h3 className="text-base sm:text-lg font-black text-deep-gray leading-tight truncate group-hover:text-leaf-green transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-lg font-black text-deep-gray">
                                        ₩{item.price.toLocaleString()}
                                    </p>
                                    <span className="inline-flex items-center gap-0.5 text-xs font-bold text-gray-400 group-hover:text-honey-yellow-dark transition-colors">
                                        상세 보기 <HiChevronRight />
                                    </span>
                                </div>
                            </Link>
                            <div className="shrink-0 self-start">
                                <WishToggleButton
                                    accommodationId={item.id}
                                    initialLiked={true}
                                    userId={userId}
                                />
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default MyWishList;
