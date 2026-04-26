# Vercel Settings Verification Checklist

## 🔧 Manual Vercel Dashboard Checks

### 1. Project Overview
- [ ] Project name is correct
- [ ] Framework is detected as "Next.js"
- [ ] Latest deployment shows "Ready" status
- [ ] Production URL is accessible

### 2. Git Integration
**Path: Settings → Git**
- [ ] Repository: `your-username/your-repo-name`
- [ ] Production Branch: `main` (or your default branch)
- [ ] Deploy Hooks: Enabled
- [ ] Auto-deploy: Enabled

### 3. Build & Output Settings
**Path: Settings → General**
- [ ] Framework Preset: `Next.js`
- [ ] Build Command: `npm run build` (or leave empty for auto-detection)
- [ ] Output Directory: (leave empty for Next.js)
- [ ] Install Command: `npm install` (or leave empty)
- [ ] Development Command: `npm run dev`

### 4. Environment Variables
**Path: Settings → Environment Variables**
- [ ] All required variables are present
- [ ] Sensitive variables are encrypted
- [ ] Variables are set for correct environments (Production/Preview/Development)

### 5. Functions
**Path: Settings → Functions**
- [ ] Timeout: 10s (increase if needed)
- [ ] Memory: 1024 MB (increase if needed)
- [ ] Runtime: Node.js 18.x or 20.x

### 6. Domains
**Path: Settings → Domains**
- [ ] Production domain is active
- [ ] SSL certificate is valid
- [ ] DNS is properly configured

## 🚨 Common Issues & Solutions

### Build Failures
```bash
# Issue: TypeScript errors
Solution: Fix type errors or add to tsconfig.json:
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}

# Issue: Missing dependencies
Solution: Ensure all dependencies are in package.json:
npm install --save missing-package

# Issue: Memory limit exceeded
Solution: Increase memory in Vercel settings or optimize build
```

### Runtime Errors
```bash
# Issue: Environment variables not found
Solution: Add variables in Vercel dashboard under Settings → Environment Variables

# Issue: API routes not working
Solution: Ensure API routes are in pages/api/ or app/api/ directory

# Issue: Static files not loading
Solution: Check public/ directory structure and imports
```

### Deployment Issues
```bash
# Issue: Auto-deploy not working
Solution: Check webhook in GitHub repo settings

# Issue: Wrong branch deploying
Solution: Update production branch in Vercel settings

# Issue: Build command not found
Solution: Verify scripts in package.json
```

## 🔍 Verification Commands

Run these locally before deploying:

```bash
# 1. Test build locally
npm run build

# 2. Test production build
npm start

# 3. Check for TypeScript errors
npx tsc --noEmit

# 4. Verify environment variables
node -e "console.log(process.env.NODE_ENV)"

# 5. Check package.json scripts
npm run --silent

# 6. Verify dependencies
npm audit

# 7. Test API routes (if applicable)
curl http://localhost:3000/api/health
```

## 📋 Pre-Deployment Checklist

Before pushing to GitHub:

- [ ] All tests pass locally
- [ ] Build completes without errors
- [ ] No TypeScript compilation errors
- [ ] Environment variables are documented
- [ ] .gitignore includes build artifacts
- [ ] Package.json has all required scripts
- [ ] No sensitive data in code
- [ ] API routes work locally
- [ ] Static assets load correctly

## 🎯 Post-Deployment Verification

After Vercel deployment:

- [ ] Visit production URL
- [ ] Test all major functionality
- [ ] Check browser console for errors
- [ ] Verify API endpoints work
- [ ] Test on mobile devices
- [ ] Check page load speeds
- [ ] Verify SEO meta tags
- [ ] Test form submissions (if applicable)

## 📞 Getting Help

If issues persist:

1. Check Vercel deployment logs
2. Review build output for specific errors
3. Compare working local build with deployment
4. Check Vercel status page for platform issues
5. Contact Vercel support with specific error messages