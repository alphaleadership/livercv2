#!/bin/bash
# Deployment script for Toolforge

echo "Building project..."
npm run build

echo "Preparing public_html..."
# On Toolforge, you typically serve from public_html
# rm -rf ~/public_html/*
# cp -r dist/* ~/public_html/

echo "Deployment steps:"
echo "1. SSH into Toolforge: ssh <username>@login.toolforge.org"
echo "2. Navigate to tool directory: cd /data/project/<tool-name>"
echo "3. Pull latest changes: git pull"
echo "4. Build: npm install && npm run build"
echo "5. Link dist to public_html: ln -sfn $(pwd)/dist $(pwd)/public_html"
