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

// 비밀번호 강도 표시 (입력값이 있을 때만 렌더링)
function PasswordStrengthMeter({ password }) {
    // 비밀번호 강도 (0 ~ 4)
    const strength = getPasswordStrength(password);

    if (!password) return null;

    return (
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
    );
}

export default PasswordStrengthMeter;
