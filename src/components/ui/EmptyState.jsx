import { cardClass } from "./styles";

// 빈 목록 상태
function EmptyState({ icon, title, description, action, className = "" }) {
    return (
        <div className={`${cardClass} text-center py-16 px-6 ${className}`}>
            {icon && (
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-honey-yellow/10 text-honey-yellow-dark flex items-center justify-center text-2xl">
                    {icon}
                </div>
            )}
            <h3 className="text-lg font-black text-deep-gray mb-1 break-keep">{title}</h3>
            {description && <p className="text-sm text-gray-400 break-keep">{description}</p>}
            {action && <div className="mt-6 flex justify-center">{action}</div>}
        </div>
    );
}

export default EmptyState;
