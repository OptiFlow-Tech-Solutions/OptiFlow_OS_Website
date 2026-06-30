import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**", "Web-Prototype/**"]
  },
  {
    files: ["scripts/**/*.mjs", "orchestrate/**/*.mjs", "hooks/**/*.mjs", "tests/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        performance: "readonly",
      }
    },
    rules: {
      "no-console": "warn",
      "no-unused-vars": ["error", { "varsIgnorePattern": "^_" }],
      "no-debugger": "error",
      "prefer-const": "error",
      "no-var": "error"
    }
  }
];
