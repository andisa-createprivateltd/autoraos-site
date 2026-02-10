#!/bin/bash

# Vercel Deployment Setup Script
# This script prepares your site for deployment to Vercel

echo "🚀 Setting up autoraos.com for Vercel deployment..."
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo ""

# Check package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the project directory?"
    exit 1
fi

echo "✅ Project files found"
echo ""

# Verify build works
echo "🔨 Testing production build..."
npm run build > /dev/null 2>&1

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed. Check your configuration."
    exit 1
fi

echo ""
echo "📝 Next steps for deployment:"
echo ""
echo "1. Create a GitHub repository:"
echo "   - Go to https://github.com/new"
echo "   - Create a new repository (e.g., 'autoraos-site')"
echo ""
echo "2. Push your code:"
echo "   git add ."
echo "   git commit -m 'Initial site setup for autoraos.com'"
echo "   git remote add origin https://github.com/YOUR_USERNAME/autoraos-site.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy to Vercel:"
echo "   - Go to https://vercel.com (sign up with GitHub)"
echo "   - Click 'Add New' → 'Project'"
echo "   - Select your repository"
echo "   - Add environment variables (from .env.example)"
echo "   - Click 'Deploy'"
echo ""
echo "4. Connect domain:"
echo "   - In Vercel: Settings → Domains"
echo "   - Add 'autoraos.com' and 'www.autoraos.com'"
echo "   - Update DNS at your domain registrar"
echo ""
echo "5. Done! Your site will be live at https://autoraos.com"
echo ""
echo "📚 For more details, see: DEPLOYMENT.md"
echo ""
