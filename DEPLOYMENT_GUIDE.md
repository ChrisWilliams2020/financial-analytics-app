# 🚀 Financial Analytics App - Deployment Guide

## Quick Deployment Options

### Option 1: Vercel (Recommended - 5 minutes)
✅ Best for Next.js apps
✅ Free tier available
✅ Automatic HTTPS
✅ Global CDN
✅ CI/CD built-in

### Option 2: Netlify (Alternative)
✅ Free tier available
✅ Easy setup
✅ Good performance

### Option 3: AWS/DigitalOcean (Advanced)
⚠️ Requires more setup
⚠️ Monthly costs
✅ Full control

---

## 🎯 OPTION 1: Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free at vercel.com)
- This app pushed to GitHub

### Step 1: Push to GitHub (if not already done)

```bash
cd ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app

# Initialize git (if not already)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Financial Analytics App"

# Create GitHub repo and push
# (Go to github.com and create a new repository)
git remote add origin https://github.com/YOUR_USERNAME/financial-analytics-app.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Via Vercel Dashboard:**
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework Preset: **Next.js**
   - Root Directory: `./`
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
5. Click "Deploy"

**Via Vercel CLI (Faster):**
```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

### Step 3: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

```env
# Required
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app

# Optional (if using these features)
ANTHROPIC_API_KEY=your_anthropic_key_here
STRIPE_SECRET_KEY=your_stripe_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key_here

# Database (if you add one later)
DATABASE_URL=your_database_url_here
```

### Step 4: Redeploy with Environment Variables
```bash
vercel --prod
```

---

## 🎯 OPTION 2: Deploy to Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Build the app
```bash
npm run build
```

### Step 3: Deploy
```bash
# Login to Netlify
netlify login

# Deploy
netlify deploy

# Deploy to production
netlify deploy --prod
```

### Step 4: Configure Build Settings
In Netlify Dashboard:
- Build command: `npm run build`
- Publish directory: `.next`

---

## 🎯 OPTION 3: Manual Deployment (VPS/Server)

### Step 1: Prepare Server
```bash
# SSH into your server
ssh user@your-server.com

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2
```

### Step 2: Upload Your App
```bash
# On your local machine
rsync -avz ~/Downloads/medpact_mvp_enterprise_pack/src/financial-analytics-app/ user@your-server.com:/var/www/financial-analytics-app/
```

### Step 3: Setup on Server
```bash
# On server
cd /var/www/financial-analytics-app

# Install dependencies
npm install

# Build
npm run build

# Start with PM2
pm2 start npm --name "financial-analytics" -- start

# Save PM2 config
pm2 save

# Auto-start on reboot
pm2 startup
```

### Step 4: Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo apt install nginx

# Create config
sudo nano /etc/nginx/sites-available/financial-analytics
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/financial-analytics /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

## 🔧 Pre-Deployment Checklist

### 1. Build Test
```bash
npm run build
```
✅ Should complete without errors

### 2. Production Test Locally
```bash
npm run build
npm start
```
✅ Test all pages work

### 3. Environment Variables
Create `.env.production`:
```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
# Add other vars as needed
```

### 4. Security Headers (Add to next.config.js)
```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig
```

### 5. SEO Optimization
Add to `app/layout.tsx`:
```typescript
export const metadata = {
  title: 'MedPact Financial Analytics',
  description: 'Healthcare financial analytics and price transparency platform',
  keywords: 'healthcare, analytics, price transparency, medical billing',
  openGraph: {
    title: 'MedPact Financial Analytics',
    description: 'Healthcare financial analytics and price transparency platform',
    url: 'https://your-domain.com',
    siteName: 'MedPact',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MedPact Financial Analytics',
    description: 'Healthcare financial analytics and price transparency platform',
  },
}
```

---

## 📊 Post-Deployment Tasks

### 1. Setup Monitoring
- [ ] Add Google Analytics
- [ ] Setup error tracking (Sentry)
- [ ] Configure uptime monitoring

### 2. Performance
- [ ] Run Lighthouse audit
- [ ] Optimize images
- [ ] Enable caching

### 3. Security
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Add rate limiting
- [ ] Setup security headers

### 4. Backup
- [ ] Setup database backups
- [ ] Code repository backup
- [ ] Environment variables backup

---

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Environment Variables Not Working
- Check `.env.local` is NOT committed to git
- Verify variables are prefixed with `NEXT_PUBLIC_` for client-side
- Redeploy after adding new env vars

### Slow Performance
- Enable Next.js Image Optimization
- Add CDN for static assets
- Enable compression in Nginx

---

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support
- **Netlify Docs:** https://docs.netlify.com

---

## 🎉 Success Checklist

After deployment:
- [ ] Site is accessible at your domain
- [ ] HTTPS is working
- [ ] All pages load correctly
- [ ] Forms and uploads work
- [ ] Analytics tracking active
- [ ] Error monitoring setup
- [ ] Backup system configured
- [ ] Documentation updated

**Your app is now live! 🚀**

---

## Quick Deploy Command (Vercel)

```bash
# One command deployment!
npm install -g vercel && vercel --prod
```

That's it! Your Financial Analytics App will be live in minutes.
