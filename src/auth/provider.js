// 로그인 제공자(provider) 표기 규칙
// - 서버 UserInfoDTO 는 소셜 타입을 대문자("KAKAO", "GOOGLE"), 일반 가입은 "local" 로 내려준다.
// - 프론트는 저장소 경계(authStorage)에서 항상 대문자 한 가지 형태로 정규화해 저장하고,
//   컴포넌트는 문자열을 직접 비교하지 말고 아래 도우미 함수를 사용한다.

export const PROVIDERS = Object.freeze({
    LOCAL: 'LOCAL',
    KAKAO: 'KAKAO',
    GOOGLE: 'GOOGLE',
});

// 임의의 표기("kakao", "Kakao", "local" 등)를 대문자 정규형으로 변환 (값이 없으면 null)
export const normalizeProvider = (provider) =>
    typeof provider === 'string' && provider.trim() ? provider.trim().toUpperCase() : null;

const providerOf = (user) => normalizeProvider(user?.provider);

export const isKakaoUser = (user) => providerOf(user) === PROVIDERS.KAKAO;

export const isGoogleUser = (user) => providerOf(user) === PROVIDERS.GOOGLE;

// 소셜 로그인 회원 여부 (프로필 이미지·비밀번호 변경 등 제한에 사용)
export const isSocialUser = (user) => isKakaoUser(user) || isGoogleUser(user);

// 화면 표시용 제공자 이름
export const getProviderLabel = (user) => {
    const provider = providerOf(user);
    if (!provider) return '알 수 없음';
    return provider === PROVIDERS.LOCAL ? '일반 회원' : provider;
};
