export type ProcessingStatus = 'queued' | 'processing' | 'ready' | 'failed';

export interface Video {
  id: string;
  filename: string;
  durationSec: number;
  uploadDate: string;
  status: ProcessingStatus;
  thumbnailUrl: string;
  progress: number; // 0-100 for processing progress
  errorMessage?: string; // Specific error detail
}

export interface Clip {
  id: string;
  videoId: string;
  videoFilename: string;
  startSec: number;
  endSec: number;
  thumbnailUrl: string;
  previewUrl: string;
  tags: string[]; // e.g., ['happy', 'outdoor', 'person']
}

export interface SearchResult extends Clip {
  score: number; // Normalized 0-1
  confidence: number; // 0-100 representation
  matchType: 'visual' | 'audio' | 'tag_boost' | 'combined';
  description: string;
}

export interface SearchResponse {
  results: SearchResult[];
  totalResults: number;
  executionTimeMs: number;
}

export interface SearchFilters {
  minScore: number;
  requiredTags: string[];
}