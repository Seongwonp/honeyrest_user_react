import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaRegClock, FaBuilding, FaCalendarAlt } from 'react-icons/fa';

const InquiryList = () => {
    const { request, isLoading } = useApiRequest();
    const [inquiries, setInquiries] = useState([]);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const fetchInquiries = async (pageNum = 0) => {
        try {
            const data = await request(
                { url: `/api/user/inquiries/List?page=${pageNum}&size=5`, method: 'GET' }
            );
            setInquiries(data.content);
            setPage(data.page);
            setTotalPages(data.totalPages);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchInquiries();
    }, []);

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

    return (
        <div className="p-6 max-w-5xl mx-auto bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 pb-4">내 문의 내역</h2>

            <div className="flex flex-wrap gap-6 mb-8 text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1"><FaRegClock /> 총 문의: {totalCount}</div>
                <div className="flex items-center gap-1 text-yellow-500"><FaCheckCircle /> 답변 완료: {repliedCount}</div>
                <div className="flex items-center gap-1 text-yellow-400"><FaRegClock /> 미답변: {pendingCount}</div>
            </div>

            {isLoading('default') ? (
                <p className="text-center text-gray-500 text-lg">로딩 중...</p>
            ) : inquiries.length === 0 ? (
                <p className="text-center text-gray-400 text-lg">문의 내역이 없습니다.</p>
            ) : (
                <div className="space-y-4">
                    {inquiries.map((inq) => (
                        <Link
                            key={inq.inquiryId}
                            to={`/user/mypage/inquiries/${inq.inquiryId}`}
                            className={`border rounded-lg p-5 shadow-sm hover:shadow-lg transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white ${
                                inq.isReplied ? 'border-yellow-500' : 'border-gray-300'
                            }`}
                        >
                            <div className="flex-1">
                                <h3 className={`text-lg font-semibold mb-1 ${inq.isReplied ? 'text-yellow-500' : 'text-gray-900'}`}>{inq.title}</h3>
                                <p className="text-sm text-gray-500 flex items-center gap-2"><FaBuilding /> {inq.accommodationName}</p>
                            </div>
                            <div className="flex items-center gap-6 text-sm sm:text-base text-gray-600 flex-wrap sm:flex-nowrap">
                                <div className={`flex items-center gap-2 font-semibold ${
                                    inq.isReplied ? 'text-yellow-500' : 'text-yellow-400'
                                }`}>
                                    {inq.isReplied ? <FaCheckCircle /> : <FaRegClock />}
                                    <span>{inq.isReplied ? '답변 완료' : '미답변'}</span>
                                </div>
                                <div className="whitespace-nowrap text-gray-500 flex items-center gap-1">
                                    <FaCalendarAlt /> {formatDateTime(inq.createdAt)}
                                </div>
                            </div>
                        </Link>
                    ))}
                    <div className="flex justify-between mt-8">
                        <button
                            onClick={handlePrev}
                            disabled={page === 0}
                            className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition"
                        >
                            <FaArrowLeft /> 이전
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={page + 1 >= totalPages}
                            className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-white rounded-md shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-yellow-600 transition"
                        >
                            다음 <FaArrowRight />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InquiryList;