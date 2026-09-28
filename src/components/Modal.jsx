import { HiInformationCircle } from 'react-icons/hi';
import Dialog from '@/components/ui/Dialog.jsx';
import Button from '@/components/ui/Button.jsx';

// 단순 안내 메시지 모달 (배경 오버레이는 호출하는 쪽에서 렌더링)
function Modal({ message, onClose }) {
    return (
        <Dialog onClose={onClose} className="max-w-sm text-center" showBackdrop={false} showClose={false} closeOnBackdrop>
            <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-honey-yellow/10 text-honey-yellow-dark flex items-center justify-center text-2xl">
                <HiInformationCircle />
            </div>
            <p className="text-deep-gray text-base font-bold mb-6 break-keep whitespace-pre-line">{message}</p>
            <Button onClick={onClose} fullWidth>
                확인
            </Button>
        </Dialog>
    );
}

export default Modal;
