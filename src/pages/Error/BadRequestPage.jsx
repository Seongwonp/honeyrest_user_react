import { FaExclamationTriangle } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const BadRequestPage = () => (
    <ErrorLayout
        code="400"
        icon={<FaExclamationTriangle />}
        tone="honey"
        title="잘못된 요청이에요"
        message={'요청이 올바르지 않습니다. 다시 시도해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ back: true, label: '이전 페이지' }}
    />
);

export default BadRequestPage;
