import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaTicketAlt } from 'react-icons/fa';
import useApiRequest from '@/api/useApiRequest';
import SectionTitle from '@/components/ui/SectionTitle.jsx';
import ListSkeleton from '@/components/ui/ListSkeleton.jsx';
import EmptyState from '@/components/ui/EmptyState.jsx';
import ErrorState from '@/components/ui/ErrorState.jsx';
import { cardClass, badgeClass, eyebrowClass } from '@/components/ui/styles';

function CouponList() {
    const { request } = useApiRequest();
    const [coupons, setCoupons] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });
    // loading | error | ready
    const [status, setStatus] = useState('loading');

    // request는 useApiRequest에서 useCallback으로 고정된 참조
    const fetchCoupons = useCallback(() => {
        setStatus('loading');
        request(
            { url: '/api/user/coupons', method: 'GET' },
            {
                onSuccess: data => {
                    setCoupons(data.content);
                    setPageInfo({ page: data.page, totalPages: data.totalPages });
                    setStatus('ready');
                }
            }
        ).catch(() => setStatus('error'));
    }, [request]);

    // 마운트 시 1회 실행
    useEffect(() => {
        fetchCoupons();
    }, [fetchCoupons]);

    return (
        <section>
            <SectionTitle eyebrow="Coupons" title="내 쿠폰 내역" />
            {status === 'loading' ? (
                <ListSkeleton rows={3} height="h-28" />
            ) : status === 'error' ? (
                <ErrorState title="쿠폰 목록을 불러오지 못했습니다." onRetry={fetchCoupons} />
            ) : coupons.length === 0 ? (
                <EmptyState
                    icon={<FaTicketAlt />}
                    title="사용 가능한 쿠폰이 없습니다."
                    description="이벤트와 프로모션을 통해 쿠폰을 받아 보세요."
                />
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {coupons.map((coupon, index) => (
                        <motion.li
                            key={coupon.userCouponId}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`${cardClass} flex items-stretch overflow-hidden ${coupon.used ? 'opacity-60' : ''}`}
                        >
                            {/* 쿠폰 좌측 할인 영역 */}
                            <div className={`w-24 sm:w-28 shrink-0 flex flex-col items-center justify-center gap-1 border-r-2 border-dashed border-gray-100 ${coupon.used ? 'bg-gray-50 text-gray-400' : 'bg-honey-yellow/10 text-honey-yellow-dark'}`}>
                                <FaTicketAlt className="text-xl" />
                                <span className="text-lg font-black">
                                    {coupon.discountType === 'FIXED' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0 p-4 sm:p-5 space-y-1">
                                <div className="flex items-start justify-between gap-2">
                                    <p className="font-black text-deep-gray leading-tight break-keep">{coupon.name}</p>
                                    <span className={`${badgeClass} shrink-0 ${coupon.used ? 'bg-gray-100 text-gray-400' : 'bg-leaf-green/10 text-leaf-green-dark'}`}>
                                        {coupon.used ? '사용됨' : '사용 가능'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate">
                                    <span className={eyebrowClass}>Code</span> <span className="font-mono">{coupon.code}</span>
                                </p>
                                <p className="text-xs text-gray-400">
                                    유효기간: {coupon.validFrom} ~ {coupon.validTo}
                                </p>
                            </div>
                        </motion.li>
                    ))}
                </ul>
            )}
            {status === 'ready' && pageInfo.totalPages > 1 && (
                <p className="mt-6 text-center text-xs font-bold text-gray-400">
                    페이지 {pageInfo.page + 1} / {pageInfo.totalPages}
                </p>
            )}
        </section>
    );
}

export default CouponList;
