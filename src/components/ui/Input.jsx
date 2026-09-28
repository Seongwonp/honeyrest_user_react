import { useId } from "react";
import { inputClass, labelClass } from "./styles";

// 라벨 + 입력 필드. label 이 없으면 input 만 렌더링
function Input({ label, id, className = "", wrapperClassName = "", hint, ref, ...rest }) {
    const autoId = useId();
    const inputId = id || autoId;
    return (
        <div className={`min-w-0 ${wrapperClassName}`}>
            {label && (
                <label htmlFor={inputId} className={labelClass}>
                    {label}
                </label>
            )}
            <input ref={ref} id={inputId} className={`${inputClass} ${className}`} {...rest} />
            {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
        </div>
    );
}

export default Input;
