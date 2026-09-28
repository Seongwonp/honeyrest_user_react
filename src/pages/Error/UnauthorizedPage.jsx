import { FaLock } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const UnauthorizedPage = () => (
    <ErrorLayout
        code="401"
        icon={<FaLock />}
        tone="honey"
        title="로그인이 필요합니다"
        message={'이 페이지를 이용하려면 로그인이 필요합니다.'}
        primary={{ to: '/login', label: '로그인 페이지로 이동' }}
    />
);

export default UnauthorizedPage;
