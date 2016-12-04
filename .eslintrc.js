module.exports = {
  extends: [
    'eslint:recommended', 'plugin:react/recommended'
  ],
  parserOptions: {
      ecmaVersion: 6,
      sourcetype: "module"
  },
  env: {
    browser: true,
    node: true,
  },
  plugins: [
    "react"
  ],
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 1,
    quotes: [2, "single"]
  }
};
