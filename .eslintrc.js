module.exports = {
  extends: [
    'eslint:recommended', 'plugin:react/recommended'
  ],
  parser: "babel-eslint",
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  plugins: [
    "babel",
    "react",
  ],
  rules: {
    'no-console': 0,
    'no-underscore-dangle': 1,
    quotes: [2, "single"]
  }
};
