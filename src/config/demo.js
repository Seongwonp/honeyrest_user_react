// 데모 배포 전용 설정 (Render 무료 데모: honeyRest_user 저장소의 Dockerfile.render 가 VITE_DEMO=true 로 빌드)
//
// - VITE_DEMO === 'true' 일 때만 데모 배너, 로그인 화면의 데모 계정 버튼, 결제 화면의 "테스트 결제(데모)" 버튼이 나온다.
// - 빌드 시 상수로 치환되므로 VITE_DEMO 가 없는 개발/운영 번들에서는 IS_DEMO 분기와 아래 계정 문자열이 통째로 제거된다
//   (운영 이미지 빌드가 dist 에서 data-testid="demo-*" 흔적을 검사해 남아 있으면 실패시킨다).
// - 데모 계정은 사용자 API 의 db/demo-seed.sql 과 같아야 한다. 버리는 용도의 공개 데모 계정이라 노출해도 된다.

export const IS_DEMO = import.meta.env.VITE_DEMO === "true";

export const DEMO_ACCOUNT = {
    email: "demo@honeyrest.app",
    password: "Demo1234!",
};
