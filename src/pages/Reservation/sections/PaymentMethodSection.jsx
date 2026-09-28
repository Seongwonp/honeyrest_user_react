import { FaCreditCard, FaMobileAlt, FaMoneyCheckAlt } from "react-icons/fa";
import { cardClass } from "@/components/ui/styles";

const paymentOptions = [
    {value: "CARD", label: "카드 결제", icon: <FaCreditCard/>},
    {value: "TOSS", label: "간편 결제", icon: <FaMobileAlt/>},
    {value: "BANK", label: "무통장 입금", icon: <FaMoneyCheckAlt/>}
];

// 결제 수단 선택 (선택 값은 부모가 소유)
function PaymentMethodSection({ paymentMethod, setPaymentMethod }) {
    return (
        <div className={`${cardClass} p-6`}>
            <h3 className="text-sm font-black text-deep-gray mb-3">결제 수단 선택</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="결제 수단">
                {paymentOptions.map((option) => (
                    <button
                        type="button"
                        key={option.value}
                        role="radio"
                        aria-checked={paymentMethod === option.value}
                        onClick={() => setPaymentMethod(option.value)}
                        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-honey-yellow/30 ${
                            paymentMethod === option.value
                                ? "bg-honey-yellow text-deep-gray border-honey-yellow shadow-lg shadow-honey-yellow/20"
                                : "bg-white text-deep-gray border-gray-100 hover:border-honey-yellow"
                        }`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                ))}
            </div>

            {paymentMethod && (
                <p className="mt-3 text-sm text-gray-500 flex items-center gap-2">
                    선택된 결제 방식: <strong>{paymentOptions.find(opt => opt.value === paymentMethod)?.label}</strong>
                </p>
            )}
        </div>
    );
}

export default PaymentMethodSection;
