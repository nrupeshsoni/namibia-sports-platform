#!/usr/bin/env bash
# =============================================================================
# Apply seed data to the Namibia Sports Platform Supabase database.
#
# Prerequisites:
#   - psql installed (brew install postgresql / apt install postgresql-client)
#   - DATABASE_URL set in .env (or exported in the environment)
#
# Usage:
#   bash scripts/apply-seed.sh
#
# Alternatively, paste supabase/seed.sql directly into the Supabase SQL Editor:
#   https://supabase.com/dashboard/project/rbibqjgsnrueubrvyqps/editor
# =============================================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SEED_FILE="$SCRIPT_DIR/../supabase/seed.sql"
ENV_FILE="$SCRIPT_DIR/../.env"

# Load .env if it exists and DATABASE_URL is not already set
if [[ -z "${DATABASE_URL:-}" && -f "$ENV_FILE" ]]; then
  export $(grep -v '^#' "$ENV_FILE" | grep 'DATABASE_URL' | xargs)
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "❌  ERROR: DATABASE_URL is not set."
  echo "    Add it to .env or export it before running this script."
  exit 1
fi

echo "🌱  Applying seed data to Namibia Sports Platform database..."
echo "    Seed file: $SEED_FILE"

psql "$DATABASE_URL" -f "$SEED_FILE"

echo "✅  Seed applied successfully."
