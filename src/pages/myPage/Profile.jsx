import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";
import useApiRequest from "@/api/useApiRequest";
import PasswordVerifyModal from "@/components/PasswordVerifyModal";
import PasswordChangeModal from "@/pages/myPage/PasswordChangeModal.jsx";
import Swal from 'sweetalert2';
import {
    FaUserAlt, FaPhoneAlt, FaEnvelope, FaCamera, FaEdit,
    FaSave, FaLock, FaTrashAlt
} from "react-icons/fa";

export default function Profile() {
    const { user, syncUserFromServer } = useAuth();
    const { request, isLoading } = useApiRequest();

    const isSocialLogin = user?.provider === "KAKAO" || user?.provider === "GOOGLE";

    const [isEditing, setIsEditing] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [form, setForm] = useState({ name: "", phone: "", email: "" });
    const [additionalInfo, setAdditionalInfo] = useState({ point: 0, isVerified: false, createdAt: "" });
    const [originalEmail, setOriginalEmail] = useState("");
    const [pendingAccountDeletion, setPendingAccountDeletion] = useState(false);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await request({ method: "GET", url: "/api/user/info" }, { label: "fetchUserInfo" });
                if (response) {
                    setForm({
                        name: response.name || "",
                        phone: response.phone || "",
                        email: response.email || ""
                    });
                    setOriginalEmail(response.email || "");
                    setAdditionalInfo({
                        point: response.point || 0,
                        isVerified: response.isVerified || false,
                        createdAt: response.createdAt || ""
                    });
                }
            } catch (err) {
                console.error("유저 정보 불러오기 실패:", err);
                toast.error("유저 정보를 불러오는 중 오류가 발생했습니다.");
            }
        };
        fetchUserInfo();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const isEmailChanged = form.email !== originalEmail;

            if (isEmailChanged) {
                await request(
                    { method: "POST", url: "/api/user/request-email-change", data: { newEmail: form.email, isPasswordVerified: isVerified } },
                    { label: "emailChangeRequest", successMessage: "입력하신 이메일로 인증 메일을 보냈습니다!" }
                );
            }

            await request(
                { method: "PUT", url: "/api/user/profile", data: { name: form.name, phone: form.phone, email: form.email, isPasswordVerified: isVerified } },
                {
                    label: "profileUpdate",
                    successMessage: isEmailChanged ? undefined : "회원 정보가 수정되었습니다!",
                    onSuccess: () => {
                        setIsEditing(false);
                        setIsVerified(false);
                        syncUserFromServer();
                    }
                }
            );
        } catch (err) {
            console.error("프로필 수정 실패:", err);
            toast.error("회원 정보 수정 중 오류가 발생했습니다.");
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("profileImage", file);

        try {
            await request(
                { method: "POST", url: "/api/user/profile-image", data: formData, headers: { "Content-Type": "multipart/form-data" } },
                {
                    label: "profileImageUpload",
                    successMessage: "프로필 이미지가 변경되었습니다!",
                    onSuccess: () => syncUserFromServer()
                }
            );
        } catch (err) {
            console.error("프로필 이미지 업로드 실패:", err);
            toast.error("이미지 업로드에 실패했습니다.");
        }
    };

    const handleAccountDeletion = async () => {
        try {
            await request({ method: "DELETE", url: "/api/user/delete-account" }, { label: "accountDeletion" });
            localStorage.clear();
            sessionStorage.clear();
            await Swal.fire('탈퇴 완료', '회원 탈퇴가 정상적으로 처리되었습니다.', 'success');
            window.location.href = "/login";
        } catch (err) {
            console.error("회원 탈퇴 실패:", err);
            toast.error("회원 탈퇴 중 오류가 발생했습니다.");
        }
    };

    const onDeleteClick = () => {
        setPendingAccountDeletion(true);
        setShowPasswordModal(true);
    };

    const onPasswordVerifiedForDeletion = async (verified) => {
        setShowPasswordModal(false);
        setIsVerified(verified);
        if (verified && pendingAccountDeletion) {
            setPendingAccountDeletion(false);
            await handleAccountDeletion();
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* 타이틀 + 탈퇴 버튼 */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-extrabold text-gray-900">👤 내 정보</h2>
                <button
                    onClick={onDeleteClick}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 text-white text-xs rounded-md hover:bg-gray-800 transition"
                    aria-label="회원 탈퇴"
                    title="회원 탈퇴 시 모든 정보가 삭제됩니다"
                >
                    <FaTrashAlt className="text-sm" />
                    탈퇴
                </button>
            </div>

            <div className="bg-white shadow-lg rounded-xl p-6 flex flex-col md:flex-row gap-8">
                {/* 프로필 이미지 */}
                <div className="flex flex-col items-center md:items-start md:w-1/3">
                    <div className="relative">
                        <img
                            src={user?.profileImage || "/default-profile.png"}
                            alt="프로필"
                            className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400 shadow-md"
                        />
                        {!isSocialLogin && (
                            <>
                                <button
                                    onClick={() => document.getElementById("profileImageInput").click()}
                                    className="absolute bottom-0 right-0 bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded-full shadow-lg transition"
                                >
                                    <FaCamera className="text-base" />
                                </button>
                                <input
                                    type="file"
                                    id="profileImageInput"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </>
                        )}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-gray-800">{form.name || user?.name}</h3>
                    <p className="text-gray-600 mt-1 text-sm">{form.email || user?.email}</p>
                    <p className="text-xs text-gray-400 mt-2">로그인 방식: <span className="font-medium">{user?.provider === "local" ? "일반 회원" : user?.provider?.toUpperCase() || "알 수 없음"}</span></p>
                </div>

                {/* 상세 정보 */}
                <div className="flex-1 flex flex-col justify-between">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                            { label: "이름", name: "name", icon: <FaUserAlt className="text-yellow-500" /> },
                            { label: "연락처", name: "phone", icon: <FaPhoneAlt className="text-yellow-500" /> },
                            { label: "이메일", name: "email", icon: <FaEnvelope className="text-yellow-500" /> }
                        ].map(({ label, name, icon }) => (
                            <div key={name} className="flex flex-col">
                                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-1">
                                    {icon}
                                    <span>{label}</span>
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name={name}
                                        value={form[name]}
                                        onChange={handleChange}
                                        disabled={isSocialLogin}
                                        className="w-full rounded-md border px-4 py-2 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                                        placeholder="정보를 입력하세요"
                                    />
                                ) : (
                                    <div className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-2 text-gray-700 min-h-[38px] flex items-center">
                                        {form[name] || "정보 없음"}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* 추가 정보 섹션 */}
                    <div className="mt-6 bg-yellow-50 rounded-lg p-4 shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-800 font-semibold">
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-600 font-bold">포인트:</span>
                            <span className="text-yellow-800">{additionalInfo.point}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-600 font-bold">이메일 인증:</span>
                            {additionalInfo.isVerified ? (
                                <span className="text-green-600 bg-green-100 rounded-full px-3 py-1 text-xs font-medium">인증 완료</span>
                            ) : (
                                <span className="text-red-600 bg-red-100 rounded-full px-3 py-1 text-xs font-medium">미인증</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-yellow-600 font-bold">가입일:</span>
                            <span className="text-yellow-800">{additionalInfo.createdAt ? new Date(additionalInfo.createdAt).toLocaleDateString() : "정보 없음"}</span>
                        </div>
                    </div>

                    {/* 버튼 그룹 */}
                    <div className="mt-6 flex flex-wrap justify-end gap-3">
                        {!isSocialLogin && (
                            <button
                                onClick={() => setShowPasswordChange(true)}
                                className="flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-white text-sm font-semibold shadow hover:bg-red-700 transition"
                                type="button"
                            >
                                <FaLock />
                                비밀번호 변경
                            </button>
                        )}

                        {!isSocialLogin && (
                            isEditing ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading("profileUpdate") || isLoading("emailChangeRequest")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold shadow transition ${
                                        isLoading("profileUpdate") || isLoading("emailChangeRequest")
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : "bg-yellow-400 hover:bg-yellow-500 text-white"
                                    }`}
                                    type="button"
                                >
                                    <FaSave />
                                    {isLoading("profileUpdate") || isLoading("emailChangeRequest") ? "처리 중..." : "저장하기"}
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowPasswordModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white text-sm font-semibold shadow hover:bg-blue-700 transition"
                                    type="button"
                                >
                                    <FaEdit />
                                    수정하기
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>

            {/* 모달들 */}
            {showPasswordModal && (
                <PasswordVerifyModal
                    onSuccess={(verified) => {
                        if (pendingAccountDeletion) {
                            onPasswordVerifiedForDeletion(verified);
                        } else {
                            setIsVerified(verified);
                            setShowPasswordModal(false);
                        }
                    }}
                    onClose={() => {
                        setShowPasswordModal(false);
                        setPendingAccountDeletion(false);
                    }}
                />
            )}
            {showPasswordChange && (
                <PasswordChangeModal
                    isOpen={showPasswordChange}
                    onClose={() => setShowPasswordChange(false)}
                    onSuccess={() => {
                        toast.success("비밀번호가 변경되었습니다!");
                        setShowPasswordChange(false);
                    }}
                />
            )}
        </div>
    );
}