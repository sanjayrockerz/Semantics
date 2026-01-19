import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize } from 'lucide-react';
import { cn, formatTimecode } from '../lib/utils';

interface VideoPlayerProps {
  src: string;
  startSec: number;
  endSec: number;
  poster?: string;
  autoPlay?: boolean;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, startSec, endSec, poster, autoPlay = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(startSec);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // Sync start time on mount or change
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = startSec;
      setCurrentTime(startSec);
      setProgress(0);
      if (autoPlay) {
        // Small timeout to allow the browser to load the new resource
        setTimeout(() => handlePlay(), 100);
      } else {
        setIsPlaying(false);
        videoRef.current.pause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, startSec, endSec, autoPlay]);

  // Monitor playback to enforce clip boundaries
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      const duration = Math.max(0.1, endSec - startSec); // Prevent divide by zero
      const elapsed = Math.max(0, video.currentTime - startSec);
      const percent = Math.min(100, (elapsed / duration) * 100);
      setProgress(percent);

      // Add a small buffer (0.1s) to endSec checks to handle floating point drift,
      // but strictly reset if it goes past.
      if (video.currentTime >= endSec) {
        video.pause();
        video.currentTime = startSec;
        // Auto loop
        if (isPlaying) {
            video.play().catch(() => setIsPlaying(false));
        }
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [endSec, startSec, isPlaying]);

  const handlePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.currentTime < startSec || videoRef.current.currentTime >= endSec) {
        videoRef.current.currentTime = startSec;
      }
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Autoplay prevented:", err);
        setIsPlaying(false);
      });
    }
  };

  const handlePause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative group rounded-xl overflow-hidden bg-black aspect-video border border-white/10 shadow-2xl">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        className="w-full h-full object-contain"
        onClick={isPlaying ? handlePause : handlePlay}
        playsInline
      />

      {/* Custom Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-black/40 flex flex-col justify-end p-4 transition-opacity duration-300",
        isPlaying ? "opacity-0 group-hover:opacity-100" : "opacity-100"
      )}>
        
        {/* Center Play Button (Large) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-full border border-white/20">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
        )}

        <div className="space-y-2">
           {/* Progress Bar */}
          <div className="h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={isPlaying ? handlePause : handlePlay}
                className="text-white hover:text-primary transition-colors"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
              </button>
              
              <span className="text-xs font-mono text-white/80">
                {formatTimecode(currentTime)} / {formatTimecode(endSec)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={toggleMute} className="text-white hover:text-white/80">
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
