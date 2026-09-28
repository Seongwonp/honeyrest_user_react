import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const projectRoot = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, projectRoot, '')

    return {
        plugins: [react(), tailwindcss()],
        server: {
            proxy: {
                '/api': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                },
                // 로컬 스토리지 모드(app.storage.type=local) 이미지 경로
                '/uploads': {
                    target: env.VITE_BACKEND_URL,
                    changeOrigin: true,
                },
            },
        },
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        build: {
            rollupOptions: {
                output: {
                    // 초기 번들(index)이 500kB 를 넘던 문제: 경고 한도를 올리지 않고 벤더를 성격별로 분리한다.
                    // - 자주 바뀌지 않는 라이브러리를 별도 청크로 두어 앱 코드 배포 시에도 캐시가 유지되게 함
                    // - 지연 로딩 페이지에서만 쓰는 라이브러리(date/toss/maps)는 해당 페이지 진입 시에만 로드됨
                    // - CSS 는 매칭하지 않는다: App.jsx 등의 전역 CSS import 가 지연 청크로 묶이면
                    //   그 청크가 초기 로딩에 끌려 들어오기 때문
                    // - react-icons 는 페이지별로 쓰는 아이콘만 트리셰이킹되도록 일부러 묶지 않는다
                    manualChunks(id) {
                        if (!id.includes('node_modules') || id.endsWith('.css')) return undefined;
                        const vendorGroups = [
                            ['vendor-react', /node_modules\/(react|react-dom|scheduler|react-router|react-router-dom|cookie|set-cookie-parser)\//],
                            ['vendor-motion', /node_modules\/(framer-motion|motion-dom|motion-utils)\//],
                            ['vendor-date', /node_modules\/(react-date-range|date-fns|react-list)\//],
                            ['vendor-toss', /node_modules\/@tosspayments\//],
                            ['vendor-maps', /node_modules\/@vis\.gl\//],
                        ];
                        const hit = vendorGroups.find(([, re]) => re.test(id));
                        return hit ? hit[0] : undefined;
                    },
                },
            },
        },
    }
})
