# Deploy Backend to Render (Free)

## Quick Setup (5 minutes)

Your Python backend needs a proper server. Vercel doesn't handle Python FastAPI well.

### Option: Deploy Backend to Render (FREE)

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click **"New +" → "Web Service"**
4. Select your repository: `sanjayrockerz/Semantics`
5. Configure:
   - **Name**: `semantic-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add Environment Variables:
   - `CLOUDINARY_CLOUD_NAME` = ddmmrsbxd
   - `CLOUDINARY_API_KEY` = 236792262539486
   - `CLOUDINARY_API_SECRET` = HaaRG5maMrX3u_7qp1Ct-fSBh6U
7. Click **"Create Web Service"**

### After Deployment:

1. Copy your Render URL (e.g., `https://semantic-backend.onrender.com`)
2. Update Vercel Environment Variable:
   - Go to Vercel → semanticsfootage → Settings → Environment Variables
   - Update `VITE_API_URL` = `https://semantic-backend.onrender.com`
3. Redeploy Vercel frontend

**Then everything will work!** ✅

Render free tier:
- ✅ 750 hours/month free
- ✅ Perfect for Python/FastAPI
- ✅ Auto-deploys from GitHub
- ✅ Much better than Vercel for backends
