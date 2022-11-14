module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    /*
     * TS rules: https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin
     */

    // Requires using either T[] or Array<T> for arrays (default: T[])
    '@typescript-eslint/array-type': 'error',

    // Disallows awaiting a value that is not a Thenable
    '@typescript-eslint/await-thenable': 'error',

    // This rule reports any usage of @ts-ignore, including a fixer to replace with @ts-expect-error.
    '@typescript-eslint/prefer-ts-expect-error': 'error',

    // Enforce camelCase naming convention
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variableLike', format: ['camelCase', 'UPPER_CASE'], leadingUnderscore: 'allow' },
      { selector: 'class', format: ['PascalCase'] },
    ],

    // Enforce consistent indentation
    '@typescript-eslint/indent': [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],

    // Disallow generic Array constructors
    '@typescript-eslint/no-array-constructor': 'error',

    // Disallow extra non-null assertion
    '@typescript-eslint/no-extra-non-null-assertion': ['error'],

    // Enforce valid definition of new and constructor
    '@typescript-eslint/no-misused-new': 'error',

    // Avoid using promises in places not designed to handle them
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // Disallows invocation of require()
    '@typescript-eslint/no-require-imports': 'warn',

    // Disallow unused variables
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],

    // Prefer RegExp#exec() over String#match() if no global flag is provided
    '@typescript-eslint/prefer-regexp-exec': 'error',

    // Requires any function or method that returns a Promise to be marked async
    '@typescript-eslint/promise-function-async': 'error',

    // Enforce the consistent use of either backticks, double, or single quotes
    '@typescript-eslint/quotes': ['error', 'single'],

    // Rules for awaiting returned promises
    '@typescript-eslint/return-await': 'error',

    // Require or disallow semicolons instead of ASI
    '@typescript-eslint/semi': ['warn', 'always'],

    /*
     * Normal ESLint rules: https://eslint.org/docs/rules/
     */

    // enforce consistent brace style for all control statements
    // "curly": ["warn", "all"],

    // require the use of `===` and `!==`
    eqeqeq: ['error', 'smart'],

    // disallow the use of `alert`, `confirm`, and `prompt`
    'no-alert': 'error',

    // disallow the use of `arguments.caller` or `arguments.callee`
    'no-caller': 'error',

    // disallow assignment operators in conditional expressions
    'no-cond-assign': 'error',

    // disallow control characters in regular expressions
    'no-control-regex': 'error',

    // disallow the use of `debugger`
    'no-debugger': 'error',

    // disallow duplicate arguments in function definitions
    'no-dupe-args': 'error',

    // disallow duplicate case labels
    'no-duplicate-case': 'error',

    // disallow the use of `eval()`
    'no-eval': 'error',

    // disallow reassigning exceptions in catch clauses
    'no-ex-assign': 'error',

    // disallow the use of `eval()`-like methods
    'no-implied-eval': 'error',

    // disallow invalid regular expression strings in `RegExp` constructors
    'no-invalid-regexp': 'error',

    // disallow `this` keywords outside of classes or class-like objects
    // "no-invalid-this": "error",

    // disallow irregular whitespace
    'no-irregular-whitespace': 'warn',

    // disallow `new` operators with the `String`, `Number`, and `Boolean` objects
    'no-new-wrappers': 'error',

    // disallow octal literals
    'no-octal': 'error',

    // 	disallow variable redeclaration
    'no-redeclare': 'error',

    // disallow throwing literals as exceptions
    'no-throw-literal': 'error',

    // disallow trailing whitespace at the end of lines
    'no-trailing-spaces': 'warn',

    // disallow unreachable code after `return`, `throw`, `continue`, and `break` statements
    'no-unreachable': 'error',

    // disallow control flow statements in `finally` blocks
    'no-unsafe-finally': 'error',

    // disallow negating the left operand of relational operators
    'no-unsafe-negation': 'error',

    // require `let` or `const` instead of `var`
    'no-var': 'error',

    // disallow with statements
    'no-with': 'error',

    // require `const` declarations for variables that are never reassigned after declared
    'prefer-const': 'error',

    // require quotes around object literal property names
    'quote-props': ['warn', 'as-needed'],

    // enforce the consistent use of the radix argument when using `parseInt()`
    radix: 'error',

    // disallow assignments that can lead to race conditions due to usage of await or yield
    'require-atomic-updates': 'error',

    // require calls to `isNaN()` when checking for `NaN`
    'use-isnan': 'error',

    // enforce comparing `typeof` expressions against valid strings
    'valid-typeof': 'error',
  },
};
