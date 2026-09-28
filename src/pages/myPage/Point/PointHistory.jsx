import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaHistory, FaCoins } from "react-icons/fa";
import useApiRequest from "@/api/useApiRequest";
import SectionTitle from "@/components/ui/SectionTitle.jsx";
import Card from "@/components/ui/Card.jsx";
import ListSkeleton from "@/components/ui/ListSkeleton.jsx";
import EmptyState from "@/components/ui/EmptyState.jsx";
import ErrorState from "@/components/ui/ErrorState.jsx";
import Pagination from "@/components/ui/Pagination.jsx";
import { eyebrowClass } from "@/components/ui/styles";

function PointHistory() {
    const [currentPoint, setCurrentPoint] = useState(0);
    const [history, setHistory] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [size, setSize] = useState(10);
    // loading | error | ready
    const [status, setStatus] = useState("loading");

    const { request } = useApiRequest();

    // size는 응답으로 갱신되므로 ref로 최신값만 참조 (size 변경만으로 재조회하지 않도록)
    const sizeRef = useRef(size);
    useEffect(() => {
        sizeRef.current = size;
    }, [size]);

    const fetchPointHistory = useCallback((pageNumber = 0) => {
        setStatus("loading");
        request(
            {
                url: "/api/user/point-history",
                method: "GET",
                params: { page: pageNumber, size: sizeRef.current },
            },
            {
                onSuccess: (data) => {
                    setCurrentPoint(data.currentPoint);
                    setHistory(data.history);
                    setTotalPages(data.totalPages);
                    setPage(data.page);
                    setSize(data.size);
                    setStatus("ready");
                },
                onError: (err) => console.error("포인트 히스토리 조회 실패:", err),
            }
        ).catch(() => setStatus("error"));
    }, [request]);

    useEffect(() => {
        fetchPointHistory();
    }, [fetchPointHistory]);

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            fetchPointHistory(newPage);
        }
    };

    return (
        <section className="space-y-8">
            <SectionTitle eyebrow="Points" title="포인트 현황" />

            {/* 현재 포인트 요약 */}
            <div className="bg-deep-gray rounded-[2rem] p-6 md:p-8 text-white shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 shrink-0 rounded-2xl bg-honey-yellow/20 text-honey-yellow flex items-center justify-center text-xl">
                        <FaCoins />
                    </div>
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Current Point</p>
                        <p className="text-sm font-bold text-white/80">현재 포인트</p>
                    </div>
                </div>
                <p className="text-3xl md:text-4xl font-black text-honey-yellow truncate">
                    {currentPoint.toLocaleString()}
                    <span className="text-base font-bold text-white/60 ml-1">P</span>
                </p>
            </div>

            <div>
                <h3 className="flex items-center gap-2 text-lg font-black text-deep-gray mb-4">
                    <FaHistory className="text-gray-400" /> 포인트 내역
                </h3>

                {status === "loading" ? (
                    <ListSkeleton rows={4} height="h-16" />
                ) : status === "error" ? (
                    <ErrorState title="포인트 내역을 불러오지 못했습니다." onRetry={() => fetchPointHistory(page)} />
                ) : history.length === 0 ? (
                    <EmptyState icon={<FaCoins />} title="포인트 내역이 없습니다." />
                ) : (
                    <Card padding="p-2 sm:p-4">
                        <ul className="divide-y divide-gray-50">
                            {history.map((item, idx) => (
                                <motion.li
                                    // 내역 항목에 고유 id 가 없어 생성 시각 + 순번으로 키 구성
                                    key={`${item.createdAt}-${idx}`}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.03 }}
                                    className="flex items-center justify-between gap-4 px-3 sm:px-4 py-4"
                                >
                                    <div className="min-w-0">
                                        <p className="font-bold text-deep-gray break-keep">{item.reason}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className={`font-black ${item.amount > 0 ? "text-leaf-green-dark" : "text-red-400"}`}>
                                            {item.amount > 0 ? `+${item.amount.toLocaleString()}` : item.amount.toLocaleString()}
                                        </p>
                                        <p className={eyebrowClass}>잔액 {item.balance.toLocaleString()}</p>
                                    </div>
                                </motion.li>
                            ))}
                        </ul>
                    </Card>
                )}

                {status === "ready" && (
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                )}
            </div>
        </section>
    );
}

export default PointHistory;
