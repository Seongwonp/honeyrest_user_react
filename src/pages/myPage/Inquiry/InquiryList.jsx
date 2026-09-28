import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaRegClock, FaBuilding, FaCalendarAlt, FaRegCommentDots } from 'react-icons/fa';
import SectionTitle from '@/components/ui/SectionTitle.jsx';
import ListSkeleton from '@/components/ui/ListSkeleton.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import ErrorState from '@/components/ui/ErrorState.jsx';
import Pagination from '@/components/ui/Pagination.jsx';
import { cardClass, badgeClass, eyebrowClass } from '@/components/ui/styles';

const InquiryList = () => {
    const { request } = useApiRequest();
    // loading | error | ready
    const [status, setStatus] = useState('loading');
    const [inquiries, setInquiries] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // request가 고정 참조이므로 fetchInquiries도 한 번만 생성됨
    const fetchInquiries = useCallback(async (pageNum = 0) => {
        setStatus('loading');
        try {
            const data = await request(
                { url: `/api/user/inquiries/List?page=${pageNum}&size=5`, method: 'GET' }
            );
            setInquiries(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
            setStatus('ready');
        } catch (err) {
            console.error(err);
            setStatus('error');
        }
    }, [request]);

    useEffect(() => {
        fetchInquiries();
    }, [fetchInquiries]);

    const handlePrev = () => {
        if (page > 0) fetchInquiries(page - 1);
    };

    const handleNext = () => {
        if (page + 1 < totalPages) fetchInquiries(page + 1);
    };

    const formatDateTime = (dateString) => {
        const date = new Date(dateString);
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const min = String(date.getMinutes()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
    };

    const totalCount = inquiries.length;
    const repliedCount = inquiries.filter(i => i.isReplied).length;
    const pendingCount = totalCount - repliedCount;

    // 페이지 번호 버튼 이동 (이전/다음 포함)
    const handlePageChange = (next) => {
        if (next === page - 1) return handlePrev();
        if (next === page + 1) return handleNext();
        if (next >= 0 && next < totalPages) fetchInquiries(next);
    };

    const summary = [
        { label: '총 문의', value: totalCount, className: 'bg-gray-50 text-deep-gray' },
        { label: '답변 완료', value: repliedCount, className: 'bg-leaf-green/10 text-leaf-green-dark' },
        { label: '미답변', value: pendingCount, className: 'bg-honey-yellow/10 text-honey-yellow-dark' },
    ];

    return (
        <section>
            <SectionTitle eyebrow="Inquiries" title="내 문의 내역" />

            <div className="grid grid-cols-3 gap-3 mb-6">
                {summary.map((s) => (
                    <div key={s.label} className={`rounded-2xl px-3 sm:px-5 py-3 sm:py-4 ${s.className}`}>
                        <p className="text-[10px] sm:text-xs font-bold opacity-70">{s.label}</p>
                        <p className="text-xl sm:text-2xl font-black">{s.value}</p>
                    </div>
                ))}
            </div>

            {status === 'loading' ? (
                <ListSkeleton rows={3} height="h-24" />
            ) : status === 'error' ? (
                <ErrorState title="문의 내역을 불러오지 못했습니다." onRetry={() => fetchInquiries(page)} />
            ) : inquiries.length === 0 ? (
                <EmptyState icon={<FaRegCommentDots />} title="문의 내역이 없습니다." description="숙소 상세 페이지에서 궁금한 점을 문의해 보세요." />
            ) : (
                <>
                    <ul className="space-y-4">
                        {inquiries.map((inq, index) => (
                            <motion.li
                                key={inq.inquiryId}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <Link
                                    to={`/user/mypage/inquiries/${inq.inquiryId}`}
                                    className={`${cardClass} group p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 hover:shadow-2xl hover:shadow-leaf-green/5 transition-all duration-500 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30`}
                                >
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <p className={`${eyebrowClass} flex items-center gap-1`}>
                                            <FaBuilding className="shrink-0" />
                                            <span className="truncate">{inq.accommodationName}</span>
                                        </p>
                                        <h3 className="text-lg font-black text-deep-gray leading-tight truncate group-hover:text-leaf-green transition-colors">
                                            {inq.title}
                                        </h3>
                                    </div>
                                    <div className="flex items-center gap-3 flex-wrap text-xs">
                                        <span className={`${badgeClass} ${inq.isReplied ? 'bg-leaf-green/10 text-leaf-green-dark' : 'bg-honey-yellow/15 text-honey-yellow-dark'}`}>
                                            {inq.isReplied ? <FaCheckCircle /> : <FaRegClock />}
                                            {inq.isReplied ? '답변 완료' : '미답변'}
                                        </span>
                                        <span className="whitespace-nowrap text-gray-400 flex items-center gap-1">
                                            <FaCalendarAlt /> {formatDateTime(inq.createdAt)}
                                        </span>
                                    </div>
                                </Link>
                            </motion.li>
                        ))}
                    </ul>
                    <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
                </>
            )}
        </section>
    );
};

export default InquiryList;
