// 사용자 API 의 e2e 프로필 전용 보조 엔드포인트(/e2e/**) 호출.
// 이 엔드포인트는 @Profile("e2e") 컨트롤러에만 있어 다른 프로필에는 존재하지 않는다.
import { expect } from '@playwright/test';

export const API_URL = process.env.E2E_API_URL || 'http://localhost:8080';

/** 가입 인증 메일 대신: 해당 이메일의 가장 최근 가입 인증 토큰 */
export async function fetchVerificationToken(request, email) {
    const res = await request.get(`${API_URL}/e2e/verification-token`, { params: { email } });
    expect(res.ok(), `인증 토큰 조회 실패 (${res.status()})`).toBeTruthy();
    const body = await res.json();
    return body.token;
}

/** 호스트/체크아웃 처리 대신: 예약을 이용 완료(COMPLETED)로 전환 */
export async function completeReservation(request, reservationId) {
    const res = await request.post(`${API_URL}/e2e/reservations/${reservationId}/complete`);
    expect(res.ok(), `예약 완료 처리 실패 (${res.status()})`).toBeTruthy();
    return res.json();
}

/** 토스 스텁에 기록된 결제 취소(보상) 요청 목록 */
export async function fetchTossCancellations(request) {
    const res = await request.get(`${API_URL}/e2e/toss/cancellations`);
    expect(res.ok()).toBeTruthy();
    return res.json();
}
