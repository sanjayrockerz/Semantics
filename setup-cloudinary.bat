@echo off
echo.
echo ========================================
echo   Cloudinary Setup Helper
echo ========================================
echo.
echo Get your FREE Cloudinary credentials:
echo 1. Go to https://cloudinary.com/users/register_free
echo 2. Sign up (no credit card required)
echo 3. Copy your Cloud Name, API Key, and API Secret
echo.
echo ========================================
echo.
set /p cloud_name="Enter your CLOUDINARY_CLOUD_NAME: "
set /p api_key="Enter your CLOUDINARY_API_KEY: "
set /p api_secret="Enter your CLOUDINARY_API_SECRET: "
echo.
echo Creating .env file...
(
echo # Backend Cloudinary Configuration
echo CLOUDINARY_CLOUD_NAME=%cloud_name%
echo CLOUDINARY_API_KEY=%api_key%
echo CLOUDINARY_API_SECRET=%api_secret%
echo.
echo # Frontend API URL
echo VITE_API_URL=http://localhost:8000
) > .env
echo.
echo ✅ .env file created successfully!
echo.
echo Next steps:
echo 1. cd backend
echo 2. python main.py
echo.
echo Your videos will now be stored on Cloudinary! 🎬
echo.
pause
