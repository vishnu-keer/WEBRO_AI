#!/usr/bin/env bash
# Regenerate precise TypeScript types from the local Supabase schema.
set -euo pipefail
supabase gen types typescript --local > src/types/database.ts
echo "Wrote src/types/database.ts"
