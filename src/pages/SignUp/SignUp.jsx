import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import logo from '/src/assets/images/logo-Photoroom.png';
import Header from "../../components/Header.jsx";
import { FaUserPlus } from 'react-icons/fa';

function Signup() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        birthDate: "",
        gender: "",
        marketingAgree: false,
        profileImageFile: null
    });
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value
        });
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

        // 유효성 검사
        if (!form.name || !form.email || !form.password || !form.confirmPassword || !form.phone || !form.birthDate || !form.gender || !form.profileImageFile) {
            return setError("모든 필수 항목을 입력해 주세요.");
        }
        if (!form.email.includes("@")) {
            return setError("이메일 형식이 올바르지 않습니다.");
        }
        if (form.password !== form.confirmPassword) {
            return setError("비밀번호가 일치하지 않습니다.");
        }

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("email", form.email);
        formData.append("password", form.password);
        formData.append("phone", form.phone);
        formData.append("birthDate", form.birthDate);
        formData.append("gender", form.gender);
        formData.append("marketingAgree", form.marketingAgree);
        formData.append("profileImage", form.profileImageFile);

        try {
            const res = await axios.post("/api/auth/signup", formData);

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
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-8 w-full max-w-md overflow-hidden" data-aos="zoom-in">
                        <div className="flex justify-center mb-6">
                            <img src={logo} alt="logo" className="h-16" />
                        </div>

                        <h2 className="text-xl font-medium text-gray-800 mb-6 text-center">
                            HoneyRest 회원가입 ✨
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <label className="block text-sm font-medium text-gray-700">이름<span className="text-red-500">*</span></label>
                            <input name="name" placeholder="이름" value={form.name} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">이메일<span className="text-red-500">*</span></label>
                            <input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">비밀번호<span className="text-red-500">*</span></label>
                            <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">비밀번호 확인<span className="text-red-500">*</span></label>
                            <input name="confirmPassword" type="password" placeholder="비밀번호 확인" value={form.confirmPassword} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">전화번호<span className="text-red-500">*</span></label>
                            <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">생년월일<span className="text-red-500">*</span></label>
                            <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md" />

                            <label className="block text-sm font-medium text-gray-700">성별<span className="text-red-500">*</span></label>
                            <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md">
                                <option value="">성별 선택</option>
                                <option value="MALE">남성</option>
                                <option value="FEMALE">여성</option>
                            </select>

                            <label className="block text-sm font-medium text-gray-700">프로필 사진<span className="text-red-500">*</span></label>
                            <input type="file" accept="image/*" onChange={handleImageSelect} className="w-full px-4 py-2 border border-gray-300 rounded-md" />
                            {preview && <img src={preview} alt="미리보기" className="mt-2 h-24 w-24 rounded-full object-cover mx-auto" />}

                            <label className="flex items-center gap-2 text-sm text-gray-700">
                                <input type="checkbox" name="marketingAgree" checked={form.marketingAgree} onChange={handleChange} />
                                마케팅 정보 수신에 동의합니다
                            </label>

                            {error && <div className="text-red-500 text-sm">{error}</div>}

                            <button type="submit" className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-medium py-2 rounded-lg flex items-center justify-center gap-2">
                                <FaUserPlus />
                                회원가입
                            </button>
                        </form>

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