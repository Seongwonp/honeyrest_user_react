import { cardClass } from "./styles";

// 공통 카드 컨테이너 (rounded-[2rem] + 옅은 그림자)
function Card({ as = "div", className = "", padding = "p-6 md:p-8", children, ...rest }) {
    const Tag = as;
    return (
        <Tag className={`${cardClass} ${padding} ${className}`} {...rest}>
            {children}
        </Tag>
    );
}

export default Card;
