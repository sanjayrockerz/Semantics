import React, { useState, useEffect } from 'react';
import { UploadArea } from '../components/UploadArea';
import { uploadVideo, getVideosStatus } from '../services/api';
import { Video } from '../types';
import { Loader2, CheckCircle2, XCircle, ArrowRight, Clock, AlertTriangle, Activity, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

export const UploadPage: React.FC = () => {
  const [queue, setQueue] = useState<Video[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const videos = await getVideosStatus();
      setQueue(videos);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleFilesUpload = async (files: File[]) => {
    setIsUploading(true);
    
    const uploadPromises = files.map(async (file) => {
        try {
            await uploadVideo(file);
        } catch (error: any) {
            console.error(`Failed to upload ${file.name}`, error);
            const failedVideo: Video = {
                id: `err_${Math.random()}`,
                filename: file.name,
                durationSec: 0,
                uploadDate: new Date().toISOString(),
                status: 'failed',
                thumbnailUrl: '',
                progress: 0,
                errorMessage: error.message || 'Upload failed'
            };
            setQueue(prev => [failedVideo, ...prev]);
        }
    });

    await Promise.all(uploadPromises);
    setTimeout(() => setIsUploading(false), 500);
  };

  const pendingCount = queue.filter(v => v.status === 'processing' || v.status === 'queued').length;
  const readyCount = queue.filter(v => v.status === 'ready').length;
  const failedCount = queue.filter(v => v.status === 'failed').length;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto gradient-bg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left: Upload Area */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-white">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-purple-200">
                Upload Queue
              </span>
            </h2>
            <p className="text-zinc-400 text-lg leading-relaxed">
              Drag and drop clips to index them. Our AI will analyze emotions, scenes, and objects automatically.
            </p>
          </div>
          
          <UploadArea onUpload={handleFilesUpload} isProcessing={isUploading} />

          {readyCount > 0 && (
             <div className="glass border-2 border-emerald-500/30 rounded-2xl p-6 shadow-xl shadow-emerald-500/10 animate-slide-in">
                 <div className="flex items-start gap-4">
                   <div className="relative">
                     <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                     <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50"></div>
                   </div>
                   <div className="flex-1">
                     <h3 className="text-emerald-400 font-bold text-xl mb-2">Ingestion Complete</h3>
                     <p className="text-zinc-300 text-sm mb-4">
                        <span className="font-bold text-white">{readyCount}</span> clips are indexed and ready for semantic search.
                     </p>
                     <Link 
                        to="/" 
                        className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all hover:shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
                     >
                         Start Searching <ArrowRight className="w-4 h-4 ml-2" />
                     </Link>
                   </div>
                 </div>
             </div>
          )}
        </div>

        {/* Right: Progress List */}
        <div className="glass rounded-2xl p-6 h-[700px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-primary" />
                  <h3 className="text-xl font-bold text-white">Processing Status</h3>
                </div>
                <div className="flex items-center gap-2">
                  {pendingCount > 0 ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs text-primary font-semibold">{pendingCount} Active</span>
                    </div>
                  ) : (
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-zinc-500 border border-white/10">
                      Idle
                    </span>
                  )}
                </div>
            </div>

            {/* Stats Row */}
            {queue.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-white">{readyCount}</div>
                  <div className="text-xs text-zinc-500">Completed</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-primary">{pendingCount}</div>
                  <div className="text-xs text-zinc-500">Processing</div>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-red-400">{failedCount}</div>
                  <div className="text-xs text-zinc-500">Failed</div>
                </div>
              </div>
            )}

            {queue.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
                    <Clock className="w-12 h-12 mb-4 opacity-30 animate-float" />
                    <p className="text-lg font-medium">No active jobs</p>
                    <p className="text-sm text-zinc-600 mt-1">Upload videos to get started</p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                    {queue.slice().reverse().map((video, index) => (
                        <div 
                            key={video.id} 
                            className={cn(
                                "p-4 rounded-xl border-2 flex items-center gap-3 transition-all duration-300 animate-slide-in",
                                video.status === 'failed' 
                                    ? "glass border-red-500/30 bg-red-500/5" 
                                    : video.status === 'ready'
                                    ? "glass border-emerald-500/30 bg-emerald-500/5"
                                    : "glass border-primary/30"
                            )}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Status Icon */}
                            <div className="shrink-0 relative">
                                {video.status === 'processing' || video.status === 'queued' ? (
                                    <>
                                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                                      <div className="absolute inset-0 bg-primary blur-md opacity-50"></div>
                                    </>
                                ) : video.status === 'ready' ? (
                                    <>
                                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                                      <div className="absolute inset-0 bg-emerald-500 blur-md opacity-50"></div>
                                    </>
                                ) : (
                                    <>
                                      <AlertTriangle className="w-6 h-6 text-red-500" />
                                      <div className="absolute inset-0 bg-red-500 blur-md opacity-50"></div>
                                    </>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-2">
                                    <p className={cn("text-sm font-semibold truncate", video.status === 'failed' ? "text-red-200" : "text-white")}>
                                        {video.filename}
                                    </p>
                                    <p className="text-xs font-mono text-zinc-400 ml-2 px-2 py-0.5 rounded bg-white/5">{video.progress}%</p>
                                </div>
                                
                                {video.status === 'failed' ? (
                                    <p className="text-xs text-red-400">{video.errorMessage || 'Upload failed'}</p>
                                ) : (
                                    <>
                                        <p className="text-xs text-zinc-400 capitalize mb-2">
                                            {video.status === 'processing' ? '🔍 Analyzing visual data...' : video.status === 'ready' ? '✅ Ready for search' : '⏳ Queued'}
                                        </p>
                                        {/* Enhanced Progress Bar */}
                                        <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden relative">
                                            <div 
                                                className={cn(
                                                    "h-full transition-all duration-500 relative",
                                                    video.status === 'ready' ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : "bg-gradient-to-r from-primary to-purple-600"
                                                )}
                                                style={{ width: `${video.progress}%` }} 
                                            >
                                              {video.status === 'processing' && (
                                                <div className="absolute inset-0 shimmer"></div>
                                              )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};