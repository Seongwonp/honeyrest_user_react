import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import api from "@/api/axios";
import logo from '/images/logo-Photoroom.png';
import Header from "../../components/Header.jsx";
import { FaUserPlus } from 'react-icons/fa';
import { FiChevronDown } from 'react-icons/fi';

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
            const res = await api.post("/api/auth/signup", formData);
            console.log("회원가입 성공:", res.data);
            localStorage.setItem('signupEmail', form.email);
            navigate("/verify-email", { state: { email: form.email } });
        } catch (err) {
            setError(err.response?.data?.message || "회원가입 실패");
        }
    };

    return (
        <>
            <Header />
            <div className="bg-white min-h-screen flex flex-col">
                <div className="flex-grow flex items-start justify-center pt-20 px-4">
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md md:max-w-xl lg:max-w-2xl overflow-hidden" data-aos="zoom-in">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="logo" className="h-16" />
                        </div>

                        <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
                            HoneyRest 회원가입 ✨
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* 기본 정보 입력 */}
                            <label className="block text-sm font-medium text-gray-700">이름<span className="text-red-500">*</span></label>
                            <input name="name" placeholder="이름" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">이메일<span className="text-red-500">*</span></label>
                            <input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">비밀번호<span className="text-red-500">*</span></label>
                            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            {/* Password requirements */}
                            <div className="mt-2 mb-1 text-xs text-gray-500">
                              <ul className="list-disc pl-5 space-y-0.5">
                                <li>8자 이상 20자 이하로 입력해주세요.</li>
                                <li>영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합이 권장됩니다.</li>
                                <li>보안을 위해 가능한 한 긴 비밀번호를 사용하는 것이 좋습니다.</li>
                              </ul>
                            </div>
                            <br/>
                            {form.password && (
                                <div className="space-y-1 text-sm text-gray-600 mt-2">
                                    <div>
                                        비밀번호 강도:{' '}
                                        <span className={
                                            getPasswordStrength(form.password) === 4 ? 'text-green-600' :
                                            getPasswordStrength(form.password) === 3 ? 'text-lime-500' :
                                            getPasswordStrength(form.password) === 2 ? 'text-yellow-500' :
                                            getPasswordStrength(form.password) === 1 ? 'text-orange-500' :
                                            'text-red-500'
                                        }>
                                            {strengthLabels[getPasswordStrength(form.password)]}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 ${
                                                getPasswordStrength(form.password) === 1
                                                    ? 'bg-red-500 w-1/5'
                                                    : getPasswordStrength(form.password) === 2
                                                        ? 'bg-orange-500 w-2/5'
                                                        : getPasswordStrength(form.password) === 3
                                                            ? 'bg-yellow-500 w-3/5'
                                                            : getPasswordStrength(form.password) === 4
                                                                ? 'bg-lime-500 w-full'
                                                                : getPasswordStrength(form.password) === 5
                                                                    ? 'bg-green-500 w-full'
                                                                    : 'w-0'
                                            }`}
                                        />
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        {getPasswordStrength(form.password) === 0 ? '' :
                                         getPasswordStrength(form.password) === 1 ? '비밀번호가 너무 짧습니다.' :
                                         getPasswordStrength(form.password) === 2 ? '최소 기준은 충족했지만 보안에 취약할 수 있습니다.' :
                                         getPasswordStrength(form.password) === 3 ? '일반적인 보안 수준입니다.' :
                                         getPasswordStrength(form.password) === 4 ? '안전한 비밀번호입니다.' :
                                         '매우 안전한 비밀번호입니다.'}
                                    </p>
                                </div>
                            )}

                            <label className="block text-sm font-medium text-gray-700">비밀번호 확인<span className="text-red-500">*</span></label>
                            <input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">전화번호<span className="text-red-500">*</span></label>
                            <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">생년월일<span className="text-red-500">*</span></label>
                            <input
                              name="birthDate"
                              type="date"
                              value={form.birthDate}
                              onChange={handleChange}
                              min={minBirthDate.toISOString().split("T")[0]}
                              max={maxBirthDate.toISOString().split("T")[0]}
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            />

                            <label className="block text-sm font-medium text-gray-700">성별<span className="text-red-500">*</span></label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                <option value="">성별 선택</option>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>

                            {/* 프로필 이미지 */}
                            <label className="block text-sm font-medium text-gray-700">프로필 사진</label>
                            <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            {preview && <img src={preview} alt="미리보기" className="mt-2 h-24 w-24 rounded-full object-cover mx-auto" />}

                            {/* 약관 동의 (modernized) */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-gray-900">약관 동의</h3>
                                    <label className="flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={allChecked}
                                            onChange={toggleAllTerms}
                                        />
                                        전체 동의
                                    </label>
                                </div>

                                <div className="mt-3 rounded-xl bg-gray-50 p-2">
                                    {termsList.map((term) => (
                                        <div key={term.key} className="rounded-lg p-3 hover:bg-white transition">
                                            <div className="flex items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    name={term.key}
                                                    checked={form[term.key]}
                                                    onChange={handleChange}
                                                    className="mt-0.5"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-gray-900">{term.label}</span>
                                                        <span
                                                            className={`text-[10px] px-2 py-0.5 rounded-full ${
                                                                term.required
                                                                    ? "bg-red-50 text-red-600 border border-red-200"
                                                                    : "bg-yellow-50 text-yellow-700 border border-yellow-200"
                                                            }`}
                                                        >
                                                            {term.required ? "필수" : "선택"}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button
                                                    type="button"
                                                    aria-label="약관 상세 보기"
                                                    aria-expanded={!!expanded[term.key]}
                                                    onClick={() => toggleDetail(term.key)}
                                                    className="ml-2 p-1 rounded-md hover:bg-gray-100"
                                                >
                                                    <FiChevronDown
                                                        className={`h-5 w-5 transition-transform ${
                                                            expanded[term.key] ? "rotate-180" : ""
                                                        }`}
                                                    />
                                                </button>
                                            </div>

                                            {expanded[term.key] && (
                                                <div className="pl-8 pr-3 pt-2 text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                                                    {term.detail}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* 에러 메시지 */}
                            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                            {/* 제출 버튼 */}
                            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2 mt-4">
                                <FaUserPlus />
                                회원가입
                            </button>
                        </form>

                        {/* 로그인 안내 */}
                        <p className="mt-6 text-sm text-center text-gray-600">
                            이미 계정이 있으신가요?{" "}
                            <span className="text-yellow-600 hover:underline cursor-pointer" onClick={() => navigate("/login")}>
                로그인
              </span>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Signup;
