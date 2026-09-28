import { FaWifi } from 'react-icons/fa';
import ErrorLayout from './ErrorLayout.jsx';

const RequestTimeoutPage = () => (
    <ErrorLayout
        code="408"
        icon={<FaWifi />}
        tone="gray"
        title="요청 시간이 초과되었습니다"
        message={'서버 응답이 지연되어 요청이 실패했습니다.\n네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'}
        primary={{ to: '/', label: '홈으로 돌아가기' }}
    />
);

export default RequestTimeoutPage;
