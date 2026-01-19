# Semantic Video Search Engine

A high-performance semantic search engine for video footage, built with FastAPI (Backend) and React (Frontend).

## ⚡ Quick Start (5 Minutes)

### 1. Get FREE Cloudinary Account (Required)
```bash
# Run the setup helper
setup-cloudinary.bat
```
Or manually:
1. Sign up at [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free) (no credit card)
2. Get your Cloud Name, API Key, API Secret
3. Create `.env` file with your credentials (see [CLOUDINARY_SETUP.md](CLOUDINARY_SETUP.md))

### 2. Start Backend
```powershell
cd backend
python -m pip install -r requirements.txt
python main.py
```

### 3. Start Frontend (New Terminal)
```powershell
npm install
npm run dev
```

Open http://localhost:5173 🎉

## Features

*   **Natural Language Search:** Find clips using queries like "happy person" or "car chase".
*   **Cloud Storage:** Videos stored on Cloudinary (25GB free tier)
*   **Serverless Ready:** Deploys to Vercel with persistent storage
*   **Automated Pipeline:** Uploaded videos are analyzed and tagged automatically

## 🚀 One-Click Deployment

1.  **Fork** this repository.
2.  **Import** into Vercel.
3.  Vercel will detect `vercel.json` and configure the build automatically.
4.  Add the **Environment Variables** (see `.env.example`).
5.  **Deploy**.

## 🛠 Local Development

### Prerequisites
*   Python 3.11+
*   Node.js 18+
*   FFmpeg (installed and in PATH)

### 1. Backend Setup
```bash
# Create venv
python -m venv venv
source venv/bin/activate

# Install deps
pip install -r backend/requirements.txt

# Run server
uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
# Install deps
npm install

# Run dev server
npm run dev
```
The frontend proxies `/api` requests to `http://localhost:8000`.

## 📂 Project Structure

*   `/backend` - FastAPI serverless functions (handled by Mangum).
*   `/src` - React frontend code.
*   `vercel.json` - Routing configuration for Vercel.
