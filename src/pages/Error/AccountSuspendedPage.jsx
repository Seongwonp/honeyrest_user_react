import { FaUserLock } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const AccountSuspendedPage = () => (
    <ErrorLayout
        code="계정 제한"
        icon={<FaUserLock />}
        tone="red"
        title="계정이 제한되었습니다"
        message={'해당 계정은 정책 위반 또는 보안 문제로 인해 제한되었습니다.\n자세한 내용은 고객센터를 통해 문의해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
        secondary={{ to: '/support', label: '고객센터로 이동' }}
    />
);

export default AccountSuspendedPage;
