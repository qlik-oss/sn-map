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

    // Bans “// @ts-ignore” comments from being used
    '@typescript-eslint/ban-ts-ignore': 'error',

    // Enforce consistent brace style for blocks
    // "@typescript-eslint/brace-style": ["warn", "1tbs"],

    // Enforce camelCase naming convention
    '@typescript-eslint/camelcase': 'error',

    // Require PascalCased class and interface names
    '@typescript-eslint/class-name-casing': [
      'error',
      {
        allowUnderscorePrefix: true,
      },
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

    // Disallow usage of the any type
    // "@typescript-eslint/no-explicit-any": "warn",

    // Disallow extra non-null assertion
    '@typescript-eslint/no-extra-non-null-assertion': ['error'],

    // Requires Promise-like values to be handled appropriately.
    // "@typescript-eslint/no-floating-promises": ["error"],

    // Disallow iterating over an array with a for-in loop
    // "@typescript-eslint/no-for-in-array": "error",

    // Enforce valid definition of new and constructor
    '@typescript-eslint/no-misused-new': 'error',

    // Avoid using promises in places not designed to handle them
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],

    // Disallows non-null assertions using the ! postfix operator
    // "@typescript-eslint/no-non-null-assertion": "error",

    // Disallows invocation of require()
    '@typescript-eslint/no-require-imports': 'warn',

    // Prevents conditionals where the type is always truthy or always falsy
    // "@typescript-eslint/no-unnecessary-condition": "warn",

    // Disallow unused expressions
    // "@typescript-eslint/no-unused-expressions": "warn",

    // Disallow unused variables
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],

    // Prefer a ‘for-of’ loop over a standard ‘for’ loop if the index is only used to access the array being iterated
    // "@typescript-eslint/prefer-for-of": "warn",

    // Enforce the usage of the nullish coalescing operator instead of logical chaining
    // "@typescript-eslint/prefer-nullish-coalescing": "warn",

    // Prefer using concise optional chain expressions instead of chained logical ands
    // "@typescript-eslint/prefer-optional-chain": "warn",

    // Requires that private members are marked as readonly if they're never modified outside of the constructor
    // "@typescript-eslint/prefer-readonly": "warn",

    // Prefer RegExp#exec() over String#match() if no global flag is provided
    '@typescript-eslint/prefer-regexp-exec': 'error',

    // Enforce the use of String#startsWith and String#endsWith instead of other equivalent methods of checking substrings
    // "@typescript-eslint/prefer-string-starts-ends-with": "warn",

    // Requires any function or method that returns a Promise to be marked async
    '@typescript-eslint/promise-function-async': 'error',

    // Enforce the consistent use of either backticks, double, or single quotes
    '@typescript-eslint/quotes': ['error', 'single'],

    // Enforce giving compare argument to Array#sort
    // "@typescript-eslint/require-array-sort-compare": "warn",

    // Disallow async functions which have no await expression
    //  '@typescript-eslint/require-await': 'error',

    // When adding two variables, operands must both be of type number or of type string
    // "@typescript-eslint/restrict-plus-operands": "warn",

    // Enforce template literal expressions to be of string type
    // "@typescript-eslint/restrict-template-expressions": "warn",

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
