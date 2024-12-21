#!/bin/bash

# Clean
npm run clean

# Build
npm run build

# Remove cache directories
rm -rf out/cache
rm -rf .next/cache

# Deploy
wrangler pages deploy out --project-name transfoerm 