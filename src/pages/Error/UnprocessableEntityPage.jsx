import { FaExclamationCircle } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const UnprocessableEntityPage = () => (
    <ErrorLayout
        code="422"
        icon={<FaExclamationCircle />}
        tone="red"
        title="입력값을 처리할 수 없습니다"
        message={'입력한 정보가 올바르지 않거나 누락되었습니다.\n다시 확인한 후 제출해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
    />
);

export default UnprocessableEntityPage;
