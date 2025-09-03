import { useEffect, useState } from 'react';
import useApiRequest from '@/api/useApiRequest';
import { FaTicketAlt } from 'react-icons/fa';

function CouponList() {
    const { request, isLoading } = useApiRequest();
    const [coupons, setCoupons] = useState([]);
    const [pageInfo, setPageInfo] = useState({ page: 0, totalPages: 0 });

    useEffect(() => {
        request(
            { url: '/api/user/coupons', method: 'GET' },
            {
                onSuccess: data => {
                    setCoupons(data.content);
                    setPageInfo({ page: data.page, totalPages: data.totalPages });
                }
            }
        );
    }, []);

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-yellow-500">내 쿠폰 내역</h2>
            {isLoading() ? (
                <p>로딩중...</p>
            ) : coupons.length === 0 ? (
                <p className="text-gray-500">사용 가능한 쿠폰이 없습니다.</p>
            ) : (
                <ul className="space-y-4">
                    {coupons.map(coupon => (
                        <li key={coupon.userCouponId} className="flex flex-col sm:flex-row items-start sm:items-center p-4 border rounded-lg hover:shadow-lg transition bg-gray-50">
                            <FaTicketAlt className="text-yellow-500 text-3xl mr-4 mb-2 sm:mb-0" />
                            <div className="flex-1">
                                <p className="font-semibold text-lg">{coupon.name}</p>
                                <p className="text-sm text-gray-500">코드: {coupon.code}</p>
                                <p className="text-sm text-gray-500">
                                    할인: {coupon.discountType === 'FIXED' ? `${coupon.discountValue}원` : `${coupon.discountValue}%`}
                                </p>
                                <p className="text-sm text-gray-500">
                                    유효기간: {coupon.validFrom} ~ {coupon.validTo}
                                </p>
                            </div>
                            <span className={`mt-2 sm:mt-0 ml-0 sm:ml-4 font-bold ${coupon.used ? 'text-gray-400' : 'text-green-500'}`}>
                                {coupon.used ? '사용됨' : '사용 가능'}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {pageInfo.totalPages > 1 && (
                <div className="mt-4 flex justify-center text-sm text-gray-500">
                    페이지 {pageInfo.page + 1} / {pageInfo.totalPages}
                </div>
            )}
        </div>
    );
}

export default CouponList;