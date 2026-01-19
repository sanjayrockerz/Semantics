import React, { useState, useCallback } from 'react';
import { UploadCloud, FileVideo, AlertTriangle, X, Sparkles } from 'lucide-react';
import { cn, formatFileSize } from '../lib/utils';
import { Button } from './ui/Button';

interface UploadAreaProps {
  onUpload: (files: File[]) => Promise<void>;
  isProcessing: boolean;
}

export const UploadArea: React.FC<UploadAreaProps> = ({ onUpload, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const validateFiles = (files: File[]): File[] => {
    const valid: File[] = [];
    let hasInvalid = false;
    
    files.forEach(f => {
      if (f.type.startsWith('video/') || f.name.match(/\.(mp4|mov|avi|mkv|webm)$/i)) {
        valid.push(f);
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
        setErrorMsg('Some files were ignored because they are not valid video formats.');
        setTimeout(() => setErrorMsg(null), 5000);
    }
    return valid;
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMsg(null);
    
    const droppedFiles = Array.from(e.dataTransfer.files) as File[];
    const validFiles = validateFiles(droppedFiles);
    
    if (validFiles.length > 0) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
          setSelectedFiles(prev => [...prev, ...validFiles]);
      }
    }
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;
    await onUpload(selectedFiles);
    setSelectedFiles([]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Validation Error Alert */}
      {errorMsg && (
          <div className="glass border-2 border-red-500/30 text-red-200 px-5 py-4 rounded-xl flex items-center gap-3 animate-slide-in shadow-xl shadow-red-500/10">
              <div className="relative">
                <AlertTriangle className="w-6 h-6 shrink-0 text-red-400" />
                <div className="absolute inset-0 bg-red-500 blur-lg opacity-50"></div>
              </div>
              <p className="text-sm font-medium flex-1">{errorMsg}</p>
              <button onClick={() => setErrorMsg(null)} className="hover:text-white transition-colors">
                  <X className="w-5 h-5" />
              </button>
          </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-3xl p-12 sm:p-16 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden group",
          isDragging ? "border-primary bg-gradient-to-br from-primary/10 to-purple-600/10 scale-[1.02] shadow-2xl shadow-primary/30" : "border-zinc-700 glass hover:border-primary/50",
          isProcessing && "opacity-50 pointer-events-none"
        )}
      >
        {/* Background Glow Effect */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-600/20 to-pink-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-3xl",
          isDragging && "opacity-100"
        )}></div>

        <input
          type="file"
          multiple
          accept="video/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={handleFileSelect}
          disabled={isProcessing}
        />
        
        <div className="relative mb-6 group-hover:scale-110 transition-transform duration-300">
          <div className={cn(
            "absolute inset-0 blur-2xl transition-opacity duration-500",
            isDragging ? "bg-primary opacity-70" : "bg-primary/30 opacity-0 group-hover:opacity-50"
          )}></div>
          <div className="relative glass p-6 rounded-3xl">
             <UploadCloud className={cn(
               "w-14 h-14 text-primary transition-all duration-300",
               isDragging && "animate-bounce"
             )} />
          </div>
        </div>
        
        <h3 className="text-2xl font-bold mb-3 text-white">
          {isDragging ? '✨ Drop Your Clips Here' : 'Drag & Drop Video Clips'}
        </h3>
        <p className="text-zinc-400 max-w-md mx-auto leading-relaxed">
          Support for <span className="text-white font-semibold">MP4, MOV, WEBM, AVI, MKV</span>
          <br />
          <span className="text-xs text-zinc-500">Files are analyzed with AI for semantic search</span>
        </p>

        {/* Click to Browse */}
        <div className="mt-6 px-6 py-2.5 glass rounded-xl text-sm text-zinc-300 border border-white/10 group-hover:border-primary/30 transition-colors">
          or <span className="text-primary font-semibold">click to browse</span>
        </div>
      </div>

      {/* Enhanced File Queue */}
      {selectedFiles.length > 0 && (
        <div className="glass border-2 border-primary/30 rounded-2xl p-6 space-y-4 animate-slide-in shadow-2xl shadow-primary/10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
             <div className="flex items-center gap-3">
               <Sparkles className="w-5 h-5 text-primary" />
               <h4 className="font-bold text-white text-lg">Ready to Upload</h4>
               <span className="px-2.5 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold border border-primary/30">
                 {selectedFiles.length} {selectedFiles.length === 1 ? 'File' : 'Files'}
               </span>
             </div>
             <Button 
                onClick={handleStartUpload} 
                isLoading={isProcessing}
                className="px-6 bg-gradient-to-r from-primary to-purple-600 hover:shadow-lg hover:shadow-primary/50"
             >
               {isProcessing ? 'Uploading...' : 'Start Upload'}
             </Button>
          </div>

          <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex items-center gap-4 p-4 glass rounded-xl group/file border border-white/5 hover:border-primary/30 transition-all duration-300">
                <div className="relative">
                  <FileVideo className="w-6 h-6 text-primary" />
                  <div className="absolute inset-0 bg-primary blur-md opacity-0 group-hover/file:opacity-50 transition-opacity"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                  <p className="text-xs text-zinc-500 font-mono">{formatFileSize(file.size)}</p>
                </div>
                <button 
                  onClick={() => removeFile(idx)}
                  className="px-3 py-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/30 opacity-0 group-hover/file:opacity-100 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};