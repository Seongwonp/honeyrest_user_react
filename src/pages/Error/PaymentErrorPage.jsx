import { FaCreditCard } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const PaymentErrorPage = () => (
    <ErrorLayout
        code="결제 실패"
        icon={<FaCreditCard />}
        tone="red"
        title="결제에 실패했습니다"
        message={'카드 정보가 올바르지 않거나 결제가 거절되었습니다.\n다시 시도하거나 다른 결제 수단을 이용해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ back: true, label: '결제 페이지로 이동' }}
    />
);

export default PaymentErrorPage;
