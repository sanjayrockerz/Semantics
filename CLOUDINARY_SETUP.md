# 🎬 Cloudinary Setup - FREE Video Storage

## Get Your FREE Cloudinary Account (25GB Storage + 25GB Bandwidth)

### 1. Sign Up (No Credit Card Required)
1. Go to [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Sign up with email or GitHub
3. Verify your email

### 2. Get Your Credentials
After logging in:
1. Go to **Dashboard** → **Account Details**
2. Copy these 3 values:
   - **Cloud Name** (e.g., "dab12xyzqp")
   - **API Key** (e.g., "123456789012345")
   - **API Secret** (click "Reveal" to show)

### 3. Set Environment Variables

#### For Local Development:
Create `.env` file in the root directory:
```bash
# Backend Cloudinary Config
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

#### For Vercel Deployment:
Add environment variables in Vercel dashboard:
1. Go to your project → **Settings** → **Environment Variables**
2. Add these 3 variables:
   - `CLOUDINARY_CLOUD_NAME` = your cloud name
   - `CLOUDINARY_API_KEY` = your API key
   - `CLOUDINARY_API_SECRET` = your API secret
3. Click "Save"

### 4. Install Dependencies
```powershell
cd backend
python -m pip install -r requirements.txt
```

### 5. Test It!
```powershell
# Start backend
cd backend
python main.py
```

Upload a video and it will be stored on Cloudinary! ✨

## ✅ What's Fixed Now

- ✅ Videos uploaded to cloud storage (Cloudinary)
- ✅ Videos persist forever (not ephemeral)
- ✅ Works on Vercel serverless
- ✅ CDN delivery (fast worldwide)
- ✅ Free tier: 25GB storage, 25GB/month bandwidth
- ✅ No file size limits (within reason)
- ✅ Automatic video optimization

## 🔧 How It Works

1. User uploads video → Sent to Cloudinary
2. Cloudinary stores it permanently
3. Returns a secure URL (https://res.cloudinary.com/...)
4. Video plays from Cloudinary CDN
5. Fast delivery worldwide with Range Request support

## 📊 Free Tier Limits

- **Storage**: 25 GB
- **Bandwidth**: 25 GB/month
- **Transformations**: 25 credits/month
- **Video Processing**: Included
- **CDN Delivery**: Included

Perfect for development and small projects!

## 🚀 Ready to Deploy

Once you've set up Cloudinary:
```bash
# Deploy to Vercel
vercel --prod
```

Don't forget to set the environment variables in Vercel dashboard!
