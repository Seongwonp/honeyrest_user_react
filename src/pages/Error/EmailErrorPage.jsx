import { FaEnvelopeOpenText } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const EmailErrorPage = () => (
    <ErrorLayout
        code="401"
        icon={<FaEnvelopeOpenText />}
        tone="honey"
        title="이메일 인증에 실패했습니다"
        message={'인증 링크가 만료되었거나 유효하지 않습니다.'}
        primary={{ to: '/signup', label: '회원가입 페이지로 이동' }}
        secondary={{ to: '/', label: '홈으로 돌아가기' }}
    />
);

export default EmailErrorPage;
