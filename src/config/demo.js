// Render 데모 전용 (VITE_DEMO=true). 빌드 시 상수 치환이라 운영 번들에는 이 코드가 남지 않는다.
// 데모 계정은 API 의 db/demo-seed.sql 과 맞춘다 (공개용 계정)

export const IS_DEMO = import.meta.env.VITE_DEMO === "true";

export const DEMO_ACCOUNT = {
    email: "demo@honeyrest.app",
    password: "Demo1234!",
};
