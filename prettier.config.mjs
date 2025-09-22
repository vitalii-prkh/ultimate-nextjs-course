const config = {
  // Optional JSON schema hint (ignored by Prettier at runtime)
  $schema: "https://json.schemastore.org/prettierrc",

  // Core formatting options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed", // "as-needed" | "consistent" | "preserve"
  jsxSingleQuote: false,
  trailingComma: "es5", // "none" | "es5" | "all"
  bracketSpacing: false,
  bracketSameLine: false,
  arrowParens: "always", // "always" | "avoid"
  proseWrap: "preserve", // "always" | "never" | "preserve"
  htmlWhitespaceSensitivity: "css", // "css" | "strict" | "ignore"
  vueIndentScriptAndStyle: false,
  endOfLine: "lf", // "lf" | "crlf" | "cr" | "auto"
  embeddedLanguageFormatting: "auto", // "auto" | "off"
  singleAttributePerLine: true,

  // Pragma controls
  requirePragma: false,
  insertPragma: false,

  // Plugins
  // Provide plugin package names or paths if you use them. Leave empty if none.
  plugins: ["prettier-plugin-tailwindcss"],

  // File-specific overrides (examples shown; adjust as needed)
  overrides: [
    {
      files: ["*.md", "*.mdx"],
      options: {
        proseWrap: "always",
        trailingComma: "none",
      },
    },
    {
      files: ["*.yml", "*.yaml"],
      options: {
        // YAML parsers generally prefer double quotes; keep singleQuote false.
        singleQuote: false,
      },
    },
    {
      files: ["*.json", "*.jsonc"],
      options: {
        trailingComma: "none",
      },
    },
    {
      files: ["*.ts", "*.tsx", "*.js", "*.jsx", "*.cjs", "*.mjs"],
      options: {
        trailingComma: "all",
      },
    },
    {
      files: ["*.html"],
      options: {
        htmlWhitespaceSensitivity: "css",
      },
    },
    {
      files: ["*.vue"],
      options: {
        vueIndentScriptAndStyle: false,
      },
    },
  ],
};

export default config;
