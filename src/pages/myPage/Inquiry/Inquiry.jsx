import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import InquiryEditModal from './InquiryEditModal';
import { toast } from 'react-toastify';
import { FaRegCommentDots, FaReply, FaHotel } from 'react-icons/fa';

function Inquiry() {
    const { request } = useApiRequest();
    const { inquiryId } = useParams();
    const navigate = useNavigate();

    const [inquiry, setInquiry] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    useEffect(() => {
        if (!inquiryId) return;

        const fetchInquiry = async () => {
            try {
                const data = await request(
                    { url: `/api/user/inquiries/${inquiryId}`, method: 'GET' },
                    { silent: true }
                );
                setInquiry(data);
            } catch (err) {
                console.error(err);
                toast.error('문의 정보를 불러오는 데 실패했습니다.');
            }
        };
        fetchInquiry();
    }, [inquiryId, request]);

    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            await request({ url: `/api/user/inquiries/delete/${inquiryId}`, method: 'DELETE' }, { successMessage: '문의가 삭제되었습니다.' });
            navigate(-1);
        } catch (err) {
            console.error(err);
            toast.error('삭제에 실패했습니다.');
        }
    };

    if (!inquiry) return <p className="p-4">로딩 중...</p>;

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md">
            {/* Top Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 rounded bg-yellow-500 text-white text-sm font-semibold hover:bg-yellow-600 transition-colors"
                >
                    뒤로가기
                </button>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setEditModalOpen(true)}
                        disabled={inquiry.isReplied}
                        className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 text-sm ${inquiry.isReplied ? 'bg-gray-400 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                    >
                        수정
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-md bg-red-500 text-white font-semibold hover:bg-red-600 text-sm transition-colors duration-200"
                    >
                        삭제
                    </button>
                </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-3 mb-5 border-b pb-3">
                <FaRegCommentDots className="text-yellow-500 text-3xl" />
                <h2 className="text-2xl font-bold text-yellow-500">{inquiry.title}</h2>
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-start text-xs text-gray-500 mb-6 gap-6">
                <span className="flex items-center gap-1">
                    <FaHotel /> <span className="font-semibold">숙소:</span> {inquiry.accommodationName}
                </span>

                <span>
                    <span className="font-semibold">문의 작성:</span> {formatDateTime(inquiry.createdAt)}
                </span>
            </div>

            {/* Inquiry Content */}
            <section className="mb-10">
                <div className="mb-3 flex items-center gap-3">
                    <FaRegCommentDots className="text-yellow-500" />
                    <span className="font-semibold text-yellow-500 text-lg">문의 내용</span>
                </div>
                <div className="bg-yellow-50 rounded-lg p-8 text-gray-800 shadow-md border min-h-[250px]">
                    <p className="whitespace-pre-wrap text-base">{inquiry.content}</p>
                </div>
            </section>

            {/* Reply Section */}
            <section>
                <div className="mb-3 flex items-center gap-3">
                    <FaReply className="text-yellow-500" />
                    <span className="font-semibold text-yellow-500 text-lg">답변</span>
                </div>
                <div className="bg-white rounded-lg p-8 text-gray-800 shadow-md border min-h-[250px]">
                    {inquiry.reply ? (
                        <>
                            <p className="whitespace-pre-wrap mb-5 text-base">{inquiry.reply}</p>
                            <div className="text-xs text-gray-500 flex flex-col sm:flex-row sm:items-center gap-4">
                                <span><span className="font-semibold">답변 작성자:</span> {inquiry.companyName}</span>
                                <span><span className="font-semibold">답변 시간:</span> {formatDateTime(inquiry.replyAt)}</span>
                            </div>
                        </>
                    ) : (
                        <span className="text-gray-400">답변이 아직 등록되지 않았습니다.</span>
                    )}
                </div>
            </section>

            {/* Edit Modal */}
            {editModalOpen && (
                <InquiryEditModal
                    inquiry={inquiry}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={(updated) => setInquiry(updated)}
                />
            )}
        </div>
    );
}

export default Inquiry;
