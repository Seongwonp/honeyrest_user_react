import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { HiCalendar, HiChevronRight, HiClipboardList } from "react-icons/hi";
import api from "@/api/axios";
import SafeImage from "@/components/SafeImage.jsx";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import ListSkeleton from "@/components/ui/ListSkeleton.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import Pagination from "@/components/ui/Pagination.jsx";
import Button from "@/components/ui/Button.jsx";
import { cardClass, badgeClass, eyebrowClass } from "@/components/ui/styles";
import { getReservationStatusMeta } from "./reservationStatus";

export default function ReservationList() {
    const { user } = useOutletContext();
    const [reservations, setReservations] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, size: 5, totalPages: 0 });
    // loading | error | ready
    const [status, setStatus] = useState("loading");

    // size는 응답으로 갱신되므로 ref로 최신값만 참조 (size 변경만으로 재조회하지 않도록)
    const pageSizeRef = useRef(pageInfo.size);
    useEffect(() => {
        pageSizeRef.current = pageInfo.size;
    }, [pageInfo.size]);

    // setState·ref만 사용하므로 참조 고정
    const fetchReservations = useCallback(async (page) => {
        setStatus("loading");
        try {
            const res = await api.get("/api/user/reservations", {
                params: { page, size: pageSizeRef.current },
            });

            setReservations(res.data.content);
            setPageInfo({
                page: res.data.page,
                size: res.data.size,
                totalPages: res.data.totalPages,
            });
            setStatus("ready");
        } catch (err) {
            console.error("❌ 예약 내역 조회 실패:", err);
            setStatus("error");
        }
    }, []);

    useEffect(() => {
        if (user?.userId) fetchReservations(pageInfo.page);
    }, [user, pageInfo.page, fetchReservations]);

    const handlePageChange = (nextPage) => {
        setPageInfo((prev) => ({ ...prev, page: nextPage }));
    };

    return (
        <section>
            <SectionTitle eyebrow="Reservations" title="나의 예약 내역" />

            {status === "loading" ? (
                <ListSkeleton rows={3} height="h-40" />
            ) : status === "error" ? (
                <ErrorState
                    title="예약 내역을 불러오지 못했습니다."
                    onRetry={() => fetchReservations(pageInfo.page)}
                />
            ) : reservations.length === 0 ? (
                <EmptyState
                    icon={<HiClipboardList />}
                    title="예약 내역이 없습니다."
                    description="마음에 드는 숙소를 찾아 첫 예약을 시작해 보세요."
                    action={<Button as={Link} to="/">숙소 둘러보기</Button>}
                />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reservations.map((res, index) => {
                        const meta = getReservationStatusMeta(res.status);
                        return (
                            <motion.li
                                key={res.reservationId}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/user/mypage/reservations/${res.reservationId}`}
                                    className={`${cardClass} group flex gap-4 p-4 sm:p-5 h-full hover:shadow-2xl hover:shadow-leaf-green/5 transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30`}
                                >
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-2xl">
                                        <SafeImage
                                            src={res.thumbnailUrl}
                                            alt="숙소 썸네일"
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-2">
                                        <div className="space-y-1 min-w-0">
                                            <span className={`${badgeClass} ${meta.className}`}>{meta.label}</span>
                                            <p className="text-base sm:text-lg font-black text-deep-gray leading-tight truncate">
                                                {res.accommodationName}
                                            </p>
                                            <p className="text-xs font-bold text-gray-400 truncate">{res.roomName}</p>
                                            <p className="flex items-center gap-1 text-xs text-gray-500">
                                                <HiCalendar className="shrink-0" />
                                                <span className="truncate">{res.checkIn} ~ {res.checkOut}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-end justify-between gap-2 border-t border-gray-50 pt-2">
                                            <div className="min-w-0">
                                                <p className={eyebrowClass}>No.</p>
                                                <p className="font-mono text-xs text-gray-500 truncate">{res.reservationCode}</p>
                                            </div>
                                            <div className="flex items-center gap-1 shrink-0">
                                                <span className="text-lg font-black text-deep-gray">
                                                    ₩{res.price.toLocaleString()}
                                                </span>
                                                <HiChevronRight className="text-gray-300 group-hover:text-honey-yellow-dark transition-colors" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.li>
                        );
                    })}
                </ul>
            )}

            {status === "ready" && (
                <Pagination
                    page={pageInfo.page}
                    totalPages={pageInfo.totalPages}
                    onChange={handlePageChange}
                />
            )}
        </section>
    );
}
