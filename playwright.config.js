// Playwright E2E 설정 — 사용자 여정 테스트 (e2e/)
//
// webServer 로 두 서버를 함께 띄운다.
//   1) 사용자 API (Spring Boot, e2e 프로필): H2 인메모리 DB + 시드, 인메모리 Redis, 메일 미발송, 토스 결제 스텁
//      위치는 E2E_API_DIR (기본: 이 저장소 옆의 ../honeyRest_user)
//   2) 프론트 개발 서버 (npm run dev, 5173): VITE_E2E=true 로 결제 페이지의 "테스트 결제" 버튼 활성화
//
// 포트는 백엔드 CORS 허용 출처(http://localhost:5173)와 맞추기 위해 5173 / 8080 을 쓴다.
// 매 실행마다 새 DB 로 시작해야 결과가 결정적이므로 기본적으로 이미 떠 있는 서버를 재사용하지 않는다
// (E2E_REUSE_SERVER=1 이면 재사용 — 이때는 API 를 새로 띄운 직후여야 한다).
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const API_DIR = path.resolve(rootDir, process.env.E2E_API_DIR || '../honeyRest_user');
const API_URL = process.env.E2E_API_URL || 'http://localhost:8080';
const WEB_URL = process.env.E2E_WEB_URL || 'http://localhost:5173';
const reuseExistingServer = process.env.E2E_REUSE_SERVER === '1';

// 설치된 Playwright 와 브라우저 리비전이 맞지 않을 때만 지정 (예: /opt/pw-browsers/chromium-1194/chrome-linux/chrome)
const executablePath = process.env.E2E_CHROMIUM_PATH || undefined;

export default defineConfig({
    testDir: './e2e',
    // 시나리오가 같은 DB 상태(예약·리뷰)를 이어서 쓰므로 직렬 실행한다.
    fullyParallel: false,
    workers: 1,
    forbidOnly: !!process.env.CI,
    retries: 0,
    timeout: 90_000,
    expect: { timeout: 15_000 },
    reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
    outputDir: 'test-results',
    use: {
        baseURL: WEB_URL,
        locale: 'ko-KR',
        // 날짜 계산(e2e/support/dates.js)과 브라우저 달력의 "오늘"을 맞춘다.
        timezoneId: 'Asia/Seoul',
        trace: 'retain-on-failure',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        launchOptions: executablePath ? { executablePath } : {},
    },
    projects: [
        { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    ],
    webServer: [
        {
            // 사용자 API — Gradle 첫 실행은 의존성 다운로드로 오래 걸릴 수 있다.
            command: `./gradlew bootRun --console=plain --args='--spring.profiles.active=e2e'`,
            cwd: API_DIR,
            url: `${API_URL}/actuator/health`,
            timeout: 300_000,
            reuseExistingServer,
            stdout: process.env.E2E_API_LOG === '1' ? 'pipe' : 'ignore',
            stderr: 'pipe',
            gracefulShutdown: { signal: 'SIGTERM', timeout: 10_000 },
        },
        {
            command: 'npm run dev -- --port 5173 --strictPort',
            cwd: rootDir,
            url: WEB_URL,
            timeout: 120_000,
            reuseExistingServer,
            stdout: 'ignore',
            stderr: 'pipe',
            env: {
                VITE_E2E: 'true',
                VITE_BACKEND_URL: API_URL,
            },
        },
    ],
});
