// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import eslintPluginUnicorn from 'eslint-plugin-unicorn';
import eslintPluginJsdoc from 'eslint-plugin-jsdoc';
import eslintPluginAccess from '@pegasusheavy/eslint-typescript-access';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/coverage/**',
      '**/.angular/**',
      '**/out-tsc/**',
      '**/*.d.ts',
    ],
  },

  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      ...angular.configs.tsRecommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json', './projects/ngx-tailwindcss/tsconfig.lib.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      unicorn: eslintPluginUnicorn,
      jsdoc: eslintPluginJsdoc,
      '@pegasusheavy/typescript-access': eslintPluginAccess,
    },
    processor: angular.processInlineTemplates,
    rules: {
      // ============================================
      // Angular ESLint Rules
      // ============================================
      '@angular-eslint/component-class-suffix': 'error',
      '@angular-eslint/component-selector': [
        'error',
        {
          type: ['element', 'attribute'],
          prefix: 'tw',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/directive-class-suffix': 'error',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'tw',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/no-empty-lifecycle-method': 'error',
      // TODO: Migrate to inject() function
      '@angular-eslint/prefer-inject': 'off',
      '@angular-eslint/no-host-metadata-property': 'off', // Allow host metadata for styling
      '@angular-eslint/no-input-rename': 'error',
      '@angular-eslint/no-inputs-metadata-property': 'error',
      // TODO: Rename native event outputs
      '@angular-eslint/no-output-native': 'off',
      // TODO: Rename outputs to not use 'on' prefix
      '@angular-eslint/no-output-on-prefix': 'off',
      '@angular-eslint/no-output-rename': 'error',
      '@angular-eslint/no-outputs-metadata-property': 'error',
      '@angular-eslint/prefer-on-push-component-change-detection': 'warn',
      '@angular-eslint/prefer-standalone': 'error',
      // TODO: Add selectors to test host components
      '@angular-eslint/use-component-selector': 'off',
      '@angular-eslint/use-lifecycle-interface': 'error',
      '@angular-eslint/use-pipe-transform-interface': 'error',

      // ============================================
      // TypeScript ESLint Rules
      // ============================================
      // TODO: Re-enable unsafe rules after adding proper types
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-deprecated': 'warn',
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/restrict-plus-operands': 'off',
      '@typescript-eslint/array-type': ['error', { default: 'array-simple' }],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        {
          assertionStyle: 'as',
          objectLiteralTypeAssertions: 'never',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/explicit-function-return-type': [
        'warn',
        {
          allowExpressions: true,
          allowTypedFunctionExpressions: true,
          allowHigherOrderFunctions: true,
          allowDirectConstAssertionInArrowFunctions: true,
        },
      ],
      // Disabled in favor of @pegasusheavy/typescript-access/explicit-member-accessibility
      '@typescript-eslint/explicit-member-accessibility': 'off',
      // TODO: Re-enable after codebase cleanup
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'default',
          format: ['camelCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'variable',
          format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
          leadingUnderscore: 'allow',
          trailingUnderscore: 'allow',
        },
        {
          selector: 'typeLike',
          format: ['PascalCase'],
        },
        {
          selector: 'enumMember',
          format: ['PascalCase', 'UPPER_CASE'],
        },
        {
          selector: 'property',
          format: null, // Allow any format for properties (needed for Tailwind class objects)
        },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'constructors'],
        },
      ],
      // TODO: Replace any with proper types
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
        },
      ],
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: false,
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'warn',
      '@typescript-eslint/no-unused-expressions': 'error',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
        },
      ],
      '@typescript-eslint/prefer-for-of': 'error',
      '@typescript-eslint/prefer-function-type': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'warn',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/prefer-readonly': 'warn',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
          allowBoolean: true,
          allowNullish: true,
        },
      ],
      '@typescript-eslint/strict-boolean-expressions': 'off', // Too strict for general use
      '@typescript-eslint/unified-signatures': 'error',

      // ============================================
      // TypeScript Access Modifier Rules
      // ============================================
      // TODO: Re-enable after codebase cleanup
      '@pegasusheavy/typescript-access/explicit-member-accessibility': 'off',
      '@pegasusheavy/typescript-access/member-accessibility-order': 'off',

      // ============================================
      // Unicorn Rules (Best Practices)
      // ============================================
      'unicorn/better-regex': 'error',
      'unicorn/catch-error-name': 'error',
      'unicorn/consistent-destructuring': 'warn',
      'unicorn/consistent-function-scoping': 'warn',
      'unicorn/error-message': 'error',
      'unicorn/escape-case': 'error',
      'unicorn/expiring-todo-comments': 'warn',
      'unicorn/explicit-length-check': 'error',
      'unicorn/filename-case': [
        'error',
        {
          cases: {
            kebabCase: true,
            pascalCase: true,
          },
        },
      ],
      'unicorn/new-for-builtins': 'error',
      'unicorn/no-abusive-eslint-disable': 'error',
      'unicorn/no-array-for-each': 'off', // forEach is fine in Angular
      'unicorn/no-array-push-push': 'error',
      'unicorn/no-await-expression-member': 'error',
      'unicorn/no-console-spaces': 'error',
      'unicorn/no-empty-file': 'error',
      'unicorn/no-for-loop': 'error',
      'unicorn/no-hex-escape': 'error',
      'unicorn/no-instanceof-array': 'error',
      'unicorn/no-invalid-remove-event-listener': 'error',
      'unicorn/no-lonely-if': 'error',
      'unicorn/no-negated-condition': 'warn',
      'unicorn/no-nested-ternary': 'off',
      'unicorn/no-new-array': 'error',
      'unicorn/no-new-buffer': 'error',
      'unicorn/no-null': 'off', // null is valid in Angular
      'unicorn/no-object-as-default-parameter': 'error',
      'unicorn/no-process-exit': 'error',
      'unicorn/no-static-only-class': 'error',
      'unicorn/no-thenable': 'error',
      'unicorn/no-this-assignment': 'error',
      'unicorn/no-typeof-undefined': 'error',
      'unicorn/no-unnecessary-await': 'error',
      'unicorn/no-unreadable-array-destructuring': 'error',
      'unicorn/no-unreadable-iife': 'error',
      'unicorn/no-unused-properties': 'warn',
      'unicorn/no-useless-fallback-in-spread': 'error',
      'unicorn/no-useless-length-check': 'error',
      'unicorn/no-useless-promise-resolve-reject': 'error',
      'unicorn/no-useless-spread': 'error',
      'unicorn/no-useless-switch-case': 'error',
      'unicorn/no-useless-undefined': 'off', // undefined is sometimes explicit in Angular
      'unicorn/no-zero-fractions': 'error',
      'unicorn/number-literal-case': 'error',
      'unicorn/numeric-separators-style': 'error',
      'unicorn/prefer-add-event-listener': 'error',
      'unicorn/prefer-array-find': 'error',
      'unicorn/prefer-array-flat': 'error',
      'unicorn/prefer-array-flat-map': 'error',
      'unicorn/prefer-array-index-of': 'error',
      'unicorn/prefer-array-some': 'error',
      'unicorn/prefer-at': 'error',
      'unicorn/prefer-code-point': 'error',
      'unicorn/prefer-date-now': 'error',
      'unicorn/prefer-default-parameters': 'error',
      'unicorn/prefer-dom-node-append': 'error',
      'unicorn/prefer-dom-node-dataset': 'error',
      'unicorn/prefer-dom-node-remove': 'error',
      'unicorn/prefer-dom-node-text-content': 'error',
      'unicorn/prefer-export-from': 'error',
      'unicorn/prefer-includes': 'error',
      'unicorn/prefer-keyboard-event-key': 'error',
      'unicorn/prefer-logical-operator-over-ternary': 'error',
      'unicorn/prefer-math-trunc': 'error',
      'unicorn/prefer-modern-dom-apis': 'error',
      'unicorn/prefer-modern-math-apis': 'error',
      'unicorn/prefer-module': 'off', // CommonJS sometimes needed
      'unicorn/prefer-native-coercion-functions': 'error',
      'unicorn/prefer-negative-index': 'error',
      'unicorn/prefer-node-protocol': 'error',
      'unicorn/prefer-number-properties': 'error',
      'unicorn/prefer-object-from-entries': 'error',
      'unicorn/prefer-optional-catch-binding': 'error',
      'unicorn/prefer-prototype-methods': 'error',
      'unicorn/prefer-query-selector': 'error',
      'unicorn/prefer-reflect-apply': 'error',
      'unicorn/prefer-regexp-test': 'error',
      'unicorn/prefer-set-has': 'error',
      'unicorn/prefer-set-size': 'error',
      'unicorn/prefer-spread': 'error',
      'unicorn/prefer-string-replace-all': 'error',
      'unicorn/prefer-string-slice': 'error',
      'unicorn/prefer-string-starts-ends-with': 'error',
      'unicorn/prefer-string-trim-start-end': 'error',
      'unicorn/prefer-switch': 'warn',
      'unicorn/prefer-ternary': 'off', // Can reduce readability
      'unicorn/prefer-top-level-await': 'off', // Not always applicable
      'unicorn/prefer-type-error': 'error',
      'unicorn/prevent-abbreviations': 'off', // Too strict
      'unicorn/relative-url-style': 'error',
      'unicorn/require-array-join-separator': 'error',
      'unicorn/require-number-to-fixed-digits-argument': 'error',
      'unicorn/switch-case-braces': 'error',
      'unicorn/template-indent': 'warn',
      'unicorn/text-encoding-identifier-case': 'error',
      'unicorn/throw-new-error': 'error',

      // ============================================
      // JSDoc Rules
      // ============================================
      'jsdoc/check-alignment': 'warn',
      'jsdoc/check-param-names': 'warn',
      'jsdoc/check-tag-names': 'warn',
      'jsdoc/check-types': 'warn',
      'jsdoc/no-types': 'warn', // Use TypeScript types instead
      'jsdoc/require-description': 'off',
      'jsdoc/require-jsdoc': 'off', // Don't require JSDoc everywhere
      'jsdoc/require-param': 'off',
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns': 'off',
      'jsdoc/require-returns-type': 'off',

      // ============================================
      // General ESLint Rules
      // ============================================
      // TODO: Add getters for setters
      'accessor-pairs': 'off',
      'array-callback-return': 'error',
      'block-scoped-var': 'error',
      'complexity': ['warn', { max: 15 }],
      'consistent-return': 'off', // TypeScript handles this
      'curly': ['error', 'all'],
      'default-case': 'warn',
      'default-case-last': 'error',
      'dot-notation': 'off', // TypeScript rule handles this
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'func-style': ['error', 'declaration', { allowArrowFunctions: true }],
      'grouped-accessor-pairs': 'error',
      'guard-for-in': 'error',
      'id-length': [
        'warn',
        {
          min: 2,
          exceptions: ['i', 'j', 'k', 'x', 'y', 'z', '_'],
        },
      ],
      'max-classes-per-file': ['warn', 3],
      'max-depth': ['warn', 4],
      'max-lines': ['warn', { max: 500, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': [
        'warn',
        { max: 100, skipBlankLines: true, skipComments: true },
      ],
      'max-nested-callbacks': ['warn', 4],
      'max-params': ['warn', 5],
      'no-alert': 'error',
      'no-caller': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-constant-binary-expression': 'error',
      'no-constructor-return': 'error',
      'no-div-regex': 'error',
      'no-duplicate-imports': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-empty-static-block': 'error',
      'no-eval': 'error',
      'no-extend-native': 'error',
      'no-extra-bind': 'error',
      'no-extra-label': 'error',
      'no-implicit-coercion': ['error', { allow: ['!!'] }],
      'no-implicit-globals': 'error',
      'no-implied-eval': 'error',
      'no-invalid-this': 'off', // TypeScript handles this
      'no-iterator': 'error',
      'no-label-var': 'error',
      'no-labels': 'error',
      'no-lone-blocks': 'error',
      'no-lonely-if': 'error',
      'no-loop-func': 'error',
      'no-multi-assign': 'error',
      'no-multi-str': 'error',
      'no-negated-condition': 'warn',
      'no-nested-ternary': 'off',
      'no-new': 'error',
      'no-new-func': 'error',
      'no-new-wrappers': 'error',
      'no-object-constructor': 'error',
      'no-octal-escape': 'error',
      'no-param-reassign': 'error',
      'no-plusplus': 'off',
      'no-promise-executor-return': 'error',
      'no-proto': 'error',
      'no-return-assign': 'error',
      'no-script-url': 'error',
      'no-self-compare': 'error',
      'no-sequences': 'error',
      'no-template-curly-in-string': 'error',
      'no-throw-literal': 'off', // TypeScript rule handles this
      'no-undef-init': 'error',
      'no-underscore-dangle': 'off', // Allow underscores
      'no-unmodified-loop-condition': 'error',
      'no-unneeded-ternary': 'error',
      'no-unreachable-loop': 'error',
      'no-unused-private-class-members': 'error',
      'no-useless-call': 'error',
      'no-useless-computed-key': 'error',
      'no-useless-concat': 'error',
      'no-useless-constructor': 'off', // TypeScript rule handles this
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-var': 'error',
      'no-void': ['error', { allowAsStatement: true }],
      'object-shorthand': 'error',
      'one-var': ['error', 'never'],
      'operator-assignment': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-const': 'error',
      'prefer-destructuring': [
        'warn',
        {
          array: false,
          object: true,
        },
      ],
      'prefer-exponentiation-operator': 'error',
      'prefer-named-capture-group': 'warn',
      'prefer-numeric-literals': 'error',
      'prefer-object-has-own': 'error',
      'prefer-object-spread': 'error',
      'prefer-promise-reject-errors': 'error',
      'prefer-regex-literals': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error',
      'radix': 'error',
      'require-atomic-updates': 'error',
      'require-await': 'off', // TypeScript rule handles this
      'require-unicode-regexp': 'warn',
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true, // Let import plugin handle this
          ignoreMemberSort: false,
        },
      ],
      'spaced-comment': ['error', 'always', { markers: ['/'] }],
      'symbol-description': 'error',
      'yoda': 'error',
    },
  },

  // HTML template files configuration
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended, ...angular.configs.templateAccessibility],
    rules: {
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/button-has-type': 'warn',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
      '@angular-eslint/template/elements-content': 'warn',
      '@angular-eslint/template/interactive-supports-focus': 'warn',
      '@angular-eslint/template/label-has-associated-control': 'warn',
      '@angular-eslint/template/mouse-events-have-key-events': 'warn',
      '@angular-eslint/template/no-autofocus': 'warn',
      '@angular-eslint/template/no-distracting-elements': 'error',
      '@angular-eslint/template/no-duplicate-attributes': 'error',
      '@angular-eslint/template/no-negated-async': 'error',
      '@angular-eslint/template/no-positive-tabindex': 'error',
      '@angular-eslint/template/role-has-required-aria': 'error',
      '@angular-eslint/template/table-scope': 'error',
      '@angular-eslint/template/valid-aria': 'error',
    },
  },

  // Spec files - relaxed rules
  {
    files: ['**/*.spec.ts', '**/*.test.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@angular-eslint/use-component-selector': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
      '@pegasusheavy/typescript-access/explicit-member-accessibility': 'off',
      'max-lines-per-function': 'off',
      'max-nested-callbacks': 'off',
    },
  },

  // Config files - relaxed rules
  {
    files: ['*.config.js', '*.config.ts', '*.config.mjs'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'unicorn/prefer-module': 'off',
    },
  },

  // Prettier compatibility (must be last)
  eslintConfigPrettier
);

