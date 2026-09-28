import { FaShieldAlt } from "react-icons/fa";
import { cardClass } from "@/components/ui/styles";

// 취소 정책 요약 카드
function CancellationPolicyCard({ cancellationPolicy }) {
    return (
        <div className={`${cardClass} p-6`}>
            <h3 className="text-sm font-black text-deep-gray mb-3 flex items-center gap-2">
                <FaShieldAlt className="text-leaf-green" /> 취소 정책
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-500 space-y-1">
                {cancellationPolicy.map((policy, idx) => (
                    <li key={policy.policyId ?? `policy-${idx}`}>
                        <strong>{policy.policyName}</strong>: {policy.detail}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CancellationPolicyCard;
