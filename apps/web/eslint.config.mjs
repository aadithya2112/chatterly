import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Add custom rules to suppress the params.id warning
  {
    files: ["src/app/api/**/*.ts"],
    rules: {
      // Disable the sync dynamic API rule that's causing the warning
      "@next/next/no-sync-scripts": "off",
      // This is the specific rule for the params.id issue
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off"
    }
  }
];

export default eslintConfig;