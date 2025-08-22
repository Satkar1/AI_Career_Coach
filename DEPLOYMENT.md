# Deployment Guide - AI Career Coach Platform

This comprehensive guide will walk you through deploying the AI Career Coach platform to production using Vercel and Neon PostgreSQL.

## 📋 Prerequisites

Before starting deployment, ensure you have:

- [ ] GitHub account with your code repository
- [ ] Vercel account (free tier available)
- [ ] Neon PostgreSQL account (free tier available)
- [ ] Google Cloud account for Gemini AI API
- [ ] Domain name (optional, Vercel provides free subdomains)

## 🗄️ Database Setup (Neon PostgreSQL)

### Step 1: Create Neon Database

1. **Sign up for Neon**
   - Go to [neon.tech](https://neon.tech)
   - Click "Sign up" and create an account
   - Verify your email address

2. **Create a New Project**
   - Click "Create Project"
   - Choose a project name: `ai-career-coach`
   - Select region closest to your users
   - Choose PostgreSQL version (latest stable)
   - Click "Create Project"

3. **Get Database URL**
   - Navigate to your project dashboard
   - Go to "Connection Details"
   - Copy the connection string (starts with `postgresql://`)
   - Save this as your `DATABASE_URL`

### Step 2: Configure Database Schema

1. **Local Setup First**
   ```bash
   # Install dependencies
   npm install

   # Set your DATABASE_URL in .env
   echo "DATABASE_URL=your_neon_connection_string" > .env

   # Push schema to database
   npm run db:push
   ```

2. **Verify Database Tables**
   - In Neon dashboard, go to "Tables"
   - Confirm these tables exist:
     - `users`
     - `assessments`
     - `resumes`
     - `interviews`
     - `career_paths`
     - `skills`
     - `goals`
     - `recommendations`

## 🤖 AI Service Setup (Google Gemini)

### Step 1: Get Gemini API Key

1. **Google AI Studio Setup**
   - Go to [ai.google.dev](https://ai.google.dev)
   - Click "Get started" and sign in with Google account
   - Accept terms of service

2. **Generate API Key**
   - Click "Get API key"
   - Click "Create API key in new project" or select existing project
   - Copy the generated API key
   - Save this as your `GEMINI_API_KEY`

3. **Test API Key**
   ```bash
   # Test in your local environment
   export GEMINI_API_KEY=your_api_key
   npm run dev
   
   # Try creating an assessment to verify AI integration works
   ```

## 🚀 Vercel Deployment

### Step 1: Prepare Repository

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify Build Locally**
   ```bash
   npm run build
   ```

### Step 2: Deploy to Vercel

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Select "ai-career-coach" project

2. **Configure Build Settings**
   - Framework Preset: `Other`
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

3. **Environment Variables**
   Add these environment variables in Vercel dashboard:
   
   ```env
   DATABASE_URL=your_neon_postgresql_url
   GEMINI_API_KEY=your_gemini_api_key
   NODE_ENV=production
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete (usually 2-3 minutes)
   - Note your deployment URL (e.g., `https://your-app.vercel.app`)

### Step 3: Verify Deployment

1. **Check Application**
   - Visit your Vercel URL
   - Test basic navigation
   - Try creating an account (if applicable)
   - Test AI features (assessment, resume analysis)

2. **Monitor Logs**
   - In Vercel dashboard, go to "Functions"
   - Check logs for any errors
   - Verify database connections

## ⚙️ Production Configuration

### Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `GEMINI_API_KEY` | Google Gemini AI API key | `AIza...` |
| `NODE_ENV` | Environment mode | `production` |

### Performance Optimization

1. **Vercel Settings**
   ```json
   // vercel.json (optional)
   {
     "functions": {
       "server/index.ts": {
         "maxDuration": 30
       }
     },
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "X-Frame-Options",
             "value": "DENY"
           },
           {
             "key": "X-Content-Type-Options",
             "value": "nosniff"
           }
         ]
       }
     ]
   }
   ```

2. **Database Optimization**
   - Enable connection pooling in Neon
   - Set appropriate connection limits
   - Monitor query performance

## 🔒 Security Configuration

### Step 1: Environment Security

1. **Secure Environment Variables**
   - Never commit `.env` files
   - Use Vercel's encrypted environment variables
   - Rotate API keys regularly

2. **Database Security**
   - Enable SSL connections (Neon default)
   - Use connection pooling
   - Set up read replicas if needed

### Step 2: Application Security

1. **CORS Configuration**
   ```typescript
   // In server/index.ts
   app.use((req, res, next) => {
     res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
     next();
   });
   ```

2. **Rate Limiting**
   ```bash
   npm install express-rate-limit
   