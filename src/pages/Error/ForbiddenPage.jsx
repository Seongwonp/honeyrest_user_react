import { FaBan } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const ForbiddenPage = () => (
    <ErrorLayout
        code="403"
        icon={<FaBan />}
        tone="red"
        title="접근 권한이 없습니다"
        message={'이 페이지에 접근할 수 있는 권한이 없습니다.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ back: true, label: '이전 페이지' }}
    />
);

export default ForbiddenPage;
