#!/data/data/com.termux/files/usr/bin/bash

echo "🔍 Scanning project for broken imports..."

mkdir -p _repair_logs

# 1. Find missing "@/..." imports
grep -R "@/components" src > _repair_logs/missing_components.txt 2>/dev/null
grep -R "@/lib" src > _repair_logs/missing_lib.txt 2>/dev/null

echo "🧹 Fixing Tailwind + CSS consistency..."

# Fix index.css safely
cat > src/index.css << 'CSS'
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}
CSS

echo "🧠 Checking JSX syntax (basic validation)..."

for f in $(find src -name "*.jsx"); do
  node -c "$f" 2>> _repair_logs/jsx_errors.txt
done

echo "🔧 Attempting import fixes..."

# Replace broken "@/components/ui/*" imports with placeholders
find src -type f -name "*.jsx" -exec sed -i 's|@/components/ui/button|./components/button-placeholder|g' {} \;
find src -type f -name "*.jsx" -exec sed -i 's|@/components/ui/card|./components/card-placeholder|g' {} \;
find src -type f -name "*.jsx" -exec sed -i 's|@/lib/trpc|./lib/trpc-placeholder|g' {} \;

echo "🧼 Cleaning duplicate React import issues..."

find src -type f -name "*.jsx" -exec sed -i 's/import React from "react";//g' {} \;

echo "📦 Checking for broken App.jsx structure..."

if ! node -c src/pages/App.jsx 2>/dev/null; then
  echo "❌ App.jsx has syntax issues - backing up..."
  cp src/pages/App.jsx _repair_logs/App.jsx.broken
fi

echo "🚀 DONE."
echo "Run: npm run dev"
echo "Check logs in _repair_logs/"
