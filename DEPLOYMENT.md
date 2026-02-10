# Vercel Deployment Guide for autoraos.com

## Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- Registered domain: autoraos.com

## Deployment Steps

### 1. Push to GitHub
```bash
# Add all files
git add .

# Make initial commit
git commit -m "Initial site setup for autoraos.com"

# Create a new repository on GitHub (https://github.com/new)
# Then push to your repository
git remote add origin https://github.com/YOUR_USERNAME/autoraos-site.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js framework
5. Configure Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SENDGRID_API_KEY`
   - `GOOGLE_MAPS_API_KEY`
6. Click "Deploy"

### 3. Connect Custom Domain
1. In Vercel dashboard, go to Settings → Domains
2. Add "autoraos.com"
3. Follow instructions to update DNS:
   - Add `A` record pointing to Vercel's IP
   - Or use Vercel's nameservers (recommended)
4. Add "www.autoraos.com" as an alias

### 4. SSL Certificate
Vercel automatically provides free SSL/TLS certificates via Let's Encrypt

## Environment Variables

### Development (.env.local)
Copy these from your current configuration:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SENDGRID_API_KEY=your_sendgrid_key
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Production (in Vercel Dashboard)
Set the same variables in Project Settings → Environment Variables

## Troubleshooting

**Build fails:**
- Check that `npm run build` works locally
- Verify all environment variables are set

**Domain not working:**
- Wait 24-48 hours for DNS propagation
- Check DNS settings in your registrar

**Performance issues:**
- Enable Vercel Analytics in project settings
- Review build output for optimization opportunities

## Going Live Checklist
- [ ] GitHub repository created and pushed
- [ ] Vercel project deployed
- [ ] All environment variables configured
- [ ] Custom domain connected
- [ ] SSL certificate provisioned
- [ ] DNS propagated (verify with nslookup)
- [ ] Test all functionality at autoraos.com
- [ ] Set up monitoring and error tracking

---
For more info: https://vercel.com/docs/concepts/deployments/overview
