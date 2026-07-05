// Flat ESLint config (ESLint 9 + Next.js 16).
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [".next/**", "node_modules/**", "supabase/functions/**"],
  },
  {
    rules: {
      // The DB types file is a permissive placeholder until `npm run db:types`
      // regenerates precise ones; a few infra casts also use `any` deliberately.
      "@typescript-eslint/no-explicit-any": "off",
      // Marketing/UI copy contains apostrophes; escaping them hurts readability.
      "react/no-unescaped-entities": "off",
    },
  },
];
