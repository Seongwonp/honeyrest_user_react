import { cardClass } from "@/components/ui/styles";

// 약관 동의 (전체 동의 + 항목별 상세 펼치기). agreements/expanded 상태는 부모가 소유
function AgreementSection({ agreements, setAgreements, expanded, toggleDetail, cancellationPolicy }) {
    return (
        <div className={`${cardClass} p-6`}>
            <div className="space-y-3">
                {/* 전체 동의 체크박스 */}
                <label className="flex items-center cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={agreements.privacy && agreements.cancellation && agreements.email}
                        onChange={e => {
                            const checked = e.target.checked;
                            setAgreements({
                                privacy: checked,
                                cancellation: checked,
                                email: checked
                            });
                        }}
                        className="mr-3 w-4 h-4 shrink-0 accent-leaf-green"
                    />
                    <span className="text-sm text-deep-gray font-black">전체 동의</span>
                </label>
                {[
                    {
                        key: "privacy",
                        label: "개인정보 수집 및 이용 동의",
                        required: true,
                        detail: (
                            <div className="bg-off-white p-4 rounded-2xl text-xs text-gray-500 leading-relaxed mt-2 break-words">
                                - 수집 항목: 예약자 이름, 전화번호 등<br />
                                - 이용 목적: 예약 진행 및 확인, 고객 상담 등<br />
                                - 보유 기간: 관련 법령에 따라 일정 기간 보관 후 파기<br />
                                자세한 내용은 <a href="/privacy" className="underline font-bold text-leaf-green-dark" target="_blank" rel="noopener noreferrer">개인정보 처리방침</a>을 참고하세요.
                            </div>
                        )
                    },
                    {
                        key: "cancellation",
                        label: "취소/환불 정책 동의",
                        required: true,
                        detail: (
                            <div className="bg-off-white p-4 rounded-2xl text-xs text-gray-500 leading-relaxed mt-2 break-words">
                                <div className="mb-2">
                                    숙소의 취소 및 환불 정책을 충분히 숙지하신 후 동의해 주세요.<br />
                                    아래 각 정책은 예약 취소 시 적용되는 조건, 환불 가능 여부, 환불 금액 산정 방식 등을 상세히 안내합니다.<br />
                                    예약 확정 이후에는 해당 정책에 따라 취소 및 환불이 처리되며, 일부 시점 이후에는 환불이 불가할 수 있습니다.<br />
                                    <span className="font-bold text-deep-gray">아래 정책을 반드시 확인하시고, 궁금한 점은 고객센터로 문의해 주세요.</span>
                                </div>
                                <ul className="list-disc list-inside space-y-2">
                                    {cancellationPolicy.map((policy, idx) => (
                                        <li key={policy.policyId ?? `policy-${idx}`} className="mb-1">
                                            <strong>{policy.policyName}</strong>:<br />
                                            {policy.detail}<br />
                                            <span className="text-gray-500">
                                                {
                                                    // 정책별 상세 설명 추가
                                                    policy.policyName.includes("무료 취소") ? (
                                                        <>
                                                            무료 취소 가능 기간 내에는 별도의 수수료 없이 예약을 취소하실 수 있습니다. 해당 기간이 경과하면 취소 수수료가 발생할 수 있으니, 반드시 기간을 확인해 주세요.
                                                        </>
                                                    ) : policy.policyName.includes("부분 환불") ? (
                                                        <>
                                                            부분 환불 정책은 체크인 또는 예약 일정에 따라 환불 금액이 달라집니다. 각 시점별 환불 비율 및 조건을 꼼꼼히 확인해 주세요.
                                                        </>
                                                    ) : policy.policyName.includes("환불 불가") ? (
                                                        <>
                                                            본 정책이 적용되는 경우, 예약 취소 시 환불이 불가하오니 신중하게 예약을 진행해 주시기 바랍니다.
                                                        </>
                                                    ) : (
                                                        <>
                                                            상세 환불 조건 및 적용 시점은 숙소별로 상이할 수 있습니다. 각 정책명을 클릭하거나 숙소 안내 페이지를 통해 더욱 자세한 내용을 확인하실 수 있습니다.
                                                        </>
                                                    )
                                                }
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-2">
                                    <span className="font-semibold text-red-500">※ 환불 규정은 숙소 또는 객실별로 다를 수 있으니, 반드시 상세 내용을 확인 후 예약해 주세요.</span>
                                </div>
                            </div>
                        )
                    },
                    {
                        key: "email",
                        label: "결제 정보 이메일 전송 동의",
                        required: false,
                        detail: (
                            <div className="bg-off-white p-4 rounded-2xl text-xs text-gray-500 leading-relaxed mt-2 break-words">
                                - 결제 완료 시, 현재 계정에 등록된 이메일 주소로 결제 내역(예약 정보, 결제 금액 등)이 자동 전송됩니다.<br />
                                - 결제 내역 이메일은 예약 확인 및 증빙 자료로 활용하실 수 있습니다.<br />
                                - 이메일 전송 동의는 선택 사항이며, 동의하지 않으실 경우 결제 내역 이메일이 발송되지 않습니다.<br />
                                - 이메일 주소는 회원 정보에서 확인 및 수정 가능합니다.
                            </div>
                        )
                    }
                ].map(item => (
                    <div key={item.key} className="flex flex-col">
                        <label className="flex items-center cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={agreements[item.key]}
                                onChange={e => setAgreements(prev => ({...prev, [item.key]: e.target.checked}))}
                                className="mr-3 w-4 h-4 shrink-0 accent-leaf-green"
                            />
                            <span className="text-sm text-gray-600 font-medium">
                                {item.label}
                                {item.required
                                    ? <span className="ml-1 text-red-400 font-bold">(필수)</span>
                                    : <span className="ml-1 text-gray-400">(선택)</span>}
                            </span>
                            <button
                                type="button"
                                className="ml-auto p-1 rounded-lg text-gray-400 hover:text-deep-gray hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                                aria-label={`${item.label} ${expanded[item.key] ? "상세 닫기" : "상세 보기"}`}
                                aria-expanded={!!expanded[item.key]}
                                onClick={() => toggleDetail(item.key)}
                            >
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${expanded[item.key] ? "rotate-180" : ""}`}
                                    fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                                </svg>
                            </button>
                        </label>
                        {expanded[item.key] && item.detail}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AgreementSection;
