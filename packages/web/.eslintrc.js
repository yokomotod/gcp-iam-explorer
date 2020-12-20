module.exports = {
  root: false,
  extends: ["react-app", "prettier/react", "prettier/@typescript-eslint"],
  overrides: [
    {
      files: ["**/*.ts?(x)"],
      parserOptions: {
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
      },
    },
  ],
};
