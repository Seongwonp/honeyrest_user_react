import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import logo from '/images/logo-Photoroom.png';
import Header from "../../components/Header.jsx";
import { FaUserPlus } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import AuthCard from '@/components/ui/AuthCard.jsx';
import { inputClass, labelClass } from '@/components/ui/styles';

const getPasswordStrength = (password) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0 ~ 4
};

const strengthLabels = ["매우 약함", "약함", "보통", "강함", "매우 강함"];

const termsList = [
    {
        key: "termsOfUse",
        label: "이용약관 동의",
        required: true,
        detail: `HoneyRest 서비스 이용과 관련하여 회원은 아래의 약관을 준수해야 합니다.

1. 회원은 서비스 이용 시 관련 법령과 공공질서, 미풍양속을 준수해야 합니다.
2. 타인의 권리를 침해하거나 불법적인 목적의 이용을 금합니다.
3. 회사는 서비스 개선과 보안을 위해 이용 기록을 모니터링할 수 있습니다.
4. 약관을 위반할 경우 서비스 이용이 제한될 수 있습니다.`
    },
    {
        key: "privacyPolicy",
        label: "개인정보 수집 및 이용 동의",
        required: true,
        detail: `회원가입 및 서비스 제공을 위해 아래와 같은 개인정보를 수집·이용합니다.

1. 수집 항목: 이름, 이메일, 비밀번호, 연락처, 생년월일, 성별
2. 이용 목적: 회원 관리, 예약 처리, 고객 상담, 서비스 품질 개선
3. 보관 기간: 회원 탈퇴 시 즉시 파기 (단, 관련 법령에 따라 일정 기간 보관 가능)
4. 권리 안내: 회원은 개인정보 수집 및 이용 동의를 거부할 권리가 있으며, 거부 시 서비스 이용에 제한이 있을 수 있습니다.`
    },
    {
        key: "ageConfirm",
        label: "만 14세 이상입니다",
        required: true,
        detail: `개인정보 보호법 및 관련 규정에 따라 만 14세 미만은 회원가입이 제한됩니다.

1. 만 14세 이상만 회원가입이 가능합니다.
2. 허위로 나이를 기재할 경우 서비스 이용이 제한될 수 있습니다.
3. 법정대리인의 동의 없는 만 14세 미만 가입은 무효 처리됩니다.`
    },
    {
        key: "marketingAgree",
        label: "마케팅 정보 수신 동의",
        required: false,
        detail: `다양한 이벤트 및 혜택 정보를 받아보실 수 있습니다.

1. 수신 항목: 이메일, SMS, 푸시 알림
2. 이용 목적: 할인 정보, 프로모션, 맞춤형 서비스 제공
3. 보관 기간: 동의 철회 시 즉시 파기
4. 동의 철회: 회원은 언제든지 마케팅 수신 동의를 철회할 수 있습니다.`
    }
];

