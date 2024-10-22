import js from "@eslint/js"
import nextPlugin from "@next/eslint-plugin-next"
import * as parser from "@typescript-eslint/parser"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import reactPlugin from "eslint-plugin-react"
import hooksPlugin from "eslint-plugin-react-hooks"
import tailwind from "eslint-plugin-tailwindcss"
import ts from "typescript-eslint"

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  eslintPluginPrettierRecommended,
  eslintConfigPrettier,
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: [".next", "dist", "pnpm-lock.yaml"],
    settings: {
      react: {
        version: "detect",
      },
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        programs: [parser.createProgram("tsconfig.json")],
      },
    },
    plugins: {
      react: reactPlugin,
      "@next/next": nextPlugin,
      "react-hooks": hooksPlugin,
    },
    rules: {
      ...reactPlugin.configs["jsx-runtime"].rules,
      ...hooksPlugin.configs.recommended.rules,
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      "@next/next/no-html-link-for-pages": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "arrow-body-style": "off",
      "ban-ts-comment": "off",
      "import/consistent-type-specifier-style": "off",
      "no-prototype-builtins": "off",
      "no-unsafe-optional-chaining": "off",
      "prefer-arrow-callback": "off",
      "prettier/prettier": "error",
      "react/display-name": "off",
      "tailwindcss/classnames-order": "error",
      "tailwindcss/enforces-shorthand": "error",
      "tailwindcss/no-custom-classname": "error",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "separate-type-imports" },
      ],
    },
  },
]
