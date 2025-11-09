import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
    },
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser, ...globals.jest },
  },
]);
