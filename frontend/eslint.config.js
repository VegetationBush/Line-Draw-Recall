import { defineConfig } from 'eslint-define-config'
import tseslint from '@typescript-eslint/eslint-plugin'
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  {
    ignores: ['dist']  // ignore build output
  },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      tseslint.configs.recommendedTypeChecked,  // TypeScript type-aware rules
      tseslint.configs.strictTypeChecked,       // optional stricter rules
      tseslint.configs.stylisticTypeChecked,    // optional stylistic rules
      reactX.configs['recommended-typescript'], // React + TS rules
      reactDom.configs.recommended,             // React DOM rules
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])