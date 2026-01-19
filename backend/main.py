from fastapi import FastAPI, UploadFile, File, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse, RedirectResponse
from pydantic import BaseModel
from typing import List, Optional, Dict, Literal
import os
import uuid
import time
import asyncio
from datetime import datetime
from pathlib import Path
import cloudinary
import cloudinary.uploader
import cloudinary.api

app = FastAPI(title="Semantic Video Search API")

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME", ""),
    api_key=os.getenv("CLOUDINARY_API_KEY", ""),
    api_secret=os.getenv("CLOUDINARY_API_SECRET", ""),
    secure=True
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Storage Setup
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Models
class Video(BaseModel):
    id: str
    filename: str
    durationSec: float
    uploadDate: str
    status: Literal["queued", "processing", "ready", "error"]
    thumbnailUrl: str
    progress: int
    cloudinaryUrl: Optional[str] = None
    cloudinaryPublicId: Optional[str] = None

class SearchFilters(BaseModel):
    minScore: float = 0.3
    sortBy: str = "relevance"

class SearchResult(BaseModel):
    id: str
    videoId: str
    videoFilename: str
    startSec: float
    endSec: float
    thumbnailUrl: str
    previewUrl: str
    tags: List[str]
    score: float
    confidence: int
    matchType: Literal["visual", "combined", "tag_boost"]
    description: str

class SearchResponse(BaseModel):
    results: List[SearchResult]
    totalResults: int
    executionTimeMs: int

# In-Memory Storage
videos_db: Dict[str, Video] = {}
searchable_clips: List[SearchResult] = []

# Semantic Profiles for AI Tagging Simulation
SEMANTIC_PROFILES = {
    'happy': {
        'tags': ['happy', 'joy', 'smile', 'laugh', 'celebration', 'positive', 'cheerful', 'friends'],
        'description': 'Subject displaying visible happiness and positive engagement',
        'thumbnail': 'https://images.unsplash.com/photo-1542596594-649edbc13630?w=800&q=80'
    },
    'sad': {
        'tags': ['sad', 'lonely', 'melancholy', 'depression', 'tear', 'grief', 'solitude', 'dark'],
        'description': 'Subject displaying visible sadness or melancholic atmosphere',
        'thumbnail': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80'
    },
    'excitement': {
        'tags': ['excitement', 'energy', 'wow', 'surprise', 'party', 'thrill', 'intense', 'festival'],
        'description': 'High energy scene with excited subjects or fast movement',
        'thumbnail': 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?w=800&q=80'
    },
    'calm': {
        'tags': ['calm', 'peaceful', 'serene', 'relax', 'quiet', 'meditation', 'soothing', 'sleep'],
        'description': 'Peaceful and still environment with calming atmosphere',
        'thumbnail': 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&q=80'
    },
    'fear': {
        'tags': ['fear', 'scary', 'dark', 'horror', 'anxiety', 'tension', 'spooky', 'night'],
        'description': 'Dark, high-contrast scene creating a sense of tension or fear',
        'thumbnail': 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80'
    },
    'nature': {
        'tags': ['nature', 'forest', 'trees', 'outdoor', 'landscape', 'scenic', 'wildlife', 'green'],
        'description': 'Natural landscape with scenic views and outdoor elements',
        'thumbnail': 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80'
    },
    'tech': {
        'tags': ['tech', 'cyberpunk', 'digital', 'screen', 'code', 'futuristic', 'modern', 'neon'],
        'description': 'Technology focused scene with screens or futuristic elements',
        'thumbnail': 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&q=80'
    },
    'action': {
        'tags': ['action', 'sport', 'fitness', 'run', 'fast', 'motion', 'dynamic', 'fight'],
        'description': 'Fast-paced action sequence with dynamic movement',
        'thumbnail': 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
    },
    'urban': {
        'tags': ['urban', 'city', 'street', 'building', 'architecture', 'crowd', 'busy', 'traffic'],
        'description': 'Urban city environment with architectural elements',
        'thumbnail': 'https://images.unsplash.com/photo-1449824913929-2b3a3e54da79?w=800&q=80'
    }
}

