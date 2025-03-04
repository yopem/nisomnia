/** @typedef  {import("prettier").Config} PrettierConfig */
/** @typedef  {import("prettier-plugin-astro").PluginOptions} AstroConfig */
/** @typedef  {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef  {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/** @type { PrettierConfig | AstroConfig | SortImportsConfig | TailwindConfig } */
const config = {
  bracketSpacing: true,
  jsxSingleQuote: false,
  printWidth: 80,
  proseWrap: "always",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
  plugins: [
    "prettier-plugin-astro",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
  importOrder: [
    "^(astro/(.*)$)|^(astro$)",
    "<THIRD_PARTY_MODULES>",
    "",
    "",
    "^@/",
    "^[../]",
    "^[./]",
  ],
  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
}

export default config
