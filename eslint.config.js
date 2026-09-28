import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Framer Motion is referenced as a lowercase JSX namespace (motion.div),
      // which the core rule does not recognize as a variable use.
      'no-unused-vars': ['error', { varsIgnorePattern: '^(motion|[A-Z_])' }],
    },
  },
  // Playwright E2E (Node 에서 실행): React 규칙 대신 Node 전역을 쓴다.
  // 픽스처 인자 구조 분해({})와 fixture 의 use() 호출이 React 규칙에 걸리지 않도록 끈다.
  {
    files: ['e2e/**/*.js', 'playwright.config.js'],
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'off',
      'react-refresh/only-export-components': 'off',
      'no-empty-pattern': 'off',
    },
  },
])
