import os
from dotenv import load_dotenv
load_dotenv()

# Set Cloudinary env vars for Vercel
os.environ["CLOUDINARY_CLOUD_NAME"] = os.getenv("CLOUDINARY_CLOUD_NAME", "")
os.environ["CLOUDINARY_API_KEY"] = os.getenv("CLOUDINARY_API_KEY", "")
os.environ["CLOUDINARY_API_SECRET"] = os.getenv("CLOUDINARY_API_SECRET", "")

from mangum import Mangum
import sys
from pathlib import Path

# Add backend to Python path
backend_path = Path(__file__).parent.parent / "backend"
sys.path.insert(0, str(backend_path))

from main import app

# Mangum adapter for AWS Lambda/Vercel
handler = Mangum(app, lifespan="off")
