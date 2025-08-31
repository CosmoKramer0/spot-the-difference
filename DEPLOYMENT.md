# 🚀 Deployment Guide - Spot the Difference Game

## Overview
This guide covers deploying the Spot the Difference game to production with separate deployments for frontend (Vercel) and backend (Railway).

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Update production environment variables
- [ ] Generate secure JWT secret
- [ ] Set up production database
- [ ] Configure CORS domains

### 2. Icons & Assets
- [ ] Create app icons (192x192, 512x512)
- [ ] Create favicon.ico
- [ ] Add screenshot images for PWA

### 3. Testing
- [ ] Run production build locally
- [ ] Test API endpoints
- [ ] Verify PWA functionality

## 🖥️ Backend Deployment (Railway)

### Step 1: Prepare Backend
```bash
cd backend
npm run build
```

### Step 2: Deploy to Railway
1. **Connect Repository**
   - Go to [Railway.app](https://railway.app)
   - Create new project from GitHub repo
   - Select the `backend` folder

2. **Set Environment Variables**
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=your-super-secure-jwt-secret
   DATABASE_URL=your-production-database-url
   FRONTEND_URL=https://your-frontend-domain.vercel.app
   ```

3. **Configure Deployment**
   - Railway will use `railway.json` configuration
   - Build command: `npm install && npm run build`
   - Start command: `npm start`

### Step 3: Database Setup
1. **Add PostgreSQL Service**
   - In Railway dashboard, add PostgreSQL
   - Copy the DATABASE_URL to environment variables

2. **Run Migrations**
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🌐 Frontend Deployment (Vercel)

### Step 1: Prepare Frontend
```bash
cd frontend
npm run build
```

### Step 2: Deploy to Vercel
1. **Connect Repository**
   - Go to [Vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set root directory to `frontend`

2. **Set Environment Variables**
   ```
   VITE_API_URL=https://your-backend-domain.railway.app
   VITE_APP_NAME=Spot the Difference
   VITE_APP_VERSION=1.0.0
   ```

3. **Configure Build Settings**
   - Framework: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

### Step 3: Custom Domain (Optional)
1. Add custom domain in Vercel settings
2. Update CORS settings in backend
3. Update Open Graph URLs

## 📱 PWA Setup

### Required Assets
Create these files in `frontend/public/`:
- `favicon.ico` (48x48)
- `icon-192x192.png` (192x192)
- `icon-512x512.png` (512x512)
- `screenshot-narrow.png` (390x844)
- `screenshot-wide.png` (1280x720)

### PWA Testing
1. Open Chrome DevTools
2. Go to Application tab
3. Check Manifest and Service Worker
4. Test "Add to Home Screen"

## 🔧 Production Optimizations

### Backend
- [ ] Enable compression middleware
- [ ] Set up rate limiting
- [ ] Configure proper logging
- [ ] Enable HTTPS redirect
- [ ] Set up monitoring

### Frontend
- [ ] Enable Gzip compression
- [ ] Configure CDN
- [ ] Set up error tracking
- [ ] Enable performance monitoring
- [ ] Configure analytics

## 📊 Monitoring & Analytics

### Backend Monitoring
- Health check endpoint: `/api/health`
- Error logging with structured logs
- Performance metrics
- Database connection monitoring

### Frontend Analytics
- Google Analytics (optional)
- User engagement metrics
- Game completion rates
- Error tracking

## 🐛 Troubleshooting

### Common Issues
1. **CORS Errors**
   - Verify FRONTEND_URL in backend environment
   - Check domain spelling and protocol

2. **Database Connection**
   - Verify DATABASE_URL format
   - Check database permissions
   - Run migrations if needed

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript errors

### Debug Commands
```bash
# Backend health check
curl https://your-backend.railway.app/api/health

# Frontend build
npm run build

# Database connection test
npx prisma db push --preview-feature
```

## 🎯 Post-Deployment

### Testing Checklist
- [ ] User registration works
- [ ] Game flow completes
- [ ] Leaderboard updates
- [ ] PWA installation works
- [ ] Mobile responsiveness
- [ ] Performance is acceptable

### Go-Live Checklist
- [ ] Update README with live URLs
- [ ] Share game with users
- [ ] Monitor for initial issues
- [ ] Collect user feedback
- [ ] Plan future improvements

## 📝 Live URLs Template
Once deployed, update these:
- **Game URL**: https://spot-difference.vercel.app
- **API URL**: https://spot-difference-api.railway.app
- **Health Check**: https://spot-difference-api.railway.app/api/health

---

## 🎉 Congratulations!
Your Spot the Difference game is now live and ready for players worldwide! 🌍