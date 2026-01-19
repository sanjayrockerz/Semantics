import React, { useState } from 'react';
import { SearchResult } from '../types';
import { ConfidenceBadge } from './ui/Badge';
import { Button } from './ui/Button';
import { VideoPlayer } from './VideoPlayer';
import { Copy, Tag, Play, Clock, Trash2 } from 'lucide-react';
import { formatTimecode } from '../lib/utils';
import { deleteVideo } from '../services/api';

interface ResultCardProps {
  result: SearchResult;
}

export const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleCopyTimecode = () => {
    navigator.clipboard.writeText(formatTimecode(result.startSec));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this video?')) return;
    
    setIsDeleting(true);
    try {
      await deleteVideo(result.videoId);
      window.location.reload(); // Refresh to show updated list
    } catch (error) {
      console.error('Failed to delete video:', error);
      alert('Failed to delete video');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleVideoThumbnailLoad = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    e.currentTarget.currentTime = result.startSec;
  };

  return (
    <div className="group/card glass rounded-2xl overflow-hidden hover:border-primary/50 border-2 border-transparent transition-all duration-500 shadow-lg hover:shadow-2xl hover:shadow-primary/20 flex flex-col h-full hover:scale-[1.02] transform">
      {/* Media Area */}
      <div className="relative bg-black aspect-video cursor-pointer overflow-hidden" onClick={() => setShowPreview(true)}>
        {/* Delete Button */}
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 z-10 bg-red-500/90 hover:bg-red-600 text-white p-2 rounded-lg transition-all duration-200 hover:scale-110 disabled:opacity-50"
          title="Delete video"
        >
          <Trash2 className="w-4 h-4" />
        </button>
          {showPreview ? (
            <VideoPlayer 
              src={result.previewUrl} 
              startSec={result.startSec} 
              endSec={result.endSec} 
              poster={result.thumbnailUrl}
              autoPlay={true}
            />
          ) : (
            <>
               {result.thumbnailUrl ? (
                 <img 
                    src={result.thumbnailUrl} 
                    alt="Thumb" 
                    className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500" 
                 />
               ) : (
                 <video 
                    src={result.previewUrl} 
                    className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500"
                    muted
                    playsInline
                    onLoadedMetadata={handleVideoThumbnailLoad}
                    onMouseOver={(e) => e.currentTarget.play()}
                    onMouseOut={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = result.startSec;
                    }}
                 />
               )}
               
               {/* Enhanced Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <div className="bg-white/20 backdrop-blur-md rounded-full p-4 group-hover/card:scale-110 transition-transform duration-300">
                     <Play className="w-8 h-8 text-white fill-white" />
                   </div>
                 </div>
               </div>
               
               {/* Timecode Badge */}
               <div className="absolute bottom-3 right-3 glass px-2.5 py-1.5 rounded-lg text-xs font-mono text-white pointer-events-none flex items-center gap-1.5 shadow-xl">
                 <Clock className="w-3 h-3" />
                 {formatTimecode(result.startSec)}
               </div>
            </>
          )}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-white text-base truncate mb-2" title={result.videoFilename}>
              {result.videoFilename}
            </h3>
            <div className="flex flex-wrap gap-1.5">
                {result.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 rounded-md text-xs glass border border-white/10 text-zinc-300 hover:border-primary/30 hover:text-primary transition-all">
                        <Tag className="w-3 h-3 mr-1" /> {tag}
                    </span>
                ))}
                {result.tags.length > 3 && (
                  <span className="px-2 py-1 text-xs text-zinc-500">+{result.tags.length - 3}</span>
                )}
            </div>
          </div>
          <ConfidenceBadge score={result.score} />
        </div>

        {/* Semantic Context */}
        {result.matchType === 'tag_boost' && (
             <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-200 font-medium flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></div>
                 Boosted by emotion tag
             </div>
        )}

        {/* Footer Actions */}
        <div className="mt-auto pt-4 border-t border-white/10 flex justify-between items-center">
             <span className="text-xs text-zinc-500 font-mono flex items-center gap-1.5">
                 <Clock className="w-3.5 h-3.5" />
                 {formatTimecode(result.endSec - result.startSec)} clip
             </span>
             <Button 
                variant="ghost" 
                size="sm" 
                className={`h-7 text-xs transition-all ${copied ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : ''}`}
                onClick={(e) => { e.stopPropagation(); handleCopyTimecode(); }}
            >
                <Copy className="w-3 h-3 mr-1.5" />
                {copied ? 'Copied!' : 'Copy TC'}
            </Button>
        </div>
      </div>
    </div>
  );
};