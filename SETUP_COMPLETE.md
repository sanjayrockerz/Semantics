# 🎬 Semantic Video Search - Ready for Vercel! ✅

## ✨ What's Changed

Your app now uses **Cloudinary FREE cloud storage** instead of local file storage. This means:

### ✅ NOW WORKS ON VERCEL
- Videos uploaded to cloud (Cloudinary)
- Videos persist forever (not ephemeral)
- 25GB storage + 25GB bandwidth FREE
- CDN delivery worldwide
- Automatic Range Request support

### ❌ BEFORE (Broken on Vercel)
- Videos stored in `/tmp` folder
- Disappeared after serverless function completes
- Users couldn't watch uploaded videos

---

## 🚀 How to Use (3 Steps)

### Step 1: Get FREE Cloudinary Credentials (2 minutes)

1. Go to: https://cloudinary.com/users/register_free
2. Sign up (NO credit card required)
3. Copy 3 values from your dashboard:
   - **Cloud Name** (e.g., "dab12xyzqp")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (click "Reveal" button)

### Step 2: Set Up Locally

**Option A - Easy Way (Recommended):**
```powershell
# Run this in project root
setup-cloudinary.bat
```
It will ask for your 3 credentials and create `.env` file automatically.

**Option B - Manual Way:**
Create `.env` file in root directory:
```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
VITE_API_URL=http://localhost:8000
```

### Step 3: Run It!

```powershell
# Terminal 1 - Backend
cd backend
python main.py

# Terminal 2 - Frontend
npm run dev
```

Open http://localhost:5173 and upload a video! 🎉

---

## 🌐 Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm i -g vercel
vercel login
vercel
```

### Option 2: Vercel Dashboard
1. Go to https://vercel.com/new
2. Import from GitHub: `sanjayrockerz/Semantics`
3. **Add Environment Variables:**
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
   - `VITE_API_URL` = leave empty (auto-filled)
4. Click "Deploy"

---

## 📋 Technical Changes

### Files Modified:
1. **backend/requirements.txt** - Added `cloudinary==1.41.0`
2. **backend/main.py** - Replaced local file storage with Cloudinary upload
3. **Video Model** - Added `cloudinaryUrl` and `cloudinaryPublicId` fields
4. **Stream Endpoint** - Now redirects to Cloudinary CDN URL
5. **Processing** - Uses Cloudinary URL instead of local file path

### New Files:
- `CLOUDINARY_SETUP.md` - Detailed setup guide
- `VERCEL_DEPLOYMENT.md` - Deployment instructions
- `setup-cloudinary.bat` - Automated setup script
- `backend/uploads/.gitkeep` - Placeholder (not used with Cloudinary)

### How It Works Now:
```
User uploads video
    ↓
Sent to Cloudinary API
    ↓
Cloudinary stores permanently
    ↓
Returns secure URL (https://res.cloudinary.com/...)
    ↓
URL stored in database
    ↓
Video plays from Cloudinary CDN
    ↓
✅ Works everywhere (local, Vercel, etc.)
```

---

## 🎯 Benefits

| Feature | Before (Local) | After (Cloudinary) |
|---------|---------------|-------------------|
| **Vercel Compatible** | ❌ No | ✅ Yes |
| **Video Persistence** | ❌ Temporary | ✅ Permanent |
| **Storage Cost** | Free (local only) | Free (25GB) |
| **Bandwidth** | Limited | 25GB/month free |
| **CDN Delivery** | ❌ No | ✅ Yes |
| **Range Requests** | Manual | ✅ Automatic |
| **Worldwide Access** | ❌ No | ✅ Yes |

---

## 💰 Cloudinary Free Tier

Perfect for your project:
- **Storage:** 25 GB
- **Bandwidth:** 25 GB/month
- **Transformations:** 25 credits/month
- **Videos:** Unlimited uploads
- **CDN:** Included
- **No Credit Card Required**

---

## ✅ Testing Checklist

After setup, test these:

1. **Upload Video**
   - Go to Upload page
   - Drag & drop a video
   - Wait for processing
   - ✅ Video should appear in search

2. **Search Video**
   - Go to Search page
   - Type keywords from your video filename
   - ✅ Should find your video

3. **Play Video**
   - Click on search result
   - Video should play
   - ✅ Seek/scrub should work smoothly

4. **Refresh Page**
   - Refresh browser
   - Search again
   - ✅ Video still there (persists!)

---

## 🆘 Troubleshooting

### "Upload failed: list indices must be integers"
- **Cause:** Cloudinary credentials not set
- **Fix:** Run `setup-cloudinary.bat` or check `.env` file

### "Video not ready"
- **Cause:** Video still processing
- **Fix:** Wait 5-10 seconds and try again

### "Video not found"
- **Cause:** Upload failed or database cleared
- **Fix:** Upload video again

### Videos disappear on restart
- **Cause:** Using in-memory database (normal for development)
- **Fix:** Videos in Cloudinary remain, but you need to add database for production

---

## 📚 Documentation

- [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md) - Detailed Cloudinary setup
- [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) - Deployment guide
- [README.md](README.md) - Project overview

---

## 🎉 You're Ready!

Your app now has:
- ✅ Cloud storage (FREE)
- ✅ Vercel compatibility
- ✅ Persistent videos
- ✅ CDN delivery
- ✅ Professional infrastructure

**Just set up Cloudinary and deploy!** 🚀
