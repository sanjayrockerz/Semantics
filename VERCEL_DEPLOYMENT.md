# Deploying to Vercel

## 📋 Important Considerations

### ⚠️ Storage Limitations
**The current setup stores videos in the `/backend/uploads` folder, which WILL NOT PERSIST on Vercel.**

Vercel serverless functions use ephemeral `/tmp` storage that is cleared after each function execution. This means:
- ❌ Uploaded videos will disappear after deployment
- ❌ Video files cannot be stored permanently in the serverless environment

### 🔧 For Production Use
You'll need to integrate cloud storage:
- **AWS S3** - Most popular, cost-effective
- **Cloudinary** - Media-specific with transformations
- **Azure Blob Storage** - Good for Azure ecosystem
- **Google Cloud Storage** - Google Cloud option

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel CLI (Recommended)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy from project root**
   ```bash
   vercel
   ```
   
4. **Follow the prompts:**
   - Set up and deploy? → `Y`
   - Which scope? → Select your account
   - Link to existing project? → `N`
   - What's your project's name? → `semantic-footage` (or your choice)
   - In which directory is your code located? → `./`
   - Want to modify settings? → `N`

5. **Set Environment Variables**
   ```bash
   vercel env add VITE_API_URL
   ```
   Enter the value: `https://your-app.vercel.app` (use your actual Vercel URL)

6. **Deploy to production**
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard

1. **Push to GitHub** (already done ✅)
   
2. **Import to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import from GitHub: `sanjayrockerz/Semantics`

3. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build` (already configured)
   - Output Directory: `dist` (already configured)

4. **Add Environment Variables:**
   - Key: `VITE_API_URL`
   - Value: Leave empty initially, then update after first deployment to your Vercel URL
   
5. **Click Deploy**

6. **After First Deployment:**
   - Go to Project Settings → Environment Variables
   - Update `VITE_API_URL` to your deployment URL (e.g., `https://semantic-footage.vercel.app`)
   - Redeploy

## 📝 Post-Deployment Configuration

After your first deployment, update the environment variable:

1. Note your deployment URL (e.g., `https://semantic-footage-xyz.vercel.app`)
2. Update the `VITE_API_URL` environment variable with this URL
3. Trigger a new deployment (automatic if you push to GitHub)

## ⏱️ Current Limitations

1. **Function Timeout:** 10 seconds (configured in vercel.json)
   - Large video processing may timeout
   - Consider using background jobs with external queue

2. **Memory Limit:** 1024MB (configured in vercel.json)
   - Should be sufficient for video streaming
   - May limit simultaneous video processing

3. **Lambda Size:** 50MB max (configured in vercel.json)
   - Includes all dependencies and code

## 🧪 Testing Your Deployment

After deployment:

1. **Check Health Endpoint:**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Test in Browser:**
   - Visit your Vercel URL
   - Try the search functionality
   - **Note:** Upload will work but videos won't persist after serverless function completes

## 🛠️ Future Production Setup

For a production-ready version:

1. **Integrate Cloud Storage:**
   - Update `backend/main.py` to use S3/Cloudinary SDK
   - Replace local file storage with cloud URLs
   - Update video streaming to use cloud storage URLs

2. **Add Database:**
   - Replace in-memory `video_database` with PostgreSQL/MongoDB
   - Use Vercel Postgres or external database service

3. **Background Processing:**
   - Move video processing to queue system (AWS SQS, RabbitMQ)
   - Use separate worker services for heavy processing

4. **Caching:**
   - Add Redis for search result caching
   - Implement CDN for video delivery

## 📚 Learn More

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Python Runtime](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables)

---

**Need Help?** Check the [Vercel Community](https://github.com/vercel/community) or [Discord](https://vercel.com/discord)
