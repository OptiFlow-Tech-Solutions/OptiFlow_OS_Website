import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import globals from 'globals';

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'warn',
      // Flag inline style={{}} objects as warnings (2.8 - allowlist for dynamic values)
      'no-restricted-syntax': [
        'warn',
        {
          selector: "JSXAttribute[name.name='style'][value.type='JSXExpressionContainer'][value.expression.type='ObjectExpression']",
          message: 'Avoid inline style={{}} objects. Use Tailwind utility classes or CSS files instead. Allowed exceptions: dynamic positioning values from hooks (e.g. mouse glow, parallax).',
        },
      ],
    },
  },
);
