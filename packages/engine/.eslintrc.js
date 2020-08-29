module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    amd: true,
  },
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
};
