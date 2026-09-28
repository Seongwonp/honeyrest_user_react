import { FiChevronDown } from 'react-icons/fi';
import { termsList } from './signupTerms';

// 약관 동의 (전체 동의 + 항목별 체크/상세 펼치기). 체크 값(form)과 펼침 상태(expanded)는 부모가 소유
function TermsAgreement({ form, onChange, allChecked, onToggleAll, expanded, toggleDetail }) {
    return (
        <div className="pt-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-deep-gray">약관 동의</h3>
                <label className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={allChecked}
                        onChange={onToggleAll}
                        className="w-4 h-4 accent-leaf-green"
                    />
                    전체 동의
                </label>
            </div>

            <div className="mt-3 rounded-3xl bg-off-white p-2">
                {termsList.map((term) => (
                    <div key={term.key} className="rounded-2xl p-3 hover:bg-white transition-colors">
                        <div className="flex items-start gap-3">
                            <input
                                id={`signup-term-${term.key}`}
                                type="checkbox"
                                name={term.key}
                                checked={form[term.key]}
                                onChange={onChange}
                                className="mt-0.5 w-4 h-4 shrink-0 accent-leaf-green"
                            />
                            <label htmlFor={`signup-term-${term.key}`} className="flex-1 min-w-0 flex flex-wrap items-center gap-2 cursor-pointer">
                                <span className="text-sm font-medium text-deep-gray break-keep">{term.label}</span>
                                <span
                                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                                        term.required
                                            ? "bg-red-50 text-red-500"
                                            : "bg-honey-yellow/15 text-honey-yellow-dark"
                                    }`}
                                >
                                    {term.required ? "필수" : "선택"}
                                </span>
                            </label>
                            <button
                                type="button"
                                aria-label={`${term.label} 상세 보기`}
                                aria-expanded={!!expanded[term.key]}
                                onClick={() => toggleDetail(term.key)}
                                className="p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-deep-gray focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                            >
                                <FiChevronDown
                                    className={`h-5 w-5 transition-transform ${
                                        expanded[term.key] ? "rotate-180" : ""
                                    }`}
                                />
                            </button>
                        </div>

                        {expanded[term.key] && (
                            <div className="pl-7 pr-3 pt-2 text-xs text-gray-500 leading-relaxed whitespace-pre-line break-words">
                                {term.detail}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TermsAgreement;