function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
        gender: "",
        profileImageFile: null,
        termsOfUse: false,
        privacyPolicy: false,
        ageConfirm: false,
        marketingAgree: false
    });

    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState({});

    const allChecked = termsList.every(t => form[t.key]);

    const toggleAllTerms = () => {
        const next = !allChecked;
        const update = {};
        termsList.forEach(t => { update[t.key] = next; });
        setForm(prev => ({ ...prev, ...update }));
    };

    const navigate = useNavigate();

    const today = new Date();
    const maxBirthDate = new Date();
    maxBirthDate.setFullYear(today.getFullYear() - 14); // 만 14세 이상
    const minBirthDate = new Date();
    minBirthDate.setFullYear(today.getFullYear() - 100); // 최대 100세

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const toggleDetail = (key) => {
        setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setForm({ ...form, profileImageFile: file });

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 필수 입력값 확인
        if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.phone || !form.birthDate || !form.gender) {
            return setError("모든 필수 항목을 입력해 주세요.");
        }
        if (!form.email.includes("@")) {
            return setError("이메일 형식이 올바르지 않습니다.");
        }
        if (form.password !== form.confirmPassword) {
            return setError("비밀번호가 일치하지 않습니다.");
        }

        // 나이 검증
        const birth = new Date(form.birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        if (
            today.getMonth() < birth.getMonth() ||
            (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())
        ) {
            age--;
        }
        if (age < 14) {
            return setError("만 14세 미만은 회원가입이 불가능합니다.");
        }

        // 필수 약관 동의 확인
        const requiredTerms = termsList.filter(t => t.required).map(t => t.key);
        for (const key of requiredTerms) {
            if (!form[key]) {
                return setError("필수 약관에 모두 동의해 주세요.");
            }
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("phone", form.phone);
        formData.append("birthDate", form.birthDate);
        formData.append("gender", form.gender);
        formData.append("marketingAgree", form.marketingAgree);
        if (form.profileImageFile) {
            formData.append("profileImage", form.profileImageFile);
        }

        try {
            await api.post("/api/auth/signup", formData);
            localStorage.setItem('signupEmail', form.email);
            navigate("/verify-email", { state: { email: form.email } });
        } catch (err) {
            setError(err.response?.data?.message || "회원가입 실패");
        }
    };

    // 비밀번호 강도 (0 ~ 4)
    const strength = getPasswordStrength(form.password);
    const required = <span className="text-red-400 ml-0.5" aria-hidden="true">*</span>;

    return (
        <>
            <Header />
            <AuthCard
                logo={logo}
                eyebrow="Join HoneyRest"
                title="HoneyRest 회원가입"
                description="달콤한 휴식을 위한 첫 걸음을 시작해 보세요."
                maxWidth="max-w-md md:max-w-xl"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 기본 정보 입력 */}
                    <Input label={<>이름{required}</>} name="name" placeholder="이름" value={form.name} onChange={handleChange} autoComplete="name" />

                    <Input label={<>이메일{required}</>} name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} autoComplete="email" />

                    <div>
                        <Input label={<>비밀번호{required}</>} name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} autoComplete="new-password" />
                        {/* Password requirements */}
                        <ul className="mt-2 list-disc pl-5 space-y-0.5 text-xs text-gray-400">
                            <li>8자 이상 20자 이하로 입력해주세요.</li>
                            <li>영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합이 권장됩니다.</li>
                            <li>보안을 위해 가능한 한 긴 비밀번호를 사용하는 것이 좋습니다.</li>
                        </ul>
                        {form.password && (
                            <div className="space-y-1.5 text-xs text-gray-500 mt-3" aria-live="polite">
                                <div className="font-bold">
                                    비밀번호 강도:{' '}
                                    <span className={
                                        strength >= 3 ? 'text-leaf-green-dark' :
                                        strength === 2 ? 'text-honey-yellow-dark' :
                                        'text-red-500'
                                    }>
                                        {strengthLabels[strength]}
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full rounded-full transition-all duration-300 ${
                                            strength === 1
                                                ? 'bg-red-400 w-1/5'
                                                : strength === 2
                                                    ? 'bg-honey-yellow w-2/5'
                                                    : strength === 3
                                                        ? 'bg-leaf-green w-3/5'
                                                        : strength === 4
                                                            ? 'bg-leaf-green-dark w-full'
                                                            : 'w-0'
                                        }`}
                                    />
                                </div>
                                <p className="text-gray-400">
                                    {strength === 0 ? '' :
                                     strength === 1 ? '비밀번호가 너무 짧습니다.' :
                                     strength === 2 ? '최소 기준은 충족했지만 보안에 취약할 수 있습니다.' :
                                     strength === 3 ? '일반적인 보안 수준입니다.' :
                                     '안전한 비밀번호입니다.'}
                                </p>
                            </div>
                        )}
                    </div>

                    <Input label={<>비밀번호 확인{required}</>} name="confirmPassword" type="password" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />

                    <Input label={<>전화번호{required}</>} name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} autoComplete="tel" />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label={<>생년월일{required}</>}
                            name="birthDate"
                            type="date"
                            value={form.birthDate}
                            onChange={handleChange}
                            min={minBirthDate.toISOString().split("T")[0]}
                            max={maxBirthDate.toISOString().split("T")[0]}
                        />

                        <div className="min-w-0">
                            <label htmlFor="signup-gender" className={labelClass}>성별{required}</label>
                            <select id="signup-gender" name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
                                <option value="">성별 선택</option>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>
                        </div>
                    </div>

                    {/* 프로필 이미지 */}
                    <div>
                        <label htmlFor="signup-profile" className={labelClass}>프로필 사진</label>
                        <div className="flex items-center gap-4">
                            {preview && <img src={preview} alt="미리보기" className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-honey-yellow/20" />}
                            <input
                                id="signup-profile"
                                type="file"
                                accept="image/*"
                                onChange={handleImageSelect}
                                className="block w-full min-w-0 text-sm text-gray-500 file:mr-3 file:rounded-xl file:border-0 file:bg-honey-yellow/10 file:px-4 file:py-2 file:text-sm file:font-bold file:text-honey-yellow-dark hover:file:bg-honey-yellow/20"
                            />
                        </div>
                    </div>

                    {/* 약관 동의 */}
                    <div className="pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-deep-gray">약관 동의</h3>
                            <label className="flex items-center gap-2 text-sm font-bold text-gray-500 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={allChecked}
                                    onChange={toggleAllTerms}
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
                                            onChange={handleChange}
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

                    {/* 에러 메시지 */}
                    {error && (
                        <div role="alert" className="text-sm font-bold text-red-500 bg-red-50 rounded-2xl px-4 py-3">
                            {error}
                        </div>
                    )}

                    {/* 제출 버튼 */}
                    <Button type="submit" size="lg" fullWidth className="mt-2">
                        <FaUserPlus />
                        회원가입
                    </Button>
                </form>

                {/* 로그인 안내 */}
                <p className="mt-8 text-sm text-center text-gray-400">
                    이미 계정이 있으신가요?{" "}
                    <Link
                        to="/login"
                        className="font-black text-honey-yellow-dark hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-honey-yellow/40"
                    >
                        로그인
                    </Link>
                </p>
            </AuthCard>
        </>
    );
}

export default Signup;
