import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useApiRequest from '@/api/useApiRequest';
import InquiryEditModal from './InquiryEditModal';
import { toast } from 'react-toastify';
import { FaRegCommentDots, FaReply, FaHotel, FaArrowLeft } from 'react-icons/fa';
import Card from '@/components/ui/Card.jsx';
import Button from '@/components/ui/Button.jsx';
import ErrorState from '@/components/ui/ErrorState.jsx';
import PageLoader from '@/components/PageLoader.jsx';
import { badgeClass, eyebrowClass } from '@/components/ui/styles';

function Inquiry() {
    const { request } = useApiRequest();
    const { inquiryId } = useParams();
    const navigate = useNavigate();

    const [inquiry, setInquiry] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [loadError, setLoadError] = useState(false);
    // 다시 시도 시 값을 바꿔 재조회
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!inquiryId) return;

        const fetchInquiry = async () => {
            setLoadError(false);
            try {
                const data = await request(
                    { url: `/api/user/inquiries/${inquiryId}`, method: 'GET' },
                    { silent: true }
                );
                setInquiry(data);
            } catch (err) {
                console.error(err);
                toast.error('문의 정보를 불러오는 데 실패했습니다.');
                setLoadError(true);
            }
        };
        fetchInquiry();
    }, [inquiryId, request, reloadKey]);

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

    if (!inquiry) {
        return loadError ? (
            <ErrorState title="문의 정보를 불러오지 못했습니다." onRetry={() => setReloadKey((k) => k + 1)} />
        ) : (
            <PageLoader />
        );
    }

    const formatDateTime = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    };

    return (
        <section className="space-y-6">
            {/* Top Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> 뒤로가기
                </Button>
                <div className="flex items-center gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setEditModalOpen(true)}
                        disabled={inquiry.isReplied}
                        title={inquiry.isReplied ? '답변이 완료된 문의는 수정할 수 없습니다.' : undefined}
                    >
                        수정
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                        삭제
                    </Button>
                </div>
            </div>

            <Card>
                {/* Title */}
                <div className="space-y-3 border-b border-gray-50 pb-5 mb-6">
                    <span className={`${badgeClass} ${inquiry.isReplied ? 'bg-leaf-green/10 text-leaf-green-dark' : 'bg-honey-yellow/15 text-honey-yellow-dark'}`}>
                        {inquiry.isReplied ? '답변 완료' : '미답변'}
                    </span>
                    <h2 className="text-2xl font-black text-deep-gray break-keep">{inquiry.title}</h2>
                    {/* Meta Info */}
                    <div className="flex flex-wrap items-center text-xs text-gray-400 gap-x-6 gap-y-1">
                        <span className="flex items-center gap-1">
                            <FaHotel /> <span className="font-bold">숙소</span> {inquiry.accommodationName}
                        </span>
                        <span>
                            <span className="font-bold">문의 작성</span> {formatDateTime(inquiry.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Inquiry Content */}
                <div className="mb-8">
                    <p className={`${eyebrowClass} mb-2 flex items-center gap-1`}>
                        <FaRegCommentDots /> Question · 문의 내용
                    </p>
                    <div className="bg-off-white rounded-2xl p-5 sm:p-6 text-deep-gray min-h-[160px]">
                        <p className="whitespace-pre-wrap break-words text-sm sm:text-base leading-relaxed">{inquiry.content}</p>
                    </div>
                </div>

                {/* Reply Section */}
                <div>
                    <p className={`${eyebrowClass} mb-2 flex items-center gap-1`}>
                        <FaReply /> Answer · 답변
                    </p>
                    <div className={`rounded-2xl p-5 sm:p-6 min-h-[160px] ${inquiry.reply ? 'bg-leaf-green/5 border border-leaf-green/20' : 'border border-dashed border-gray-200'}`}>
                        {inquiry.reply ? (
                            <>
                                <p className="whitespace-pre-wrap break-words mb-5 text-sm sm:text-base leading-relaxed text-deep-gray">{inquiry.reply}</p>
                                <div className="text-xs text-gray-400 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                                    <span><span className="font-bold">답변 작성자</span> {inquiry.companyName}</span>
                                    <span><span className="font-bold">답변 시간</span> {formatDateTime(inquiry.replyAt)}</span>
                                </div>
                            </>
                        ) : (
                            <span className="text-sm text-gray-400">답변이 아직 등록되지 않았습니다.</span>
                        )}
                    </div>
                </div>
            </Card>

            {/* Edit Modal */}
            {editModalOpen && (
                <InquiryEditModal
                    inquiry={inquiry}
                    onClose={() => setEditModalOpen(false)}
                    onUpdate={(updated) => setInquiry(updated)}
                />
            )}
        </section>
    );
}

export default Inquiry;
