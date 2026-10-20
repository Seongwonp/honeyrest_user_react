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
                    // 벤더를 성격별로 나눠 캐시를 유지하고, 일부 페이지 전용 라이브러리는 지연 로드되게 한다.
                    // CSS 는 지연 청크에 묶이면 초기 로딩에 끌려오므로 제외, react-icons 는 트리셰이킹을 위해 제외
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
