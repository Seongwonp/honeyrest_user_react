// API(e2e 프로필, E2E_API_DIR 기본 ../honeyRest_user)와 개발 서버(VITE_E2E=true)를 함께 띄운다.
// 포트는 백엔드 CORS 설정 때문에 5173/8080 고정.
// 매번 새 DB 로 시작하도록 서버를 재사용하지 않는다 (E2E_REUSE_SERVER=1 이면 재사용).
import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

const API_DIR = path.resolve(rootDir, process.env.E2E_API_DIR || '../honeyRest_user');
const API_URL = process.env.E2E_API_URL || 'http://localhost:8080';
const WEB_URL = process.env.E2E_WEB_URL || 'http://localhost:5173';
const reuseExistingServer = process.env.E2E_REUSE_SERVER === '1';

// Playwright 와 브라우저 리비전이 안 맞을 때만 지정
const executablePath = process.env.E2E_CHROMIUM_PATH || undefined;

export default defineConfig({
    testDir: './e2e',
    // 같은 DB 상태를 이어 쓰므로 직렬 실행
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
        // dates.js 와 브라우저의 "오늘"을 맞춘다
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
            // Gradle 첫 실행은 오래 걸릴 수 있다
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
