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
  {
    rules: {
      // TypeScript rules
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "warn", // Changed from 'off' to 'warn'
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-wrapper-object-types": "warn", // Added to handle Object vs object warnings
      
      // React rules
      "react/display-name": "off", // Turn off display name requirement
      "react-hooks/exhaustive-deps": "warn", // Keep as warning for hook dependencies
      "react/no-unescaped-entities": "warn", // Added to handle unescaped quotes
      
      // Accessibility rules
      "jsx-a11y/alt-text": "warn",
      
      // Next.js image optimization
      "@next/next/no-img-element": "warn",
      
      // JavaScript rules
      "prefer-const": "warn", // Changed from default 'error' to 'warn'
    },
  },
];

export default eslintConfig;
