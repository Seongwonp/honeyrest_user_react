import { eyebrowClass } from "./styles";

// 섹션 헤더: 작은 eyebrow 라벨 + 굵은 제목 + (선택) 설명 / 우측 액션
// className 기본값은 하단 여백(mb-6), 다른 여백이 필요하면 덮어씀
function SectionTitle({ eyebrow, title, description, action, as = "h2", className = "mb-6" }) {
    const Heading = as;
    return (
        <div className={`flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 ${className}`}>
            <div className="min-w-0">
                {eyebrow && <p className={`${eyebrowClass} mb-1`}>{eyebrow}</p>}
                <Heading className="text-2xl md:text-3xl font-black text-deep-gray leading-tight break-keep">
                    {title}
                </Heading>
                {description && <p className="mt-2 text-sm text-gray-400">{description}</p>}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}

export default SectionTitle;
