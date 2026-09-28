import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import api from "@/api/axios";
import logo from '/images/logo-Photoroom.png';
import Header from "../../components/Header.jsx";
import { FaUserPlus } from 'react-icons/fa';
import Input from '@/components/ui/Input.jsx';
import Button from '@/components/ui/Button.jsx';
import AuthCard from '@/components/ui/AuthCard.jsx';
import { inputClass, labelClass } from '@/components/ui/styles';
import PasswordStrengthMeter from './sections/PasswordStrengthMeter.jsx';
import TermsAgreement from './sections/TermsAgreement.jsx';
import { termsList } from './sections/signupTerms';

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
                        <PasswordStrengthMeter password={form.password} />
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

                    <TermsAgreement
                        form={form}
                        onChange={handleChange}
                        allChecked={allChecked}
                        onToggleAll={toggleAllTerms}
                        expanded={expanded}
                        toggleDetail={toggleDetail}
                    />

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
