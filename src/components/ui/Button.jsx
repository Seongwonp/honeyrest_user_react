import { buttonVariants, buttonSizes } from "./styles";

// 공통 버튼. variant: primary | secondary | success | dark | danger | dangerSolid | ghost
// as 로 Link 등 다른 컴포넌트를 렌더링할 수 있음
function Button({
    as = "button",
    variant = "primary",
    size = "md",
    fullWidth = false,
    className = "",
    type,
    children,
    ...rest
}) {
    const Tag = as;
    const typeProps = Tag === "button" ? { type: type || "button" } : {};
    return (
        <Tag
            className={`${buttonVariants[variant] || buttonVariants.primary} ${buttonSizes[size] || buttonSizes.md} ${fullWidth ? "w-full" : ""} ${className}`}
            {...typeProps}
            {...rest}
        >
            {children}
        </Tag>
    );
}

export default Button;
