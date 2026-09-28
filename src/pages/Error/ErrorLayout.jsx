import { Link, useNavigate } from 'react-router-dom';
import StatusPanel from '@/components/ui/StatusPanel.jsx';
import Button from '@/components/ui/Button.jsx';

// 에러 페이지 공통 레이아웃
// primary / secondary: { to, label } 또는 { back: true, label } (이전 페이지로)
function ErrorLayout({ code, icon, tone = 'honey', title, message, primary, secondary }) {
    const navigate = useNavigate();

    const renderAction = (action, variant) => {
        if (!action) return null;
        if (action.back) {
            return (
                <Button variant={variant} onClick={() => navigate(-1)}>
                    {action.label}
                </Button>
            );
        }
        return (
            <Button as={Link} to={action.to} variant={variant}>
                {action.label}
            </Button>
        );
    };

    return (
        <div className="min-h-screen bg-off-white">
            <StatusPanel
                icon={icon}
                tone={tone}
                // 숫자 코드는 'Error 404' 형태, 그 외(예: 계정 제한)는 그대로 표시
                eyebrow={code ? (/^\d+$/.test(code) ? `Error ${code}` : code) : undefined}
                title={title}
                message={message}
                actions={
                    <>
                        {renderAction(primary, 'primary')}
                        {renderAction(secondary, 'secondary')}
                    </>
                }
            />
        </div>
    );
}

export default ErrorLayout;
