import { FaBug } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const ServerErrorPage = () => (
    <ErrorLayout
        code="500"
        icon={<FaBug />}
        tone="red"
        title="서버 오류가 발생했습니다"
        message={'잠시 후 다시 시도해주세요. 문제가 지속되면 관리자에게 문의하세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ back: true, label: '이전 페이지' }}
    />
);

export default ServerErrorPage;
