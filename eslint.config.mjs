import eslint from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
  { ignores: ["dist/**", "node_modules/**"] },
  eslint.configs.recommended,
  {
    ignores: ["dist", "dist/**", "**/dist/**", "node_modules/**"],
    files: ["**/*.ts", "**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      globals: {
        chrome: "readonly",
        console: "readonly",
        CustomEvent: "readonly",
        DataTransfer: "readonly",
        document: "readonly",
        Element: "readonly",
        Event: "readonly",
        EventTarget: "readonly",
        File: "readonly",
        FileReader: "readonly",
        HTMLButtonElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLElement: "readonly",
        HTMLFormElement: "readonly",
        MutationObserver: "readonly",
        Node: "readonly",
        ParentNode: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        window: "readonly",
        process: "readonly",
      },
    },
    plugins: { "@typescript-eslint": tseslint },
    rules: {
      ...tseslint.configs.recommended.rules,
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
];
