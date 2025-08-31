# 🚀 Beginner's Guide to Deploying Your Game

**Don't worry! I'll walk you through every step. By the end, your game will be live on the internet for everyone to play!**

## 📋 What We're Going to Do

1. **Put your code on GitHub** (so the hosting services can access it)
2. **Deploy the Backend** (the server that handles data) to Railway
3. **Deploy the Frontend** (the game interface) to Vercel
4. **Connect them together**
5. **Test everything works!**

---

## Step 1: Put Your Code on GitHub 📂

### Why GitHub?
GitHub stores your code online so hosting services like Vercel and Railway can access it.

### How to do it:

1. **Create a GitHub account** at [github.com](https://github.com) (if you don't have one)

2. **Install GitHub Desktop** (easier than command line):
   - Download from [desktop.github.com](https://desktop.github.com)
   - Install and sign in with your GitHub account

3. **Upload your project**:
   - Open GitHub Desktop
   - Click "Add an Existing Repository from your Hard Drive"
   - Select your `spot-the-difference` folder
   - Click "Publish repository"
   - **Important**: Uncheck "Keep this code private" so hosting services can access it
   - Click "Publish Repository"

**✅ Done!** Your code is now on GitHub.

---

## Step 2: Deploy the Backend to Railway 🚂

### Why Railway?
Railway makes it super easy to deploy Node.js applications and automatically provides a database.

### Step-by-step:

1. **Go to [railway.app](https://railway.app)**
2. **Sign up** using your GitHub account
3. **Create a new project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `spot-the-difference` repository
   - **Important**: Set root directory to `backend`

4. **Add a Database**:
   - In your Railway project dashboard
   - Click "New" → "Database" → "PostgreSQL"
   - This creates a database automatically!

5. **Set Environment Variables**:
   - Click on your backend service
   - Go to "Variables" tab
   - Add these variables:
   ```
   NODE_ENV=production
   PORT=3001
   JWT_SECRET=mysupersecretkey123
   FRONTEND_URL=https://your-game.vercel.app
   ```
   - **Note**: We'll update FRONTEND_URL later

6. **Deploy**:
   - Railway will automatically build and deploy
   - Wait for the "Success" status
   - Copy your Railway URL (something like: `https://backend-production-xxxx.railway.app`)

**✅ Backend is live!** Test it by visiting: `your-railway-url/api/health`

---

## Step 3: Deploy the Frontend to Vercel 🌐

### Why Vercel?
Vercel is perfect for React applications and provides fast, global hosting.

### Step-by-step:

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up** using your GitHub account
3. **Import your project**:
   - Click "New Project"
   - Find your `spot-the-difference` repository
   - Click "Import"
   - **Important**: Set root directory to `frontend`

4. **Configure Build Settings**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variable**:
   - In project settings, go to "Environment Variables"
   - Add: `VITE_API_URL` = `your-railway-backend-url`
   - Example: `VITE_API_URL=https://backend-production-xxxx.railway.app`

6. **Deploy**:
   - Click "Deploy"
   - Wait for success (usually 2-3 minutes)
   - Get your Vercel URL (something like: `https://spot-the-difference-git-main-yourname.vercel.app`)

**✅ Frontend is live!**

---

## Step 4: Connect Frontend and Backend 🔗

### Update Backend CORS Settings:

1. **Go back to Railway**
2. **Update the FRONTEND_URL variable**:
   - Use your actual Vercel URL
   - Example: `FRONTEND_URL=https://spot-the-difference-git-main-yourname.vercel.app`
3. **Redeploy the backend** (Railway does this automatically when you change variables)

---

## Step 5: Set Up the Database 🗄️

### Run Database Setup:

1. **In Railway, click on your backend service**
2. **Go to "Deploy" tab**
3. **Click the three dots** → "Run Command"
4. **Run these commands one by one**:
   ```
   npx prisma migrate deploy
   npx ts-node src/seedData.ts
   ```

This creates the database tables and adds the 10 emoji icon sets!

---

## Step 6: Test Everything! 🧪

### Test Your Live Game:

1. **Visit your Vercel URL**
2. **Try to register** with your name and phone
3. **Play a few rounds**
4. **Check if the leaderboard works**

### Common Issues and Fixes:

**❌ "Network Error" or "Failed to fetch"**
- Check that VITE_API_URL in Vercel matches your Railway URL exactly
- Make sure FRONTEND_URL in Railway matches your Vercel URL exactly

**❌ "Database connection error"**
- Make sure you ran the database setup commands in Railway
- Check that the PostgreSQL service is running in Railway

**❌ "CORS error"**
- Double-check the FRONTEND_URL variable in Railway
- Make sure there are no extra spaces or trailing slashes

---

## 🎉 Congratulations!

**Your game is now LIVE on the internet!**

### Share Your Game:
- **Game URL**: Your Vercel URL
- **API URL**: Your Railway URL
- **Health Check**: Your Railway URL + `/api/health`

### What People Can Do:
- Play on desktop or mobile
- Install as a PWA app on their phone
- Share with friends
- Compete on the leaderboard

---

## 💡 Pro Tips for Later:

1. **Custom Domain**: You can add a custom domain in Vercel settings
2. **Monitoring**: Check Railway and Vercel dashboards for usage stats
3. **Updates**: When you push new code to GitHub, both services auto-deploy
4. **Analytics**: Add Google Analytics later if you want to track players

---

## 🆘 Need Help?

If something goes wrong:

1. **Check the logs**:
   - Railway: Go to "Deploy" tab and check build logs
   - Vercel: Go to project dashboard and check function logs

2. **Common fixes**:
   - Redeploy both services
   - Double-check all environment variables
   - Make sure GitHub repository is public

3. **Test locally first**:
   - Your `game-demo.html` should work before deploying

**Remember**: The first deployment might take a few tries to get right. That's totally normal! 

You've got this! 🚀