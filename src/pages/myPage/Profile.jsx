import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import useApiRequest from "@/api/useApiRequest";
import PasswordVerifyModal from "@/components/PasswordVerifyModal";
import {
    FaUserAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaCamera,
    FaEdit,
    FaSave
} from "react-icons/fa";

export default function Profile() {
    const { user, loadUser } = useAuth();
    const { request, isLoading } = useApiRequest();

    const isSocialLogin =
        user?.provider === "kakao" || user?.provider === "google";

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [originalEmail, setOriginalEmail] = useState("");
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: ""
    });

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                phone: user.phone || "",
                email: user.email || ""
            });
            setOriginalEmail(user.email || "");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            if (form.email !== originalEmail) {
                await request(
                    {
                        method: "POST",
                        url: "/api/user/request-email-change",
                        data: { newEmail: form.email }
                    },
                    {
                        label: "emailChangeRequest",
                        successMessage: "입력하신 이메일로 인증 메일을 보냈습니다!",
                        onSuccess: () => {
                            setIsEditing(false);
                            loadUser();
                        }
                    }
                );
                return;
            }

            await request(
                {
                    method: "PUT",
                    url: "/api/user/profile",
                    data: form
                },
                {
                    label: "profileUpdate",
                    successMessage: "회원 정보가 수정되었습니다!",
                    onSuccess: () => {
                        loadUser();
                        setIsEditing(false);
                    }
                }
            );
        } catch (err) {
            console.error("프로필 수정 실패:", err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">👤 내 정보</h2>

            {/* 프로필 상단 */}
            <div className="flex items-center gap-4 mb-8">
                <div className="relative">
                    <img
                        src={user?.profileImage || "/default-profile.png"}
                        alt="프로필 이미지"
                        className="w-20 h-20 rounded-full object-cover border"
                    />
                    {!isSocialLogin && (
                        <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow hover:bg-gray-100">
                            <FaCamera className="text-gray-600 text-sm" />
                        </button>
                    )}
                </div>
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{user?.name}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <p className="text-xs text-gray-400">
                        로그인 방식: {user?.provider === "local" ? "일반 회원" : user?.provider.toUpperCase()}
                    </p>
                </div>
            </div>

            {/* 수정/보기 폼 */}
            <div className="space-y-6">
                {[
                    { label: "이름", name: "name", icon: <FaUserAlt /> },
                    { label: "연락처", name: "phone", icon: <FaPhoneAlt /> },
                    { label: "이메일", name: "email", icon: <FaEnvelope /> }
                ].map(({ label, name, icon }) => (
                    <div key={name}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <div className="flex items-center gap-2">
                                {icon}
                                {label}
                            </div>
                        </label>
                        {isEditing ? (
                            <input
                                type="text"
                                name={name}
                                value={form[name]}
                                onChange={handleChange}
                                disabled={isSocialLogin}
                                className={`w-full border px-4 py-2 rounded ${
                                    isSocialLogin
                                        ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                        : "focus:ring-2 focus:ring-yellow-300"
                                }`}
                            />
                        ) : (
                            <div className="w-full border px-4 py-2 rounded bg-gray-50 text-gray-800">
                                {form[name] || "정보 없음"}
                            </div>
                        )}
                    </div>
                ))}

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-3 pt-4">
                    {!isSocialLogin && (
                        isEditing ? (
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading("profileUpdate") || isLoading("emailChangeRequest")}
                                className={`flex items-center gap-2 px-4 py-2 rounded font-semibold ${
                                    isLoading("profileUpdate") || isLoading("emailChangeRequest")
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-yellow-400 hover:bg-yellow-500 text-white"
                                }`}
                            >
                                <FaSave />
                                {isLoading("profileUpdate") || isLoading("emailChangeRequest")
                                    ? "처리 중..."
                                    : "저장하기"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setShowPasswordModal(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded font-semibold bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <FaEdit />
                                수정하기
                            </button>
                        )
                    )}
                </div>
            </div>

            {/* 비밀번호 인증 모달 */}
            {showPasswordModal && (
                <PasswordVerifyModal
                    onSuccess={() => setIsEditing(true)}
                    onClose={() => setShowPasswordModal(false)}
                />
            )}
        </div>
    );
}