import angular from "angular-eslint";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ['projects/**/*'],
  },
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.eslint.json'],
      },
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/consistent-type-definitions': 'error',
      '@typescript-eslint/dot-notation': 'off',
      '@typescript-eslint/explicit-member-accessibility': [
        'off',
        {
          accessibility: 'explicit',
        },
      ],
      '@typescript-eslint/member-ordering': [
        'error',
        {
          default: [
            'static-field',
            'instance-field',
            'static-method',
            'instance-method',
          ],
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: ['app', 'openlp'],
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: ['app', 'openlp'],
          style: 'camelCase',
        },
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'off',
      '@angular-eslint/prefer-standalone': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: ['variable'],
          modifiers: ['readonly'],
          format: ['UPPER_CASE'],
        },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-private-class-members': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'jsdoc/no-types': 'off',
      'prefer-arrow/prefer-arrow-functions': 'off',
      'brace-style': 'off',
      '@typescript-eslint/brace-style': 'off',
      'id-blacklist': 'off',
      'id-match': 'off',
      'no-underscore-dangle': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  },
);