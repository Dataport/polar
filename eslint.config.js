// allow require statements to keep things simple
/* eslint-disable @typescript-eslint/no-var-requires */

const { FlatCompat } = require('@eslint/eslintrc')
const eslint = require('@eslint/js')
const tseslint = require('typescript-eslint')
const jest = require('eslint-plugin-jest')
const pluginVue = require('eslint-plugin-vue')
const eslintConfigPrettier = require('eslint-config-prettier')
const globals = require('globals')

// compatibility mode for standard package, which isn't ready for this format
const compat = new FlatCompat({
  baseDirectory: __dirname
});

// there's literally a typo in the globals package
delete globals.browser["AudioWorkletGlobalScope "]
globals.browser.AudioWorkletGlobalScope = false

module.exports = [
  {
    ignores: [
      '**/build',
      '**/.cache',
      '**/coverage',
      '**/dist',
      '**/dist-test',
      '**/docs',
      '**/node_modules',
      '**/tests_output',
      '**/*.d.ts',
      '*.config.js',
      'pages/assets/iframe-resizer/**/*'
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  ...compat.extends('eslint-config-standard'),
  {
    plugins: {
      'typescript-eslint': tseslint.plugin,
      'eslint-plugin-import': require('eslint-plugin-import'),
      'eslint-plugin-tsdoc': require('eslint-plugin-tsdoc'),
    },
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: ['./tsconfig.json', './tsconfig.node.json'],
        extraFileExtensions: ['.vue'],
        sourceType: 'module',
        tsconfigRootDir: __dirname,
      },
      globals: {
        ...globals.browser,
      }
    },
    rules: {
      'no-console': ['error', { 'allow': ['warn', 'error'] }],
      'no-debugger': 'error',
      'object-curly-spacing': 'error',
      'array-bracket-spacing': 'error',
      'no-multi-spaces': 'error',
      'vue/multi-word-component-names': 'warn',
      'vue/order-in-components': 'error',
      'import/order': 'error',
      'curly': 'error',
      'brace-style': 'error',
      'no-else-return': 'error',
      'no-lonely-if': 'error',
      'require-await': 'error',
      'no-extra-parens': 'error',
      'func-style': ['error', 'declaration', { 'allowArrowFunctions': true }],
      'eol-last': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'complexity': 'warn',
      'max-depth': 'warn',
      'max-lines': 'warn',
      'max-lines-per-function': 'warn',
      // NOTE WIP state https://github.com/microsoft/tsdoc/issues/374
      // 'tsdoc/syntax': 'warn',
      'no-use-before-define': 'off',
      // NOTE produces lots of false positives
      'vue/valid-v-for': 'off',
      '@typescript-eslint/promise-function-async': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['typeLike'],
          format: ['PascalCase']
        },
        {
          selector: ['memberLike'],
          format: ['camelCase', 'UPPER_CASE', 'snake_case', 'PascalCase']
        },
        {
          selector: 'import',
          format: ['PascalCase', 'strictCamelCase'],
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface']
    },
    settings: {
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx']
      },
      'import/resolver': {
        'typescript': {
          'alwaysTryTypes': true
        }
      }
    }
  },
  {
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/**/*.spec.{j,t}s?(x)'],
    ...jest.configs['flat/recommended'],
    rules: {
      ...jest.configs['flat/recommended'].rules,
      'max-lines-per-function': 'off',
    },
  },
  eslintConfigPrettier,
]
