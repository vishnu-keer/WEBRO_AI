// Flat ESLint config (ESLint 9 + Next.js 16).
//
// Uses the plugins' NATIVE flat configs directly instead of the legacy
// `FlatCompat` bridge. FlatCompat + eslint-config-next crashes under ESLint 9
// ("Converting circular structure to JSON") because the old config validator
// can't serialize the React plugin's self-referencing object. Wiring the flat
// plugins straight in avoids that path entirely.
import tseslint from "typescript-eslint";
import nextPlugin from "@next/eslint-plugin-next";
import reactHooks from "eslint-plugin-react-hooks";

export default tseslint.config(
  {
    ignores: [".next/**", "node_modules/**", "supabase/functions/**"],
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      "@next/next": nextPlugin,
      "react-hooks": reactHooks,
    },
    rules: {
      // Next.js recommended + Core Web Vitals rules.
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs["core-web-vitals"].rules,
      // React Hooks correctness.
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      // The DB types file is a permissive placeholder until `npm run db:types`
      // regenerates precise ones; a few infra casts also use `any` deliberately.
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
);
