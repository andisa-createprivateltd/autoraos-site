# ⚡ Deploy autoraos.com to Vercel - Fast Track Guide

## What You Need
1. GitHub account (free at github.com)
2. Vercel account (free at vercel.com)
3. Your domain: autoraos.com (already registered)
4. Environment variables from your .env.local

---

## 🚀 5-Minute Deployment

### Step 1: Create GitHub Repository (1 min)
```
1. Go to https://github.com/new
2. Repository name: autoraos-site
3. Description: AUTORA OS Website
4. Visibility: Public
5. DO NOT check "Initialize with README"
6. Click "Create repository"
```

### Step 2: Push Your Code (1 min)
Replace `YOUR_USERNAME` with your GitHub username:

```bash
cd "/Users/vuyomabilisa/Documents/New project"

git remote add origin https://github.com/YOUR_USERNAME/autoraos-site.git
git branch -M main
git push -u origin main
```

**Note:** You may be prompted for GitHub credentials. Use a Personal Access Token:
- Go to: https://github.com/settings/tokens/new
- Give it "repo" scope
- Use token as password

### Step 3: Deploy to Vercel (2 min)
```
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Find and select "autoraos-site"
5. Click "Import"
6. Vercel auto-detects Next.js ✅
7. Click "Deploy"
```

**Deployment happens automatically!** ⚡

### Step 4: Set Environment Variables (30 sec)
In your Vercel project, go to **Settings → Environment Variables**

Copy these from your `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SENDGRID_API_KEY
GOOGLE_MAPS_API_KEY
```

Add each one and **redeploy**:
- Go to Deployments
- Click last deployment
- Click "Options" → "Redeploy"

### Step 5: Connect Your Domain (1-2 days)
In Vercel project settings:
```
1. Go to Settings → Domains
2. Add "autoraos.com"
3. Vercel shows DNS instructions
4. Update your domain registrar:
   - If Vercel suggests nameservers → Use those
   - If A record → Add the IP Vercel provides
5. Add "www.autoraos.com" as well
```

**⏱️ DNS propagation takes 24-48 hours**

---

## ✅ After Deployment

- **autoraos.com** = Live & accessible
- **Free SSL Certificate** = Automatic via Let's Encrypt
- **Global CDN** = Fast worldwide
- **Auto-scaling** = Handles traffic spikes
- **Zero-downtime updates** = Push to GitHub → Auto deployed

---

## 🆘 Troubleshooting

### "Can't find git repository"
- Make sure repo is Public on GitHub
- Wait 30 seconds and try again

### "Build fails"
- Check Environment Variables are set
- Run `npm run build` locally to test
- Check error logs in Vercel dashboard

### "Domain not working"
- Check DNS is correct
- Wait 48 hours for full propagation
- Test with: `nslookup autoraos.com`

### "Environment variables not working"
- Set them in Vercel Settings
- **Redeploy** after adding variables
- Don't hardcode keys in code

---

## 📞 Quick Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub New Repo:** https://github.com/new
- **GitHub Tokens:** https://github.com/settings/tokens/new
- **Your Domain Registrar:** (where you bought autoraos.com)
- **Vercel Docs:** https://vercel.com/docs

---

## 🎯 Deployment Status

Your project is **100% ready to deploy**:
- ✅ Build tested locally
- ✅ Git repository initialized
- ✅ Next.js configured
- ✅ Environment variables documented
- ✅ vercel.json configured

**Just push to GitHub and Vercel will handle the rest!**

---

Questions? Check DEPLOYMENT.md for detailed info.
