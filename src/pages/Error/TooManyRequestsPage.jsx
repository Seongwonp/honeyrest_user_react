import { FaClock } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const TooManyRequestsPage = () => (
    <ErrorLayout
        code="429"
        icon={<FaClock />}
        tone="honey"
        title="요청이 너무 많습니다"
        message={'서버가 요청을 처리할 수 없습니다.\n잠시 후 다시 시도해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
    />
);

export default TooManyRequestsPage;
