#!/bin/bash

# Quick GitHub & Vercel Deployment Setup
# This script helps you deploy autoraos.com to Vercel in 5 minutes

echo "🚀 AUTO RAOS DEPLOYMENT SETUP"
echo "=============================="
echo ""
echo "STEP 1: Create GitHub Repository"
echo "================================="
echo ""
echo "👉 Go to: https://github.com/new"
echo ""
echo "Fill in:"
echo "  Repository name: autoraos-site"
echo "  Description: AUTORA OS Website - autoraos.com"
echo "  Visibility: Public (recommended for Vercel)"
echo "  Click: Create repository"
echo ""
echo "Do NOT initialize with README, .gitignore, or license"
echo ""
echo "Press ENTER when done..."
read

GITHUB_USERNAME=""
echo ""
echo "Enter your GitHub username:"
read GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ GitHub username required"
    exit 1
fi

echo ""
echo "STEP 2: Push Code to GitHub"
echo "============================"
echo ""
echo "Running git commands..."

cd "/Users/vuyomabilisa/Documents/New project"

git remote add origin "https://github.com/$GITHUB_USERNAME/autoraos-site.git" 2>/dev/null || git remote set-url origin "https://github.com/$GITHUB_USERNAME/autoraos-site.git"
git branch -M main
git push -u origin main

if [ $? -eq 0 ]; then
    echo "✅ Code pushed to GitHub!"
else
    echo "⚠️  Push may have required authentication. Follow the prompt."
fi

echo ""
echo "STEP 3: Deploy to Vercel"
echo "========================"
echo ""
echo "👉 Go to: https://vercel.com/dashboard"
echo ""
echo "Then:"
echo "  1. Click 'Add New' → 'Project'"
echo "  2. Select 'Import Git Repository'"
echo "  3. Find 'autoraos-site' and click 'Import'"
echo "  4. Vercel will auto-detect Next.js"
echo "  5. Click 'Deploy'"
echo ""
echo "STEP 4: Add Environment Variables"
echo "=================================="
echo ""
echo "In Vercel Dashboard after import, add your environment variables:"
echo ""
echo "  NEXT_PUBLIC_SUPABASE_URL = (from .env.local)"
echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY = (from .env.local)"
echo "  SENDGRID_API_KEY = (from .env.local)"
echo "  GOOGLE_MAPS_API_KEY = (from .env.local)"
echo ""
echo "STEP 5: Connect Domain"
echo "======================"
echo ""
echo "Once deployed:"
echo "  1. Go to Settings → Domains"
echo "  2. Add 'autoraos.com'"
echo "  3. Update your domain registrar's DNS:"
echo "     - Point your nameservers to Vercel's"
echo "     - OR add A record to Vercel's IP"
echo "  4. Add 'www.autoraos.com' as alias"
echo ""
echo "✅ Done! Your site will be live at https://autoraos.com"
echo ""
