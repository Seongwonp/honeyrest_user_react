import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import useApiRequest from '@/api/useApiRequest';
import Dialog from '@/components/ui/Dialog.jsx';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import { inputClass, labelClass } from '@/components/ui/styles';

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
            onUpdate({ ...inquiry, title, category, content }); // 상위 컴포넌트 갱신
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Dialog onClose={onClose} title="문의 수정" closeOnBackdrop>
            {!isEditable && (
                <p role="alert" className="text-sm font-bold text-red-500 bg-red-50 rounded-2xl px-4 py-3 mb-4">
                    답변이 등록된 문의는 수정할 수 없습니다.
                </p>
            )}

            <div className="space-y-4">
                <Input
                    label="제목"
                    type="text"
                    placeholder="제목"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={!isEditable}
                />

                <div>
                    <label htmlFor="inquiry-edit-category" className={labelClass}>카테고리</label>
                    <select
                        id="inquiry-edit-category"
                        className={inputClass}
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        disabled={!isEditable}
                    >
                        <option value="">카테고리 선택</option>
                        <option value="예약">예약</option>
                        <option value="결제">결제</option>
                        <option value="기타">기타</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="inquiry-edit-content" className={labelClass}>내용</label>
                    <textarea
                        id="inquiry-edit-content"
                        className={`${inputClass} h-32 resize-none`}
                        placeholder="내용"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={!isEditable}
                    />
                </div>

                {isEditable && (
                    <Button
                        onClick={handleSubmit}
                        disabled={isLoading()}
                        size="lg"
                        fullWidth
                    >
                        {isLoading() ? '수정 중...' : '수정 완료'}
                    </Button>
                )}
            </div>
        </Dialog>
    );
}

export default InquiryEditModal;
