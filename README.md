# Semantic Video Search Engine

A high-performance semantic search engine for video footage, built with FastAPI (Backend) and React (Frontend).

## Features

*   **Natural Language Search:** Find clips using queries like "happy person" or "car chase".
*   **Automated Pipeline:** Uploaded videos are standardized to 360p/30fps, segmented, and embedded.
*   **Serverless Architecture:** Deploys seamlessly to Vercel.

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
