// provider 는 authStorage 에서 대문자로 정규화해 저장한다.
// 컴포넌트에서는 문자열을 직접 비교하지 말고 아래 함수를 쓴다.

export const PROVIDERS = Object.freeze({
    LOCAL: 'LOCAL',
    KAKAO: 'KAKAO',
    GOOGLE: 'GOOGLE',
});

// "kakao", "local" 등 → 대문자 (없으면 null)
export const normalizeProvider = (provider) =>
    typeof provider === 'string' && provider.trim() ? provider.trim().toUpperCase() : null;

const providerOf = (user) => normalizeProvider(user?.provider);

export const isKakaoUser = (user) => providerOf(user) === PROVIDERS.KAKAO;

export const isGoogleUser = (user) => providerOf(user) === PROVIDERS.GOOGLE;

export const isSocialUser = (user) => isKakaoUser(user) || isGoogleUser(user);

export const getProviderLabel = (user) => {
    const provider = providerOf(user);
    if (!provider) return '알 수 없음';
    return provider === PROVIDERS.LOCAL ? '일반 회원' : provider;
};