# Initialize with stock videos
searchable_clips = [
    SearchResult(
        id='stock_1',
        videoId='v1',
        videoFilename='joyful_park_scene.mp4',
        startSec=0,
        endSec=15,
        thumbnailUrl='https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80',
        previewUrl='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        tags=['happy', 'outdoor', 'people', 'joy', 'park', 'sun'],
        score=0,
        confidence=94,
        matchType='visual',
        description='People having a good time outdoors in the sun'
    ),
    SearchResult(
        id='stock_2',
        videoId='v2',
        videoFilename='urban_traffic.mp4',
        startSec=52,
        endSec=60,
        thumbnailUrl='https://images.unsplash.com/photo-1449824913929-2b3a3e54da79?w=800&q=80',
        previewUrl='https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        tags=['city', 'car', 'traffic', 'busy', 'urban', 'street'],
        score=0,
        confidence=89,
        matchType='combined',
        description='Busy city street traffic at rush hour'
    )
]

def analyze_filename_for_emotion(filename: str) -> str:
    """Intelligent semantic analysis based on filename"""
    filename_lower = filename.lower()
    
    # Keyword matching
    if any(kw in filename_lower for kw in ['sad', 'cry', 'tear', 'lonely', 'grief', 'depress', 'rain']):
        return 'sad'
    elif any(kw in filename_lower for kw in ['happy', 'joy', 'fun', 'laugh', 'smile', 'cheerful']):
        return 'happy'
    elif any(kw in filename_lower for kw in ['party', 'dance', 'excite', 'wow', 'celebrate']):
        return 'excitement'
    elif any(kw in filename_lower for kw in ['calm', 'peace', 'sleep', 'relax', 'yoga']):
        return 'calm'
    elif any(kw in filename_lower for kw in ['fear', 'scary', 'dark', 'horror', 'spooky']):
        return 'fear'
    elif any(kw in filename_lower for kw in ['nature', 'forest', 'tree', 'river', 'lake', 'mountain', 'green']):
        return 'nature'
    elif any(kw in filename_lower for kw in ['tech', 'cyber', 'code', 'screen', 'neon', 'future']):
        return 'tech'
    elif any(kw in filename_lower for kw in ['run', 'fast', 'sport', 'gym', 'move', 'action', 'fight']):
        return 'action'
    elif any(kw in filename_lower for kw in ['city', 'urban', 'car', 'traffic', 'street', 'build']):
        return 'urban'
    
    # Deterministic random based on filename hash
    emotion_keys = ['happy', 'sad', 'excitement', 'calm', 'fear', 'action', 'nature', 'urban']
    name_hash = sum(ord(c) for c in filename_lower)
    return emotion_keys[name_hash % len(emotion_keys)]

async def process_video_background(video_id: str, cloudinary_url: str, filename: str):
    """Simulate video processing with AI analysis"""
    import random
    
    try:
        # Simulate processing with progress updates
        progress = 0
        while progress < 100:
            await asyncio.sleep(0.3)
            progress += random.randint(2, 12)
            progress = min(95, progress) if progress < 100 else 100
            
            videos_db[video_id].progress = progress
            videos_db[video_id].status = "processing" if progress < 100 else "ready"
        
        # AI Analysis - Determine semantic profile
        emotion_key = analyze_filename_for_emotion(filename)
        profile = SEMANTIC_PROFILES[emotion_key]
        
        # Create searchable clip with Cloudinary URL
        new_clip = SearchResult(
            id=f"clip_{video_id}",
            videoId=video_id,
            videoFilename=filename,
            startSec=0,
            endSec=15,
            thumbnailUrl="",
            previewUrl=cloudinary_url,
            tags=profile['tags'],
            description=profile['description'],
            score=0,
            confidence=100,
            matchType='visual'
        )
        
        searchable_clips.insert(0, new_clip)
        videos_db[video_id].status = "ready"
        videos_db[video_id].progress = 100
        
    except Exception as e:
        print(f"Error processing video {video_id}: {e}")
        videos_db[video_id].status = "error"

@app.get("/")
async def root():
    return {"message": "Semantic Video Search API", "status": "running"}

