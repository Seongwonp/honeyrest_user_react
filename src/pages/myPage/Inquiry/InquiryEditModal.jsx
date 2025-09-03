import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';
import useApiRequest from '@/api/useApiRequest';

function InquiryEditModal({ inquiry, onClose, onUpdate }) {
    const { request, isLoading } = useApiRequest();
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (inquiry) {
            setTitle(inquiry.title || '');
            setCategory(inquiry.category || '');
            setContent(inquiry.content || '');
        }
    }, [inquiry]);

    if (!inquiry) return null;

    const isEditable = !inquiry.reply;

    const handleSubmit = async () => {
        if (!title.trim() || !content.trim()) {
            toast.error('제목과 내용을 모두 입력해주세요!');
            return;
        }
        try {
            await request(
                {
                    url: `/api/user/inquiries/edit/${inquiry.inquiryId}`,
                    method: 'PUT',
                    data: { title, category, content },
                },
                { successMessage: '문의가 정상적으로 수정되었습니다!' }
            );
            onUpdate(); // 상위 컴포넌트 갱신
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg w-11/12 max-w-lg p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    <FaTimes size={18} />
                </button>
                <h2 className="text-xl font-bold mb-4">문의 수정</h2>

                {!isEditable && (
                    <p className="text-red-500 mb-2">
                        답변이 등록된 문의는 수정할 수 없습니다.
                    </p>
                )}

                <input
                    type="text"
                    className="w-full border rounded px-3 py-2 mb-3"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditable}
                />

                <select
                    className="w-full border rounded px-3 py-2 mb-3"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    disabled={!isEditable}
                >
                    <option value="">카테고리 선택</option>
                    <option value="예약">예약</option>
                    <option value="결제">결제</option>
                    <option value="기타">기타</option>
                </select>

                <textarea
                    className="w-full border rounded px-3 py-2 mb-3 h-32 resize-none"
                    placeholder="내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={!isEditable}
                />

                {isEditable && (
                    <button
                        className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded ${
                            isLoading() ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        onClick={handleSubmit}
                        disabled={isLoading()}
                    >
                        {isLoading() ? '수정 중...' : '수정 완료'}
                    </button>
                )}
            </div>
        </div>
    );
}

export default InquiryEditModal;