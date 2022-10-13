module.exports = {
  parser: '@babel/eslint-parser',
  extends: ['react-app', 'next/core-web-vitals'],
  rules: {
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'max-len': ['error', { 'code': 120 }],
    semi: ['error', 'never'],
    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single'],
    indent: ['error', 2, { 'SwitchCase': 1 }],
    'no-nested-ternary': 'error',
    // May be enable in future
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,
    'import/no-anonymous-default-export': 0,
    'eol-last': ['error', 'always'],
    'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
    'no-multi-spaces': 'error',
    'space-infix-ops': 'error',
    'object-curly-spacing': ['error', 'always'],
    'template-curly-spacing': ['error', 'never'],
    'space-before-function-paren': ['error', 'never'],
    'keyword-spacing': ['error', { 'before': true, 'after': true }],
    'space-in-parens': ['error', 'never'],
  }
}
