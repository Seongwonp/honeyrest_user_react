import { FaQuestionCircle } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const NotFoundPage = () => (
    <ErrorLayout
        code="404"
        icon={<FaQuestionCircle />}
        tone="honey"
        title="앗! 페이지를 찾을 수 없어요!"
        message={'요청하신 페이지가 존재하지 않거나 이동되었어요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ back: true, label: '이전 페이지' }}
    />
);

export default NotFoundPage;
