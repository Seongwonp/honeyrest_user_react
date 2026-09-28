import { FaTools } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const ServiceUnavailablePage = () => (
    <ErrorLayout
        code="503"
        icon={<FaTools />}
        tone="gray"
        title="서비스 이용이 일시적으로 불가능합니다"
        message={'현재 점검 중이거나 서버가 과부하 상태입니다.\n잠시 후 다시 시도해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
    />
);

export default ServiceUnavailablePage;