@app.post("/api/upload", response_model=Video)
async def upload_video(file: UploadFile = File(...)):
    """Upload and process a video file"""
    
    # Validation
    if not file.content_type or not file.content_type.startswith('video/'):
        raise HTTPException(status_code=400, detail="Invalid file type. Only video files allowed.")
    
    # Read file to check size (50MB limit)
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large (Max 50MB)")
    
    # Save file and upload to Cloudinary
    video_id = str(uuid.uuid4())[:8]
    
    # Upload to Cloudinary
    try:
        upload_result = cloudinary.uploader.upload(
            content,
            resource_type="video",
            public_id=f"semantic_videos/{video_id}",
            folder="semantic_videos",
            overwrite=True
        )
        
        cloudinary_url = upload_result.get("secure_url")
        cloudinary_public_id = upload_result.get("public_id")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    
    # Create video entry
    video = Video(
        id=video_id,
        filename=file.filename or "uploaded_video.mp4",
        durationSec=0,
        uploadDate=datetime.now().isoformat(),
        status="queued",
        thumbnailUrl="",
        progress=0,
        cloudinaryUrl=cloudinary_url,
        cloudinaryPublicId=cloudinary_public_id
    )
    
    videos_db[video_id] = video
    
    # Start background processing
    asyncio.create_task(process_video_background(video_id, cloudinary_url, video.filename))
    
    return video

@app.get("/api/videos", response_model=List[Video])
async def get_videos():
    """Get all uploaded videos with their status"""
    return list(videos_db.values())

@app.get("/api/videos/{video_id}/stream")
async def stream_video(video_id: str, request: Request):
    """Redirect to Cloudinary URL for video streaming"""
    if video_id not in videos_db:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video = videos_db[video_id]
    
    if video.status != "ready":
        raise HTTPException(status_code=400, detail="Video not ready")
    
    if not video.cloudinaryUrl:
        raise HTTPException(status_code=404, detail="Video URL not available")
    
    # Redirect to Cloudinary (they handle Range requests automatically)
    return RedirectResponse(url=video.cloudinaryUrl)
        # Return full file
        return FileResponse(
            video_path,
            media_type="video/mp4",
            headers={
                "Accept-Ranges": "bytes",
                "Content-Length": str(file_size),
            }
        )

@app.post("/api/search", response_model=SearchResponse)
async def search_clips(query: str = Query(...), filters: Optional[SearchFilters] = None):
    """Semantic search for video clips"""
    start_time = time.time()
    
    if filters is None:
        filters = SearchFilters()
    
    if not query.strip():
        return SearchResponse(results=[], totalResults=0, executionTimeMs=10)
    
    query_lower = query.lower()
    query_tokens = [t for t in query_lower.split() if len(t) > 1]
    
    scored_results = []
    
    for clip in searchable_clips:
        score = 0
        match_reasons = []
        
        # 1. Exact Tag Match (Highest Priority)
        exact_tag_match = any(tag.lower() == query_lower for tag in clip.tags)
        
        # 2. Token-based Tag Matching
        matched_tags = []
        for tag in clip.tags:
            tag_lower = tag.lower()
            if any(
                tag_lower == token or
                (len(token) > 3 and token in tag_lower) or
                (len(tag_lower) > 3 and tag_lower in token)
                for token in query_tokens
            ):
                matched_tags.append(tag)
        
        if exact_tag_match:
            score = 0.95
            match_reasons.append(f"Exact tag: {query_lower}")
        elif matched_tags:
            score = 0.6 + min(0.35, (len(matched_tags) - 1) * 0.1)
            match_reasons.append(f"Tags: {', '.join(matched_tags)}")
        
        # 3. Description Match
        if query_lower in clip.description.lower():
            score = max(score, 0.5)
            score += 0.2
            match_reasons.append('Context match')
        else:
            matched_desc_tokens = [t for t in query_tokens if t in clip.description.lower()]
            if matched_desc_tokens:
                token_score = 0.3 * (len(matched_desc_tokens) / len(query_tokens))
                score += token_score
        
        # Normalize score
        score = min(0.99, score)
        
        # Determine match type
        match_type: Literal["visual", "combined", "tag_boost"] = 'visual'
        if exact_tag_match or (matched_tags and score > 0.7):
            match_type = 'tag_boost'
        if score > 0.85 and any('Context' in r for r in match_reasons):
            match_type = 'combined'
        
        if score >= filters.minScore:
            result = clip.model_copy()
            result.score = score
            result.matchType = match_type
            result.confidence = round(score * 100)
            scored_results.append(result)
    
    # Sort by score descending
    scored_results.sort(key=lambda x: x.score, reverse=True)
    
    execution_time = int((time.time() - start_time) * 1000)
    
    return SearchResponse(
        results=scored_results,
        totalResults=len(scored_results),
        executionTimeMs=execution_time
    )

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "videos_count": len(videos_db),
        "clips_count": len(searchable_clips)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
